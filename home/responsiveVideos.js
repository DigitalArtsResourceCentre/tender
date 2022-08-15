// Vanilla version of FitVids

(function(window, document, undefined) {
  "use strict";

  // List of Video Vendors embeds you want to support
  var players = ['iframe[src*="youtube.com"]', 'iframe[src*="vimeo.com"]'];

  // Select videos
  var fitVids = document.querySelectorAll(players.join(","));

  // If there are videos on the page...
  if (fitVids.length) {
    // Loop through videos
    for (var i = 0; i < fitVids.length; i++) {
      // Get Video Information
      var fitVid = fitVids[i];
      var width = fitVid.getAttribute("width");
      var height = fitVid.getAttribute("height");
      var aspectRatio = height / width;
      var parentDiv = fitVid.parentNode;

      // Wrap it in a DIV
      var div = document.createElement("div");
      div.className = "fitVids-wrapper";
      div.style.paddingBottom = aspectRatio * 100 + "%";
      parentDiv.insertBefore(div, fitVid);
      fitVid.remove();
      div.appendChild(fitVid);

      // Clear height/width from fitVid
      fitVid.removeAttribute("height");
      fitVid.removeAttribute("width");
    }
  }
})(window, document);