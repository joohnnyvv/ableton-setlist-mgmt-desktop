import React, { useEffect, useRef, useState } from "react";
import "./main.css";
import Header from "./Header/Header";
import CuesTable from "./CuesTable/CuesTable";
import ControlButtons from "./ControlButtons/ControlButtons";
import {
  StartStopPlaying,
  SongTempo,
  SendCueResponse,
  Cue,
} from "../Models/ApiTypes";
import axios from "axios";
import { apiPaths } from "../Constants/api";
import { MergedCues } from "../Models/MergedCues";
import { CurrentTime, isPlaying } from "../Models/ApiTypes";

export default function Main() {
  const [isPlaying, setIsPlaying] = useState<boolean>();
  const [time, setTime] = useState(0);
  const [beatInterval, setBeatInterval] = useState(0);
  const [beatCounter, setBeatCounter] = useState(0);
  const intervalIDRef = useRef<NodeJS.Timeout>(null);

  const fetchTime = async () => {
    try {
      const timeResponse = await axios.get<CurrentTime>(apiPaths.CURRENT_TIME);
      setTime(timeResponse.data.currentTime);
    } catch (error) {
      console.error(error);
    }
  };

  const mergeCues = async (cues: Cue[]) => {
    const pairs: MergedCues[] = [];
    let currentSong: Cue = null;

    cues
      .sort((a, b) => a.time - b.time)
      .forEach((cue) => {
        if (cue.name.includes("<end>")) {
          if (currentSong) {
            pairs.push({
              song: [currentSong, cue],
              doesStop: true,
              songLength: cue.time - currentSong.time,
            });
            currentSong = null;
          }
        } else {
          currentSong = cue;
        }
      });
    console.log(pairs);
    return pairs;
  };

  const calculateBeatIntervalInMs = async (tempo: number) => {
    if (tempo <= 0) throw new Error("Tempo must be greater than 0");
    return (60 / tempo) * 1000;
  };

  const startPlaying = async () => {
    try {
      await axios.get<StartStopPlaying>(apiPaths.START_PLAYING);
      setIsPlaying(true);
      startBeatCounterInterval();
    } catch (error) {
      console.error(error);
    }
  };

  const stopPlaying = async () => {
    try {
      await axios.get<StartStopPlaying>(apiPaths.STOP_PLAYING);
      setIsPlaying(false);
      clearInterval(intervalIDRef.current);
      intervalIDRef.current = null;
      resetBeatCounter();
    } catch (error) {
      console.error(error);
    }
  };

  const startBeatCounterInterval = () => {
    intervalIDRef.current = setInterval(() => {
      setBeatCounter((prevCount) => {
        console.log(prevCount + 1);
        return prevCount + 1;
      });
      console.log(beatInterval);
    }, beatInterval);
  };

  const resetBeatCounter = () => {
    setBeatCounter(0);
  };

  const handleSongSelected = async (songPair: MergedCues) => {
    try {
      const response = await axios.post(apiPaths.SEND_CUE, songPair.song[0]);
      const resData: SendCueResponse = response.data;
      const newBeatInterval = await calculateBeatIntervalInMs(
        resData.songTempo
      );
      // TODO: state wont change in real time
      setBeatInterval(newBeatInterval);
      return resData;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalIDRef.current);
  }, []);

  return (
    <div className="container">
      <Header />
      <CuesTable
        onSongSelected={handleSongSelected}
        isPlaying={isPlaying}
        stopPlaying={stopPlaying}
        startPlaying={startPlaying}
        mergeCues={mergeCues}
        beatCounter={beatCounter}
        fetchTime={fetchTime}
        time={time}
      />
      <ControlButtons
        startPlaying={startPlaying}
        isPlaying={isPlaying}
        stopPlaying={stopPlaying}
      />
    </div>
  );
}
