// $.couch.app() loads the design document from the server and 
// then calls our application.
$.couch.app(function(app) {  


  $("#flight_detail").evently("flight_detail", app);
  $.evently.connect($("#account"), $("#flight_detail"), ["loggedIn", "loggedOut"]);

});

function ISODateString(d){

  function pad(n){
    return n<10 ? '0'+n : n
  }

  return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
}
