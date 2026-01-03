'use client';

import { useAudioStore } from '@/lib/audio-store';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

export function VolumeControl() {
  const { volume, isMuted, setVolume, setIsMuted } = useAudioStore();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-5 h-5" />;
    } else if (volume < 0.5) {
      return <Volume1 className="w-5 h-5" />;
    } else {
      return <Volume2 className="w-5 h-5" />;
    }
  };

  const displayVolume = isMuted ? 0 : volume;

  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <button
        onClick={toggleMute}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={displayVolume}
        onChange={handleVolumeChange}
        className="w-24 h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        aria-label="Volume"
      />
      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[32px] text-right">
        {Math.round(displayVolume * 100)}%
      </span>
    </div>
  );
}
