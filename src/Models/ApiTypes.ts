export interface Cue {
    id: string,
    name: string,
    time: number
}

export interface CurrentTime {
    currentTime: number
}

export interface StartStopPlaying {
    message: string
}

export interface isPlaying {
    isPlaying: boolean
}