// @jsx Didact.createElement
import { Didact } from "../component-state.js";
import './metrics.js';

class Cell extends Didact.Component {
  render() {
    var _props = this.props,
      text = _props.text,
      delay = _props.delay;

    wait(delay);
    return <td>{text}</td>;
  }
}

class Demo extends Didact.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0, // the number shown on each Cell
      size: 6, // the size of a row
      period: 1000, // the time (in ms) between updates
      delay: 3, // the delay (in ms) for the render of each Cell
    };
    this.changeDelay = this.changeDelay.bind(this);
    this.changePeriod = this.changePeriod.bind(this);
    this.tick = this.tick.bind(this);
    this.tick();
  }
  tick() {
    var _this = this;

    setTimeout(function () {
      _this.setState({ elapsed: _this.state.elapsed + 1 });
      _this.tick();
    }, this.state.period);
  }
  changeDelay(e) {
    this.setState({ delay: +e.target.value });
  }
  changePeriod(e) {
    this.setState({ period: +e.target.value });
  }

  render() {
    var _state = this.state,
      elapsed = _state.elapsed,
      size = _state.size,
      delay = _state.delay,
      period = _state.period;
    var text = elapsed % 10;
    var array = Array(size).fill();

    return (
      <div style="display:flex">
        <table>
          <tbody>
            {array.map((x, key) => (
              <tr key={key}>
                {array.map((_, $1) => (
                  <Cell {...{ key: $1, text: text, delay: delay }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <p>
            The table refreshes every <b>{Math.round(period)} ms</b>
          </p>
          <input
            {...{
              id: "period-range",
              type: "range",
              min: "200",
              max: "1000",
              step: "any",
              value: period,
              onChange: this.changePeriod,
            }}
          ></input>
          <p>
            The render of each cell takes <b>{delay.toFixed(2)} ms</b>
          </p>
          <input
            {...{
              id: "delay-range",
              type: "range",
              min: "0",
              max: "10",
              step: "any",
              value: delay,
              onChange: this.changeDelay,
            }}
          ></input>
          <p>
            So, sync rendering the full table will keep the main thread busy for{" "}
            <b>{(delay * size * size).toFixed(2)}ms</b>
          </p>
        </div>
      </div>
    );
  }
}

function wait(ms) {
  var start = performance.now();

  while (performance.now() - start < ms) {}
}

const rootDom = document.getElementById("root");
Didact.render(<Demo />, rootDom);
