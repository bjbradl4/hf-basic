$.couch.app(function(app) {  
  $("#flight_detail").evently("flight_detail", app);
  $.evently.connect($("#account"), $("#flight_detail"), ["loggedIn", "loggedOut"]);
});

function UpdateGuardianDataGrid(vetId, grd) {
  // Update the grid.
  var vetRow = $("tr.DataRow[vetid='" + vetId + "']");
  var vetData = vetRow.children("td");
  var training = "";  
  if (grd.flight.training) {
    if (grd.flight.training_complete) {
      training = "* ";
    }
    training += grd.flight.training;
  }
  
  if (grd.name) {
    vetData[11].textContent = grd.name.first + " " + grd.name.last;
    vetData[10].textContent = grd.address.city + ", " + grd.address.state;
    vetData[9].textContent = training;
    vetData[8].textContent = grd.medical.experience;
    vetData[7].textContent  = grd.flight.bus;
    vetData[6].firstChild.value = grd.flight.seat;
  } else {
    vetData[11].textContent = "";
    vetData[10].textContent = "";
    vetData[9].textContent = "";
    vetData[8].textContent = "";
    vetData[7].textContent  = "";
    vetData[6].firstChild.value = "";
  }
}

function PairGuardianToVeteran(app, vetId, grdIdNew, user) {
  var timestamp = ISODateString(new Date());
  var grdIdOld;
  var vetName;

  app.db.openDoc(vetId, {
    success : function(vetdoc) {
      vetName = vetdoc.name.first + " " + vetdoc.name.last;
      grdIdOld = vetdoc.guardian.id;

      // If an old guardian exists, unpair and log.
      if (grdIdOld.length === 32) {
        app.db.openDoc(grdIdOld, {
          success : function(oldgrd) {
            for (vetIdx in oldgrd.veteran.pairings) {
              if (oldgrd.veteran.pairings[vetIdx].id === vetId) {
                oldgrd.veteran.history.push({
                  id: timestamp,
                  change: "unpaired from: " + vetName + " by: " + user
                });
                oldgrd.metadata.updated_at = timestamp;
                oldgrd.metadata.updated_by = user;

                oldgrd.veteran.pairings.splice(vetIdx, 1);
                app.db.saveDoc(oldgrd, {
                  success : function() {}
                });
                break;
              }
            }
          }
        });
      }

      // Get the new guardian.
      if (grdIdNew.length === 32) {
        app.db.openDoc(grdIdNew, {
          success : function(newgrd) {
            newgrd.veteran.history.push({
              id: timestamp,
              change: "paired to: " + vetName + " by: " + user
            });
            newgrd.veteran.pairings.push({
              id: vetId,
              name: vetName
            });
            newgrd.metadata.updated_at = timestamp;
            newgrd.metadata.updated_by = user;

            app.db.saveDoc(newgrd, {
              success : function() {}
            });

            // Update veteran history.
            grdName = newgrd.name.first + " " + newgrd.name.last;
            vetdoc.guardian.history.push({
              id: timestamp,
              change: "paired to: " + grdName + " by: " + user
            });
            vetdoc.guardian.id = grdIdNew;
            vetdoc.guardian.name = grdName;
            vetdoc.metadata.updated_at = timestamp;
            vetdoc.metadata.updated_by = user;

            app.db.saveDoc(vetdoc, {
              success : function() {}
            });
            UpdateGuardianDataGrid(vetId, newgrd);
          }
        });
      } else {
            // Update veteran history.
            vetdoc.guardian.history.push({
              id: timestamp,
              change: "unpaired from: " + vetdoc.guardian.name + " by: " + user
            });
            vetdoc.guardian.id = "";
            vetdoc.guardian.name = "";
            vetdoc.metadata.updated_at = timestamp;
            vetdoc.metadata.updated_by = user;

            app.db.saveDoc(vetdoc, {
              success : function() {
              }
            });
            UpdateGuardianDataGrid(vetId, {});
      }
    }
  });
}

function assignToBus(app, docId, newBus, user) {
  app.db.openDoc(docId, {
    success : function(doc) {
      if (doc.flight) {
        if (doc.flight.history) {
          doc.flight.history.push({
            id: ISODateString(new Date()),
            change: "changed bus from: " + doc.flight.bus + " to: " + newBus + " by: " + user
          });
        }
        doc.flight.bus = newBus;
        app.db.saveDoc(doc, {
          success : function() {}
        });
      }
    }
  });
}

function changeSeat(app, docId, newSeat, user) {
  app.db.openDoc(docId, {
    success : function(doc) {
      if (doc.flight) {
        if (doc.flight.history) {
          doc.flight.history.push({
            id: ISODateString(new Date()),
            change: "changed seat from: " + doc.flight.seat + " to: " + newSeat + " by: " + user
          });
        }
        doc.flight.seat = newSeat;
        app.db.saveDoc(doc, {
          success : function() {}
        });
      }
    }
  });
}

function updateCounts() {
  var buses = $("td.colBus");
  var busTally = {
    "None": [],
    "Alpha1": [],
    "Alpha2": [],
    "Alpha3": [],
    "Alpha4": [],
    "Alpha5": [],
    "Bravo1": [],
    "Bravo2": [],
    "Bravo3": [],
    "Bravo4": [],
    "Bravo5": []
  };
    
  $.each(buses, function() {
    var bus = $(this);
    var busName = bus.text();
    if (busName.length > 3) {
      var pType = bus.attr("name"), pId = "";
      if (pType === "vet_bus") {
        pId = bus.parent().attr("vetid");
      }
      if (pType === "grd_bus") {
        pId = bus.parent().attr("grdid");
      }
      if (pId.length > 0) busTally[busName].push(pId);
    }
  });

  var alphaCount = 0, bravoCount = 0, noneCount = 0;
  for (var busKey in busTally) {
    var cnt = strUnique(busTally[busKey]).length;
    $("#" + busKey).val(cnt);
    if (busKey.substr(0, 5) === "Alpha") {
      alphaCount += cnt;
    } else if (busKey.substr(0, 5) === "Bravo") {
      bravoCount += cnt;
    } else {
      noneCount += cnt;
    }
  }
  $("#alphaCount").val(alphaCount);
  $("#bravoCount").val(bravoCount);
  $("#noneCount").val(noneCount);
  var alphaNFVets = $("td.nofly").filter("td.Veteran").siblings("td[name='vet_bus']").filter(":contains('Alpha')").length;
  var bravoNFVets = $("td.nofly").filter("td.Veteran").siblings("td[name='vet_bus']").filter(":contains('Bravo')").length;
  var noneNFVets =  $("td.nofly").filter("td.Veteran").siblings("td[name='vet_bus']").filter(":contains('None')").length;
  var alphaNFGrds = $("td.nofly").filter("td.Guardian").siblings("td[name='grd_bus']").filter(":contains('Alpha')").length;
  var bravoNFGrds = $("td.nofly").filter("td.Guardian").siblings("td[name='grd_bus']").filter(":contains('Bravo')").length;
  var noneNFGrds =  $("td.nofly").filter("td.Guardian").siblings("td[name='grd_bus']").filter(":contains('None')").length;
  alphaFlightCount
  $("#alphaFlightCount").val(alphaCount - alphaNFVets - alphaNFGrds);
  $("#bravoFlightCount").val(bravoCount - bravoNFVets - bravoNFGrds);
  $("#noneFlightCount").val(noneCount - noneNFVets - noneNFGrds);
}
