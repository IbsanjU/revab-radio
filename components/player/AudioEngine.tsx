'use client';

import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/lib/audio-store';

export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { 
    currentStation, 
    isPlaying, 
    volume, 
    isMuted,
    setIsLoading,
    setError,
    setIsPlaying,
    equalizer,
  } = useAudioStore();

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bassNodeRef = useRef<BiquadFilterNode | null>(null);
  const midNodeRef = useRef<BiquadFilterNode | null>(null);
  const trebleNodeRef = useRef<BiquadFilterNode | null>(null);

  // Initialize audio context and nodes
  useEffect(() => {
    if (typeof window === 'undefined' || !audioRef.current) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      gainNodeRef.current = audioContextRef.current.createGain();
      
      // Create equalizer nodes
      bassNodeRef.current = audioContextRef.current.createBiquadFilter();
      bassNodeRef.current.type = 'lowshelf';
      bassNodeRef.current.frequency.value = 200;
      
      midNodeRef.current = audioContextRef.current.createBiquadFilter();
      midNodeRef.current.type = 'peaking';
      midNodeRef.current.frequency.value = 1000;
      midNodeRef.current.Q.value = 1;
      
      trebleNodeRef.current = audioContextRef.current.createBiquadFilter();
      trebleNodeRef.current.type = 'highshelf';
      trebleNodeRef.current.frequency.value = 3000;
      
      // Connect nodes
      sourceNodeRef.current
        .connect(bassNodeRef.current)
        .connect(midNodeRef.current)
        .connect(trebleNodeRef.current)
        .connect(gainNodeRef.current)
        .connect(audioContextRef.current.destination);
        
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }

    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  // Update equalizer settings
  useEffect(() => {
    if (!equalizer.enabled || !bassNodeRef.current || !midNodeRef.current || !trebleNodeRef.current) return;
    
    bassNodeRef.current.gain.value = equalizer.bass;
    midNodeRef.current.gain.value = equalizer.mid;
    trebleNodeRef.current.gain.value = equalizer.treble;
  }, [equalizer]);

  // Handle station changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    setIsLoading(true);
    setError(null);
    
    audio.src = currentStation.url;
    audio.load();

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setError('Failed to play station. The stream may be unavailable.');
          setIsPlaying(false);
        });
      }
    }
  }, [currentStation]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    if (isPlaying) {
      // Resume audio context if suspended
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          setError('Failed to play station. The stream may be unavailable.');
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentStation]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio event handlers
  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load audio stream. Please try another station.');
    setIsPlaying(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handlePlaying = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  return (
    <audio
      ref={audioRef}
      onCanPlay={handleCanPlay}
      onError={handleError}
      onLoadStart={handleLoadStart}
      onPlaying={handlePlaying}
      onWaiting={handleWaiting}
      preload="none"
    />
  );
}
