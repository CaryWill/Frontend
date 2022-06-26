import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "./Container";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Container />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
