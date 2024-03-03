import "./CuesTable.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cue } from "../../Models/ApiTypes";
import { apiPaths } from "../../Constants/api";

export default function CuesTable(): JSX.Element {
  const [cues, setCues] = useState<Cue[]>([]);

  async function getCues(): Promise<Cue[]> {
    try {
      const response = await axios.get<Cue[]>(apiPaths.CUES);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCues();
        setCues(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {cues.length > 0 ? (
        <ul>
          {cues.map((cue) => (
            <li key={cue.id}>{cue.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading cues...</p>
      )}
    </div>
  );
}
