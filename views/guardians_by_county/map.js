function(doc) {
  if (doc.type == "Guardian" 
      && doc.veteran.id == "") 
  {
    emit([doc.flight.id,
          doc.address.state.toUpperCase(),
          doc.address.county.toUpperCase(),
          doc.app_date], 
         { "name"    : doc.name.first + " " + doc.name.last, 
           "street"  : doc.address.street, 
           "city"    : doc.address.city
         });
  }
}

//Same county:  http://localhost:5984/hf/_design/basic/_view/guardians_by_county?limit=50&startkey=["WI","OZAUKEE"]&endkey=["WI","OZAUKEE\ufff0"]

