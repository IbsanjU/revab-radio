import { create } from 'zustand';
import { RadioStation, RepeatMode, EqualizerSettings } from '@/types';

interface AudioStore {
  // Audio state
  isPlaying: boolean;
  currentStation: RadioStation | null;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Playlist state
  stations: RadioStation[];
  currentIndex: number;
  isShuffled: boolean;
  shuffledIndices: number[];
  repeatMode: RepeatMode;
  
  // User preferences
  favorites: string[];
  recentlyPlayed: string[];
  
  // Equalizer
  equalizer: EqualizerSettings;
  
  // Sleep timer
  sleepTimer: number | null;
  
  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentStation: (station: RadioStation | null) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setStations: (stations: RadioStation[]) => void;
  setCurrentIndex: (index: number) => void;
  setIsShuffled: (isShuffled: boolean) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  toggleFavorite: (stationId: string) => void;
  addToRecentlyPlayed: (stationId: string) => void;
  setEqualizer: (settings: EqualizerSettings) => void;
  setSleepTimer: (minutes: number | null) => void;
  nextStation: () => void;
  previousStation: () => void;
  playStation: (station: RadioStation) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  // Initial state
  isPlaying: false,
  currentStation: null,
  volume: 0.7,
  isMuted: false,
  isLoading: false,
  error: null,
  stations: [],
  currentIndex: -1,
  isShuffled: false,
  shuffledIndices: [],
  repeatMode: 'off',
  favorites: [],
  recentlyPlayed: [],
  equalizer: {
    bass: 0,
    mid: 0,
    treble: 0,
    enabled: false,
  },
  sleepTimer: null,

  // Actions
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStation: (currentStation) => set({ currentStation }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setIsMuted: (isMuted) => set({ isMuted }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setStations: (stations) => set({ stations }),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  setIsShuffled: (isShuffled) => {
    const { stations } = get();
    if (isShuffled) {
      const indices = stations.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      set({ isShuffled, shuffledIndices: indices });
    } else {
      set({ isShuffled, shuffledIndices: [] });
    }
  },
  setRepeatMode: (repeatMode) => set({ repeatMode }),
  toggleFavorite: (stationId) => {
    const { favorites } = get();
    const newFavorites = favorites.includes(stationId)
      ? favorites.filter(id => id !== stationId)
      : [...favorites, stationId];
    set({ favorites: newFavorites });
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  },
  addToRecentlyPlayed: (stationId) => {
    const { recentlyPlayed } = get();
    const newRecent = [stationId, ...recentlyPlayed.filter(id => id !== stationId)].slice(0, 20);
    set({ recentlyPlayed: newRecent });
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentlyPlayed', JSON.stringify(newRecent));
    }
  },
  setEqualizer: (equalizer) => set({ equalizer }),
  setSleepTimer: (minutes) => set({ sleepTimer: minutes }),

  nextStation: () => {
    const { stations, currentIndex, isShuffled, shuffledIndices, repeatMode } = get();
    if (stations.length === 0) return;

    let newIndex: number;
    if (repeatMode === 'one') {
      newIndex = currentIndex;
    } else if (isShuffled) {
      const currentShuffledPos = shuffledIndices.indexOf(currentIndex);
      const nextShuffledPos = (currentShuffledPos + 1) % shuffledIndices.length;
      newIndex = shuffledIndices[nextShuffledPos];
    } else {
      newIndex = (currentIndex + 1) % stations.length;
    }

    const nextStation = stations[newIndex];
    set({ currentIndex: newIndex, currentStation: nextStation });
  },

  previousStation: () => {
    const { stations, currentIndex, isShuffled, shuffledIndices } = get();
    if (stations.length === 0) return;

    let newIndex: number;
    if (isShuffled) {
      const currentShuffledPos = shuffledIndices.indexOf(currentIndex);
      const prevShuffledPos = currentShuffledPos === 0 
        ? shuffledIndices.length - 1 
        : currentShuffledPos - 1;
      newIndex = shuffledIndices[prevShuffledPos];
    } else {
      newIndex = currentIndex === 0 ? stations.length - 1 : currentIndex - 1;
    }

    const prevStation = stations[newIndex];
    set({ currentIndex: newIndex, currentStation: prevStation });
  },

  playStation: (station) => {
    const { stations } = get();
    const index = stations.findIndex(s => s.id === station.id);
    set({ 
      currentStation: station, 
      currentIndex: index !== -1 ? index : -1,
      isPlaying: true,
      error: null,
    });
    get().addToRecentlyPlayed(station.id);
  },
}));
