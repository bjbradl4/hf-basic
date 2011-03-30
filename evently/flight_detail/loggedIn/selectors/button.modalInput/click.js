function() {
  var vetId = $(this).parent().parent().attr("vetid");
  $("#vet_name")[0].textContent = $(this).parent().siblings()[1].textContent;
  var app = $$(this).app;

  app.db.openDoc(vetId, {
    success : function(doc) {

      var startZip = parseInt(doc.address.zip.substr(0, 5));
      var endZip = startZip + 1;
      $("#byZip")[0].textContent = startZip;
      var zipSel = $("select[name='ByZipSel']");
      zipSel.find('option').remove().end();
      var zipOpt = zipSel.attr('options');
      app.db.view("basic/guardians_by_zip", {
        descending : false,
        limit: 10,
        startkey : [ startZip.toString() ],
        endkey : [ endZip.toString() ],
        success: function(resp) {
          selected = true;
          for (idx in resp.rows) {
            row = resp.rows[idx];
            entry = row.value.name + " | " + row.value.street + " | " + row.value.city;
            zipOpt[zipOpt.length] = new Option(entry, row.id, selected, selected);
            selected = false;
          }
        }
      })



      $("#trigger").click();
    }
  });

  return false;
};

//@ sourceURL=flight_detail/loggedIn/selectors/#.modalInput/click.js
