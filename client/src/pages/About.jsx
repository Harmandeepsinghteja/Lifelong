import { useEffect, useState } from "react";

export default function About() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("http://localhost:3000")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <>
      <div className="text-white">
        <h1> About </h1>
        <p>{message}</p>
      </div>
    </>
  );
}
