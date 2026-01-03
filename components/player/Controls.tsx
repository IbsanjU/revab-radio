'use client';

import { useAudioStore } from '@/lib/audio-store';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { RepeatMode } from '@/types';

export function Controls() {
  const { 
    isPlaying, 
    isLoading,
    currentStation,
    setIsPlaying,
    nextStation,
    previousStation,
    isShuffled,
    setIsShuffled,
    repeatMode,
    setRepeatMode,
  } = useAudioStore();

  const togglePlay = () => {
    if (currentStation) {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat1 className="w-5 h-5" />;
      case 'all':
      case 'off':
      default:
        return <Repeat className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={toggleShuffle}
        className={`p-2 rounded-full transition-colors ${
          isShuffled
            ? 'text-primary-500 hover:text-primary-600 dark:text-primary-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Toggle shuffle"
        disabled={!currentStation}
      >
        <Shuffle className="w-5 h-5" />
      </button>

      <button
        onClick={previousStation}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous station"
        disabled={!currentStation}
      >
        <SkipBack className="w-6 h-6" />
      </button>

      <button
        onClick={togglePlay}
        className="p-4 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        disabled={!currentStation || isLoading}
      >
        {isLoading ? (
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>

      <button
        onClick={nextStation}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next station"
        disabled={!currentStation}
      >
        <SkipForward className="w-6 h-6" />
      </button>

      <button
        onClick={toggleRepeat}
        className={`p-2 rounded-full transition-colors ${
          repeatMode !== 'off'
            ? 'text-primary-500 hover:text-primary-600 dark:text-primary-400'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Toggle repeat"
        disabled={!currentStation}
      >
        {getRepeatIcon()}
      </button>
    </div>
  );
}
