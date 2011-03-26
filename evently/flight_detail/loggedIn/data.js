function(r) {
  //$.log(resp.app_date)  
  var app = $$(this).app;
  var dbname = app.db.name;
  var pairList = [];

  if (r._rev) {
    for (idx in r.pairs) {
      entry = {};
      pair = r.pairs[idx].value;
      vet = pair.vet[0];
      entry["vet_name"] = vet.name;
      entry["vet_city"] = vet.city;
      var assignedGuardians = 0;
      if (pair.grd) {
        entry["guardians"] = pair.grd.length;
        grd = pair.grd[0];
        entry["grd_name"] = grd.name;
        entry["grd_city"] = grd.city;
      }
      pairList.push(entry);
    }

    var result = {
        db_name:               dbname,
        id:                    r._id,
        raw_data_lnk:          "(raw data)",
        rev:                   r._rev,
        type:                  r.type,
        flight_name:           r.name,
        capacity:              r.capacity,
        flight_date:           r.flight_date,
        pairs:                 pairList
    }

  } else {

    var result = {
        db_name:               dbname,
        id:                    "",
        raw_data_lnk:          "",
        rev:                   "",
        type:                  "Flight",
        flight_name:           "",
        capacity:              "",
        flight_date:           ""
    }

  }

  return result;
}

//@ sourceURL=/flight_detail/data.js
