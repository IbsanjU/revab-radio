export interface RadioStation {
  id: string;
  name: string;
  url: string;
  genre: string;
  country: string;
  logo?: string;
  description?: string;
  website?: string;
  tags?: string[];
}

export interface Playlist {
  id: string;
  name: string;
  stations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentStation: RadioStation | null;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: string | null;
}

export interface PlayerControls {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
  playStation: (station: RadioStation) => void;
  nextStation: () => void;
  previousStation: () => void;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  volume: number;
  favorites: string[];
  recentlyPlayed: string[];
  playlists: Playlist[];
}

export type RepeatMode = 'off' | 'one' | 'all';

export interface EqualizerSettings {
  bass: number;
  mid: number;
  treble: number;
  enabled: boolean;
}
