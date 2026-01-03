'use client';

import { RadioStation } from '@/types';
import { useAudioStore } from '@/lib/audio-store';
import { Radio, Heart, Play, Pause } from 'lucide-react';

interface StationCardProps {
  station: RadioStation;
}

export function StationCard({ station }: StationCardProps) {
  const { currentStation, isPlaying, playStation, favorites, toggleFavorite, setIsPlaying } = useAudioStore();
  
  const isCurrentStation = currentStation?.id === station.id;
  const isFavorite = favorites.includes(station.id);

  const handlePlay = () => {
    if (isCurrentStation) {
      setIsPlaying(!isPlaying);
    } else {
      playStation(station);
    }
  };

  return (
    <div
      className={`group relative bg-white dark:bg-gray-800 rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${
        isCurrentStation
          ? 'border-primary-500 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
      }`}
      onClick={handlePlay}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Station Icon */}
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isCurrentStation
              ? 'bg-primary-500 text-white'
              : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300'
          }`}>
            <Radio className="w-6 h-6" />
          </div>

          {/* Station Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {station.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                {station.genre}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {station.country}
              </span>
            </div>
            {station.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {station.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(station.id);
              }}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Play Overlay */}
      {isCurrentStation && isPlaying && (
        <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg flex items-center justify-center pointer-events-none">
          <div className="flex gap-1">
            <div className="w-1 h-8 bg-primary-500 rounded-full animate-pulse-wave" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-8 bg-primary-500 rounded-full animate-pulse-wave" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-8 bg-primary-500 rounded-full animate-pulse-wave" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* Hover Play Button */}
      {!isCurrentStation && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-primary-500 ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );
}
