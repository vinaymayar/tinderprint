$(function() {

  $("#logout-button").click(function() {
    $.get("/users/logout",
          function(data, textStatus, jqXHR) {
            window.location = "/";
          });
  });

});
