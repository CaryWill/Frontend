// @jsx Didact.createElement
import { Didact as React } from "./component-state.js";

class Cell extends Didact.Component {
  render() {
    var _props = this.props,
        text = _props.text,
        delay = _props.delay;
    wait(delay);
    return Didact.createElement("td", null, text);
  }

}

class Demo extends Didact.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0,
      // the number shown on each Cell
      size: 6,
      // the size of a row
      period: 1000,
      // the time (in ms) between updates
      delay: 3 // the delay (in ms) for the render of each Cell

    };
    this.changeDelay = this.changeDelay.bind(this);
    this.changePeriod = this.changePeriod.bind(this);
    this.tick = this.tick.bind(this);
    this.tick();
  }

  tick() {
    var _this = this;

    setTimeout(function () {
      _this.setState({
        elapsed: _this.state.elapsed + 1
      });

      _this.tick();
    }, this.state.period);
  }

  changeDelay(e) {
    this.setState({
      delay: +e.target.value
    });
  }

  changePeriod(e) {
    this.setState({
      period: +e.target.value
    });
  }

  render() {
    var _state = this.state,
        elapsed = _state.elapsed,
        size = _state.size,
        delay = _state.delay,
        period = _state.period;
    var text = elapsed % 10;
    var array = Array(size).fill();
    return Didact.createElement("div", {
      style: "display:flex"
    }, Didact.createElement("table", null, Didact.createElement("tbody", null, array.map((x, key) => Didact.createElement("tr", {
      key: key
    }, array.map((_, $1) => Didact.createElement(Cell, {
      key: $1,
      text: text,
      delay: delay
    })))))), Didact.createElement("div", null, Didact.createElement("p", null, "The table refreshes every ", Didact.createElement("b", null, Math.round(period), " ms")), Didact.createElement("input", {
      id: "period-range",
      type: "range",
      min: "200",
      max: "1000",
      step: "any",
      value: period,
      onChange: this.changePeriod
    }), Didact.createElement("p", null, "The render of each cell takes ", Didact.createElement("b", null, delay.toFixed(2), " ms")), Didact.createElement("input", {
      id: "delay-range",
      type: "range",
      min: "0",
      max: "10",
      step: "any",
      value: delay,
      onChange: this.changeDelay
    }), Didact.createElement("p", null, "So, sync rendering the full table will keep the main thread busy for", " ", Didact.createElement("b", null, (delay * size * size).toFixed(2), "ms"))));
  }

}

function wait(ms) {
  var start = performance.now();

  while (performance.now() - start < ms) {}
}

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

const rootDom = document.getElementById("root");
Didact.render(Didact.createElement(Demo, null), rootDom);