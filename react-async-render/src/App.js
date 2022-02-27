import {useEffect, useState, startTransition} from "react";
import logo from "./logo.svg";
import LagRadar from 'react-lag-radar';
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const list = new Array(count).fill(0);

  const onChange = () => {
    setCount((old) => old + 500);
  };

  const asyncOnChange = () => {
    startTransition(() => {
      setCount((old) => old + 500);
    });
  };

  return (
    <div className="App">
      <div>
        <div>sync</div>
        <input onChange={onChange} placeholder="input" />
        <div>async</div>
        <input onChange={asyncOnChange} placeholder="input" />
        <LagRadar size={100} />
      </div>
      <div style={{height: 100, width: 300, overflow: 'scroll'}}>
        {list.map(() => {
          const key = Math.ceil((Math.random() * 10000000000));
          return (
            <div key={key}>{key}</div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
