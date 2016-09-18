$(function() {

  $("#logout-button").click(function() {
    $.get("/logout",
          function(data, textStatus, jqXHR) {
            window.location = "/";
          });
  });

});
