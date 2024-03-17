import "./CuesTable.css";
import React, { useEffect, useRef, useState, DragEvent } from "react";
import axios from "axios";
import { Cue, SendCueResponse } from "../../Models/ApiTypes";
import { MergedCues } from "../../Models/MergedCues";
import { apiPaths } from "../../Constants/api";
import { IoStopwatchOutline } from "react-icons/io5";
import { FaStop } from "react-icons/fa6";

interface CuesTableProps {
  onSongSelected: (songPair: MergedCues) => Promise<SendCueResponse>;
  isPlaying: boolean;
  stopPlaying: () => Promise<void>;
  startPlaying: () => Promise<void>;
  mergeCues: (cue: Cue[]) => Promise<MergedCues[]>;
  beatCounter: number;
  fetchTime: () => Promise<void>;
  time: number;
}

export default function CuesTable(props: CuesTableProps): JSX.Element {
  const [songCuePairs, setSongCuePairs] = useState<MergedCues[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSongIndex, setSelectedSongIndex] = useState<number | null>(
    null
  );

  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);

  const createSongCuePairs = async (cues: Cue[]) => {
    const mergedCues = await props.mergeCues(cues);
    setSongCuePairs(mergedCues);
  };

  const toggleDoesStop = (index: number) => {
    const updatedPairs = [...songCuePairs];
    updatedPairs[index].doesStop = !updatedPairs[index].doesStop;
    setSongCuePairs(updatedPairs);
  };

  const didSongFinish = async () => {
    if (selectedSongIndex === null) return;
    const songLength = songCuePairs[selectedSongIndex].songLength;
    const timeRemaining = songLength - props.beatCounter;
    const isSongNearEnd = timeRemaining <= 5;

    if (!isSongNearEnd) return;

    const doesStop = songCuePairs[selectedSongIndex].doesStop;
    const songEndTime = songCuePairs[selectedSongIndex].song[1].time;

    await props.fetchTime();

    if (props.time !== 0 && songEndTime <= props.time) {
      await props.stopPlaying();

      const nextSongIndex = selectedSongIndex + 1;

      if (nextSongIndex < songCuePairs.length) {
        await props.onSongSelected(songCuePairs[nextSongIndex]);
        setSelectedSongIndex(() => {
          return nextSongIndex;
        });
        if (!doesStop) await props.startPlaying();
      }
    }
  };

  useEffect(() => {
    if (songCuePairs.length) {
      if (props.isPlaying) didSongFinish();
    }
  }, [props.beatCounter, songCuePairs]);

  useEffect(() => {
    const getFetchedCues = async () => {
      try {
        const response = await axios.get<Cue[]>(apiPaths.CUES);
        setIsLoading(false);
        createSongCuePairs(response.data);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
    getFetchedCues();
  }, []);

  const handleSorting = () => {
    const _songs = [...songCuePairs];
    const draggedItemContent = _songs.splice(dragItem.current, 1)[0];

    _songs.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    setSongCuePairs(_songs);
  };

  const handleRowClick = (index: number) => {
    setSelectedSongIndex(index);
    props.onSongSelected?.(songCuePairs[index]);
  };

  return (
    <div className="cues-table">
      {isLoading ? (
        <h2>Loading...</h2>
      ) : songCuePairs.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Song</th>
              <th>
                <IoStopwatchOutline style={{ height: "24px" }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {songCuePairs.map((songPair, index) => (
              <tr
                key={songPair.song[0].id}
                draggable
                onDragStart={(e) => (dragItem.current = index)}
                onDragEnter={(e) => (dragOverItem.current = index)}
                onDragEnd={handleSorting}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => handleRowClick(index)}
                className={selectedSongIndex === index ? "selected" : ""}
              >
                <td>{index + 1}</td>
                <td>{songPair.song[0].name}</td>
                <td onClick={() => toggleDoesStop(index)}>
                  {songPair.doesStop ? <FaStop /> : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cues found</p>
      )}
    </div>
  );
}
