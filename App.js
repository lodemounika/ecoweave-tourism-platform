import React from "react";

function App() {

  const sendData = async () => {
    await fetch("http://localhost:5000/add-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Shivani" })
    });

    alert("Data Sent to Backend!");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>EcoWeave Tourism App</h1>
      <button onClick={sendData}>Send Data</button>
    </div>
  );
}

export default App;