$(document).ready(function() {
  var width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  var height = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  // $("#audio").stop("true").delay('5000').queue(function() {
  //     $(this).html('<embed src="static/museum.mp3" loop="true" autostart="true" hidden="true" />');
  // });

  if (height < 800) {
    $("#gradient").css("height", height - 73);
    initTerm();
  } else {
    $("#rterm")
      .delay("1500")
      .queue(function() {
        initTerm();
      });
  }
});

function initTerm() {
  this.term = rTerm({
    height: $("#gradient").height() * 0.85,
    username: "korolr",
    file: "./static/contact.json",
    saveStrings: true
  });
}
