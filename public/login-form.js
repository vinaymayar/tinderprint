$(function() {
  $("#sign-up-button").click(function() {
    window.location = "/signup?username=" + $("#username-input").val();
  });
});
