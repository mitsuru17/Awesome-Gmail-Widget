function reset() {
  $("#showemail").val(localStorage.showemail);
  $("#showemailaddress").val(localStorage.showemailaddress);
  $("#showemailsender").val(localStorage.showemailsender);
  $("#showemailsummary").val(localStorage.showemailsummary);
}

function go2antp() {
  window.location = "chrome-extension://mgmiemnjjchgkmgbeljfocdjjnpjnmcg/ntp.html";
}

$(document).ready(function() {
  reset();

  if( localStorage.showemail === "N") {
    $(".sender").hide();
    $(".summary").hide();
  } else {
    $(".sender").show();
    $(".summary").show();
  }

  if( localStorage.showemailsummary === "N") {
    $(".sender").hide();
  } else {
    $(".sender").show();
  }

  $("form").submit(function(e) {
    e.preventDefault();
  });

  $(document).on("click", "#antp", function() {
    go2antp();
  });

  $('#colorSelector').ColorPicker({
    flat: true,
    color: (localStorage.color ? localStorage.color : "#1B84C6"),
    onChange: function (hsb, hex, rgb) {
      localStorage.color = "#" + hex;
    }
  });

  $('#showemail').change(function() {
    localStorage.showemail = $(this).val();
    if( $(this).val() === "N") {
      $(".sender").hide();
      $(".summary").hide();
    } else {
      $(".sender").show();
      $(".summary").show();
    }
  });

  $('#showemailaddress').change(function() {
    localStorage.showemailaddress = $(this).val();
  });

  $('#showemailsender').change(function() {
    localStorage.showemailsender = $(this).val();
  });

  $('#showemailsummary').change(function() {
    localStorage.showemailsummary = $(this).val();
    if( $(this).val() === "N") {
      $(".sender").hide();
    } else {
      $(".sender").show();
    }
  });
});

var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
s.type = 'text/javascript';
s.async = true;
s.src = 'https://api.flattr.com/js/0.6/load.js?mode=auto';
t.parentNode.insertBefore(s, t);


var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
po.src = 'https://apis.google.com/js/plusone.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);