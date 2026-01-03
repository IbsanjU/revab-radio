'use client';

import { useAudioStore } from '@/lib/audio-store';
import { Controls } from './Controls';
import { VolumeControl } from './VolumeControl';
import { Heart, Radio } from 'lucide-react';
import Image from 'next/image';

export function AudioPlayer() {
  const { currentStation, favorites, toggleFavorite } = useAudioStore();

  const isFavorite = currentStation ? favorites.includes(currentStation.id) : false;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Now Playing Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              {currentStation?.logo ? (
                <Image 
                  src={currentStation.logo} 
                  alt={currentStation.name}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
              ) : (
                <Radio className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {currentStation?.name || 'No station playing'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {currentStation?.genre || 'Select a station to start'}
                {currentStation?.country && ` • ${currentStation.country}`}
              </p>
            </div>
            {currentStation && (
              <button
                onClick={() => toggleFavorite(currentStation.id)}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex-shrink-0">
            <Controls />
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <VolumeControl />
          </div>
        </div>
      </div>
    </div>
  );
}
