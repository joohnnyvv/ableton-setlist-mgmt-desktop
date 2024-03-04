import "./CuesTable.css";
import React, { useEffect, useRef, useState, DragEvent } from "react";
import axios from "axios";
import { Cue } from "../../Models/ApiTypes";
import { MergedCues } from "../../Models/MergedCues";
import { apiPaths } from "../../Constants/api";
import { IoStopwatchOutline } from "react-icons/io5";
import { FaStop } from "react-icons/fa6";

interface CuesTableProps {
  time: number;
  onSongSelected: (songPair: MergedCues) => void;
  isPlaying: boolean;
  stopPlaying: () => Promise<void>;
  startPlaying: () => Promise<void>;
}

export default function CuesTable(props: CuesTableProps): JSX.Element {
  const [songCuePairs, setSongCuePairs] = useState<MergedCues[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSongIndex, setSelectedSongIndex] = useState<number | null>(
    null
  );

  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);

  const createSongCuePairs = (cues: Cue[]) => {
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
            });
            currentSong = null;
          }
        } else {
          currentSong = cue;
        }
      });
    setSongCuePairs(pairs);
  };

  const toggleDoesStop = (index: number) => {
    const updatedPairs = [...songCuePairs];
    updatedPairs[index].doesStop = !updatedPairs[index].doesStop;
    setSongCuePairs(updatedPairs);
  };

  const findActiveSongIndex = () => {
    for (let i = 0; i < songCuePairs.length; i++) {
      const cue = songCuePairs[i].song[0];
      const endCue = songCuePairs[i].song[1];

      if (cue.time <= props.time && props.time <= endCue.time) {
        return i;
      }
    }
    return null;
  };

  const didSongFinish = () => {
    if (selectedSongIndex === null) return;

    const currentEndCue = songCuePairs[selectedSongIndex].song[1];
    const doesStop = songCuePairs[selectedSongIndex].doesStop;

    if (currentEndCue.time <= props.time) {
      props.stopPlaying();
      let nextSongIndex = null;
      if (selectedSongIndex + 1 < songCuePairs.length) {
        nextSongIndex = selectedSongIndex + 1;
      }
      if (nextSongIndex !== null) {
        props.onSongSelected(songCuePairs[nextSongIndex]);
        setSelectedSongIndex(nextSongIndex);
      }
      if (!doesStop && nextSongIndex !== null) {
        props.startPlaying();
      }
    }
    return;
  };

  useEffect(() => {
    if (!props.isPlaying) {
      const activeSongIndex = findActiveSongIndex();
      setSelectedSongIndex(activeSongIndex);
      props.onSongSelected(songCuePairs[activeSongIndex]);
    } else {
      didSongFinish();
    }
  }, [props.time, songCuePairs]);

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
    if (props.onSongSelected) {
      props.onSongSelected(songCuePairs[index]);
    }
  };

  return (
    <div className="cues-table">
      {isLoading && <h2>Loading...</h2>}
      {songCuePairs.length > 0 ? (
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
