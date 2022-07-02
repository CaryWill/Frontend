import React from "react";
import moment from "moment";

export function App() {
  return moment(new Date()).format("YYYY-MM-DD");
}

export default App;
