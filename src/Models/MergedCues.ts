import { Cue } from "./ApiTypes";

export interface MergedCues {
    song: Cue[],
    doesStop: boolean
}