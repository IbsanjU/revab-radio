'use client';

import { useEffect, useState } from 'react';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { AudioEngine } from '@/components/player/AudioEngine';
import { StationList } from '@/components/stations/StationList';
import { AudioVisualizer } from '@/components/visualizer/AudioVisualizer';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAudioStore } from '@/lib/audio-store';
import { fetchStations } from '@/lib/stations';
import { RadioStation } from '@/types';
import { Radio, Heart, Clock, Settings } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function Home() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'recent'>('all');
  const [loading, setLoading] = useState(true);

  const { 
    setStations: setStoreStations,
    favorites,
    recentlyPlayed,
    setIsPlaying,
    isPlaying,
    setVolume,
    volume,
    setIsMuted,
    nextStation,
    previousStation,
  } = useAudioStore();

  // Load stations
  useEffect(() => {
    const loadStations = async () => {
      setLoading(true);
      const fetchedStations = await fetchStations();
      setStations(fetchedStations);
      setStoreStations(fetchedStations);
      setLoading(false);
    };

    loadStations();
  }, [setStoreStations]);

  // Load favorites and recent from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favorites');
      const storedRecent = localStorage.getItem('recentlyPlayed');
      
      if (storedFavorites) {
        try {
          const favs = JSON.parse(storedFavorites);
          useAudioStore.setState({ favorites: favs });
        } catch (e) {
          console.error('Error loading favorites:', e);
        }
      }
      
      if (storedRecent) {
        try {
          const recent = JSON.parse(storedRecent);
          useAudioStore.setState({ recentlyPlayed: recent });
        } catch (e) {
          console.error('Error loading recent:', e);
        }
      }
    }
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: () => setIsPlaying(!isPlaying),
    onVolumeUp: () => setVolume(Math.min(1, volume + 0.1)),
    onVolumeDown: () => setVolume(Math.max(0, volume - 0.1)),
    onMute: () => setIsMuted(true),
    onNext: nextStation,
    onPrevious: previousStation,
  });

  const getDisplayStations = () => {
    if (activeTab === 'favorites') {
      return stations.filter(s => favorites.includes(s.id));
    }
    if (activeTab === 'recent') {
      const recentStations = recentlyPlayed
        .map(id => stations.find(s => s.id === id))
        .filter((s): s is RadioStation => s !== undefined);
      return recentStations;
    }
    return stations;
  };

  const displayStations = getDisplayStations();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AudioEngine />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Revab Radio
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your Personal Radio Station
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        {/* Visualizer */}
        <div className="mb-8">
          <AudioVisualizer />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              All Stations ({stations.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'favorites'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favorites ({favorites.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'recent'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recently Played ({recentlyPlayed.length})
            </div>
          </button>
        </div>

        {/* Station List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <StationList stations={displayStations} />
        )}

        {/* Keyboard Shortcuts Info */}
        <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div><kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">Space</kbd> Play/Pause</div>
            <div><kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">↑</kbd> Volume Up</div>
            <div><kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">↓</kbd> Volume Down</div>
            <div><kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">M</kbd> Mute</div>
            <div><kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">Shift</kbd> + <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">→</kbd> Next</div>
            <div><kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">Shift</kbd> + <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">←</kbd> Previous</div>
          </div>
        </div>
      </main>

      {/* Audio Player */}
      <AudioPlayer />
    </div>
  );
}
