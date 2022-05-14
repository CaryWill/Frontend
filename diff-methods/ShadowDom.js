import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const ref = useRef(null);
  let shadowRoot = useRef(null);

  const fetchData = () => {
    return `<div><script>window.a = 123;console.log(window.a)</script></div>`;
  };

  useEffect(() => {
    const shadow = ref.current.attachShadow({ mode: "open" });
    shadowRoot.current = shadow;
    rerender();
  }, []);

  const rerender = () => {
    const data = fetchData();
    shadowRoot.current.innerHTML = data;
  };

  return (
    <>
      <div ref={ref}>123</div>
      <button onClick={rerender}>refresh</button>
    </>
  );
}

export default App;
