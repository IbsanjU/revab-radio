import { useEffect, useRef, useState, useCallback } from 'react';

interface UseKeyboardShortcutsProps {
  onPlayPause?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onMute?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function useKeyboardShortcuts({
  onPlayPause,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onNext,
  onPrevious,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          onPlayPause?.();
          break;
        case 'arrowup':
          event.preventDefault();
          onVolumeUp?.();
          break;
        case 'arrowdown':
          event.preventDefault();
          onVolumeDown?.();
          break;
        case 'm':
          event.preventDefault();
          onMute?.();
          break;
        case 'arrowright':
          if (event.shiftKey) {
            event.preventDefault();
            onNext?.();
          }
          break;
        case 'arrowleft':
          if (event.shiftKey) {
            event.preventDefault();
            onPrevious?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, onVolumeUp, onVolumeDown, onMute, onNext, onPrevious]);
}
