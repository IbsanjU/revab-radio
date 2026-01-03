'use client';

import { useState, useRef } from 'react';
import { Radio, Upload, Wifi, WifiOff, Users, X } from 'lucide-react';

interface BroadcastStation {
  id: string;
  name: string;
  genre: string;
  description: string;
  isLive: boolean;
  listeners: number;
}

export function CreateStation() {
  const [isOpen, setIsOpen] = useState(false);
  const [station, setStation] = useState<BroadcastStation | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [stationName, setStationName] = useState('');
  const [genre, setGenre] = useState('Custom');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const genres = [
    'Custom', 'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic',
    'Hip Hop', 'Ambient', 'Podcast', 'Talk', 'Other'
  ];

  const startBroadcast = async () => {
    setError(null);
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create station ID
      const stationId = `custom-${Date.now()}`;
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Handle data available
      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          
          // Send to broadcast API
          try {
            const blob = new Blob([event.data], { type: 'audio/webm' });
            const params = new URLSearchParams({
              id: stationId,
              name: stationName || 'My Station',
              genre: genre,
              description: description || 'Live broadcast',
            });

            await fetch(`/api/broadcast?${params}`, {
              method: 'POST',
              body: blob,
              headers: {
                'Content-Type': 'audio/webm',
              },
            });
          } catch (error) {
            console.error('Error sending broadcast chunk:', error);
          }
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Send chunks every second

      const newStation: BroadcastStation = {
        id: stationId,
        name: stationName || 'My Station',
        genre: genre,
        description: description || 'Live broadcast',
        isLive: true,
        listeners: 0,
      };

      setStation(newStation);
      setIsBroadcasting(true);
      setIsOpen(false);

      // Add station to localStorage for listeners
      try {
        const customStations = JSON.parse(localStorage.getItem('customStations') || '[]');
        customStations.push({
          id: newStation.id,
          name: newStation.name,
          url: `/api/broadcast?id=${newStation.id}`,
          genre: newStation.genre,
          country: 'Custom',
          description: newStation.description,
          tags: ['live', 'custom'],
        });
        localStorage.setItem('customStations', JSON.stringify(customStations));
      } catch (error) {
        console.error('Error saving custom station:', error);
        // Continue even if localStorage fails
      }

    } catch (error) {
      console.error('Error starting broadcast:', error);
      setError('Failed to access microphone. Please grant permission and try again.');
    }
  };

  const stopBroadcast = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (station) {
      try {
        await fetch(`/api/broadcast?id=${station.id}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error stopping broadcast:', error);
      }

      // Remove from custom stations
      try {
        const customStations = JSON.parse(localStorage.getItem('customStations') || '[]');
        const filtered = customStations.filter((s: any) => s.id !== station.id);
        localStorage.setItem('customStations', JSON.stringify(filtered));
      } catch (error) {
        console.error('Error removing custom station:', error);
        // Continue even if localStorage fails
      }
    }

    setIsBroadcasting(false);
    setStation(null);
  };

  if (isBroadcasting && station) {
    return (
      <div className="fixed bottom-24 right-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-4 max-w-sm z-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-semibold text-gray-900 dark:text-white">Live Broadcasting</span>
          </div>
          <button
            onClick={stopBroadcast}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Station:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{station.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Genre:</span>
            <span className="text-sm text-gray-900 dark:text-white">{station.genre}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Listeners:</span>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">{station.listeners}</span>
            </div>
          </div>
        </div>

        <button
          onClick={stopBroadcast}
          className="w-full mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <WifiOff className="w-4 h-4" />
          Stop Broadcasting
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg transition-all z-50 flex items-center gap-2"
        title="Create Your Own Station"
      >
        <Wifi className="w-6 h-6" />
        <span className="pr-2 font-medium">Broadcast</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create Your Station
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Station Name *
                </label>
                <input
                  type="text"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  placeholder="My Awesome Station"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {genres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell listeners what you're broadcasting..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> You'll be asked for microphone permission. 
                  Your broadcast will be available to all listeners in real-time.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startBroadcast}
                  disabled={!stationName}
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Wifi className="w-4 h-4" />
                  Start Broadcasting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
