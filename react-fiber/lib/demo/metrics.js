(function () {
  var frames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 150;
  var colWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "2px";
  var container = document.createElement("div");
  container.style.position = "fixed";
  container.style.right = "10px";
  container.style.top = "0";
  container.style.zIndex = "99999";

  for (var _i = 0; _i < frames; _i++) {
    var fc = document.createElement("div");
    fc.style.background = "red";
    fc.style.width = colWidth;
    fc.style.display = "inline-block";
    fc.style.verticalAlign = "top";
    fc.style.opacity = "0.8";
    container.appendChild(fc);
    fc.style.height = "16px";
  }

  var last = performance.now();
  var i = 0;

  function refresh() {
    var now = performance.now();
    var diff = now - last;
    last = now;
    container.childNodes[i % frames].style.background = "red";
    i++;
    container.childNodes[i % frames].style.background = "black";
    container.childNodes[i % frames].style.height = diff + "px";
    requestAnimationFrame(refresh);
  }

  requestAnimationFrame(refresh);
  document.body.appendChild(container);
})();