import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [one, setOne] = useState(1);
  const [two, setTwo] = useState(2);

  useEffect(() => {
    document.body.addEventListener("click", async () => {
      setOne((old) => old + 1);
      await new Promise((res) => setTimeout(() => res(1), 2000));
      setTwo((old) => old + 1);
    });
  }, []);

  return (
    <>
      <div id="one">{one}</div>
      <div id="two">{two}</div>
    </>
  );
}
