function() {

  $("#app_date").dateinput({
    format: 'yyyy-mm-dd',
    selectors: true,
    min: -300,
    max: 1,
    speed: 100
  });

  $("#birth_date").dateinput({
    format: 'yyyy-mm-dd',
    selectors: true,
    yearRange: [-70,-18],
    speed: 100
  });

  $("#form-Grd").validator();

  // Handle shirt size selection.
  var storedShirtSize = $("#raw_shirt_size").attr('value').toUpperCase();
  $("#shirt_size").val(storedShirtSize);

  var validShirtSizes = [ "None", "S", "M", "L", "XL", "XXL", "XXXL" ];
  $("#shirt_size").validator({inputEvent: "blur"});
  var shirtSizeErr = "Please make a selection.";
  if ($("#raw_shirt_size").attr('value').length > 0) {
    $("#shirt_size")
    shirtSizeErr += " (stored value: " + $("#raw_shirt_size").attr('value') + ")";
  }
  $.tools.validator.fn("#shirt_size", shirtSizeErr,
    function(input, value) {
    return (jQuery.inArray(value, validShirtSizes) >= 0);
  });

  var vetId = $("#veteran_id");
  if (vetId.attr('value').length == 0) {
    $("#vet_edit_link").hide();
  }

  $(this).show();
};

//@ sourceURL=/grdedit/after.js
