import React, { useState } from "react";
import "./main.css";
import Header from "./Header/Header";
import CuesTable from "./CuesTable/CuesTable";
import Timer from "./Timer/Timer";
import ControlButtons from "./ControlButtons/ControlButtons";
import { StartStopPlaying } from "../Models/ApiTypes";
import axios from "axios";
import { apiPaths } from "../Constants/api";
import { MergedCues } from "../Models/MergedCues";

export default function Main() {
  const [isPlaying, setIsPlaying] = useState<boolean>();
  const [time, setTime] = useState<number>(0);

  const startPlaying = async () => {
    try {
      await axios.get<StartStopPlaying>(apiPaths.START_PLAYING);
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopPlaying = async () => {
    try {
      await axios.get<StartStopPlaying>(apiPaths.STOP_PLAYING);
      setIsPlaying(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updateIsPlaying = (state: boolean) => {
    setIsPlaying(state);
  };

  const updateTime = (time: number) => {
    setTime(time);
  };

  const handleSongSelected = async (songPair: MergedCues) => {
    try {
      await axios.post(apiPaths.SEND_CUE, songPair.song[0]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <Header />
      <Timer
        updateIsPlaying={updateIsPlaying}
        isPlaying={isPlaying}
        updateTime={updateTime}
        time={time}
      />
      <CuesTable
        time={time}
        onSongSelected={handleSongSelected}
        isPlaying={isPlaying}
        stopPlaying={stopPlaying}
        startPlaying={startPlaying}
      />
      <ControlButtons
        startPlaying={startPlaying}
        isPlaying={isPlaying}
        stopPlaying={stopPlaying}
      />
    </div>
  );
}
