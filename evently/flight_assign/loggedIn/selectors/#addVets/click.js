function() {
  var app = $$(this).app;
  var user = $("#user_name").text();
  var flightName = $("#flightName").val();
  var vetQty = $("#vetQty").val();
  var timestamp = ISODateString(new Date());

  if ((vetQty < 1) || (vetQty > 100)) {
    return true;
  }

  var added = 0;

  app.db.view("basic/waitlist_veterans", {
    limit : vetQty,
    descending : false,
    include_docs: true,
    type : "newRows",
    success: function(resp) {
      rowCount = resp.rows.length;
      for (row in resp.rows) {
        doc = resp.rows[row].doc;
        oldFlight = doc.flight.id;
        doc.flight.id = flightName;
        doc.flight.history.push({
          id: timestamp,
          change: "changed flight from: " + oldFlight + " to: " + flightName + " by: " + user
        });

        app.db.saveDoc(doc, {
          success : function() {
            added++;
            if (added == rowCount) {
              //alert("Added " + added.toString());
              window.location.reload();
            }
          }
        });
      }
    }
  });

  $("#vetQty").val("0");
  return true;
};

//@ sourceURL=flight_assign/loggedIn/selectors/#addVets~click.js
