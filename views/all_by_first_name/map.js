function(doc) {
  if ((doc.name) && (doc.name.first)) {
    var ptype = doc.type;
    var pairing = "-";
    var pairingId = "";
    if (ptype == "Veteran") {
      pairing = (doc.guardian.name || "None");
      pairingId = (doc.guardian.id || "");
    } 
    if (ptype == "Guardian") {
      pairing = "None";
      if ((doc.veteran.pairings) && (doc.veteran.pairings.length > 0)) {
        pairing = (doc.veteran.pairings[0].name || "None");
        pairingId = (doc.veteran.pairings[0].id || "");
      }
    }
    var flt = {};
    if (doc.flight) {
      var flt = doc.flight;
    } 
    emit([doc.name.first.replace(/['\. ]/g, '')], 
         {"type": ptype,
           "name": doc.name.first + " " + doc.name.last, 
           "city": doc.address.city + ", " + doc.address.state, 
           "appdate": doc.app_date,
           "flight": (flt.id || "-"),
           "status": (flt.status || "-"),
           "pairing": pairing,
           "pairingId": pairingId
         });
  }
}
