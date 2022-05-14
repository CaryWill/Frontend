import React, { useState, useRef, useEffect } from "react";

function App() {
  const isDingding = window.location.search.indexOf("isDingding");
  const isWx = window.location.search.indexOf("isWx") !== -1;
  const isTaobao = window.location.search.indexOf("isTaobao") !== -1;

  return <div> {(isWx || isTaobao) && <span>suppoorted</span>}</div>;
}

export default App;
