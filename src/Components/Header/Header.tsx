import React from "react";
import "./Header.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div>
      <h1>Ableton Setlist</h1>
      <h1>Manager</h1>
    </div>
  );
};

export default Header;
