import React, { useState, useRef, useEffect } from "react";
import { Tabs } from "antd";
import "antd/dist/antd.css";

function App() {
  return (
    <Tabs>
      <Tabs.TabPane key={1}>1</Tabs.TabPane>
      <Tabs.TabPane key={2}>2</Tabs.TabPane>
    </Tabs>
  );
}

export default App;
