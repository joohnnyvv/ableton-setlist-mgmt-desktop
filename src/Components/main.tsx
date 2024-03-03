import React, { useEffect } from "react";
import "./main.css";
import Header from "./Header/Header";
import CuesTable from "./CuesTable/CuesTable";

export default function Main() {
  return (
    <div className="container">
      <Header />
      <CuesTable />
    </div>
  );
}
