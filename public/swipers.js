$(function() {

  $("#swipe-left").click(function() {
    $.post("swipe-left", {
      candidate: $("#candidate").val()
    }, function(data, textStatus, jqXHR) {
      window.location = "candidates";
    });
  });

  $("#swipe-right").click(function() {
    $.post("swipe-right", {
      candidate: $("#candidate").val()
    }, function(data, textStatus, jqXHR) {
      if(data.match) {
        var okay = confirm("It's a match! Check your inbox to start messaging. Click OK to see more candidates!");
        if(okay) {
          window.location = "candidates";
        }
      } else {
        console.log(textStatus);
        window.location = "candidates";
      }
    });
  });
});
