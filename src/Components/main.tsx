import React, { useEffect } from "react";
import "./main.css";
import Header from "./Header/Header";

export default function Main() {
  const axios = require("axios");

  async function getCues() {
    try {
      const response = await axios.get("http://localhost:3001/cues");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCues();
  }, []);
  return (
    <div className="container">
      <Header />
    </div>
  );
}
