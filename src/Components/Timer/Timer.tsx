import React, { useEffect, useState } from "react";
import { apiPaths } from "../../Constants/api";
import axios from "axios";
import { CurrentTime, isPlaying } from "../../Models/ApiTypes";

interface TimerProps {
  updateIsPlaying: (state: boolean) => void;
  updateTime: (time: number) => void;
  isPlaying: boolean;
  time: number;
}

export default function Timer(props: TimerProps): JSX.Element {
  const fetchTime = async () => {
    try {
      const timeResponse = await axios.get<CurrentTime>(apiPaths.CURRENT_TIME);
      const isPlayingResponse = await axios.get<isPlaying>(apiPaths.IS_PLAYING);
      if (isPlayingResponse.data.isPlaying !== props.isPlaying) {
        props.updateIsPlaying(isPlayingResponse.data.isPlaying);
      }
      props.updateTime(timeResponse.data.currentTime);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchTime, 10);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p>Beat: {Math.round(props.time)}</p>
    </div>
  );
}
