import React from "react";
import "./ControlButtons.css";
import { FaPlay, FaStop } from "react-icons/fa6";

interface ControlButtonsProps {
  startPlaying: () => void;
  stopPlaying: () => void;
  isPlaying: boolean;
}

export default function ControlButtons(
  props: ControlButtonsProps
): JSX.Element {
  return (
    <div className="control-buttons-container">
      <FaPlay
        className="control-icon"
        style={props.isPlaying ? { color: "#4CBB17" } : { color: "#282728" }}
        onClick={() => {
          props.startPlaying();
        }}
      />
      <FaStop
        className="control-icon stop"
        onClick={() => {
          props.stopPlaying();
        }}
      />
    </div>
  );
}
