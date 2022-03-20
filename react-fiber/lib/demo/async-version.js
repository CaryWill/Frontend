// @jsx Didact.createElement
// import { Didact } from "../fiber-reconciler/new-fiber.js";
import { Didact } from "../fiber-reconciler/hooks.js";
import "./metrics.js";

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
      delay: 10 // the delay (in ms) for the render of each Cell

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

function Counter() {
  // const [state, setState] = Didact.useState(1);
  const [count, setCount] = Didact.useState(0);
  return Didact.createElement("div", null, count === 0 && Didact.createElement("div", null, "23"), Didact.createElement("h1", null, "Count: ", count), Didact.createElement("div", null, Didact.createElement("button", {
    onClick: () => setCount(c => c + 1)
  }, "change count")));
}

const rootDom = document.getElementById("root"); // Didact.render(<Demo />, rootDom);

Didact.render(Didact.createElement(Counter, null), rootDom);