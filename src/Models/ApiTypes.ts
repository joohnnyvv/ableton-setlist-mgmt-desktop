export interface Cue {
    id: string,
    name: string,
    time: number
}

export interface SendCueResponse {
    message: string,
    songTempo: number
}

export interface CurrentTime {
    currentTime: number
}

export interface StartStopPlaying {
    message: string
}

export interface SongTempo {
    songTempo: number
}

export interface isPlaying {
    isPlaying: boolean
}