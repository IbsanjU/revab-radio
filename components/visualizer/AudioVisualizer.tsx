'use client';

import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/lib/audio-store';

export function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const { isPlaying } = useAudioStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bars = 32;
    const barWidth = canvas.width / bars;

    const draw = () => {
      if (!isPlaying) {
        // Draw static bars when not playing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < bars; i++) {
          const barHeight = 20;
          const x = i * barWidth;
          const y = (canvas.height - barHeight) / 2;
          
          const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
          gradient.addColorStop(0, '#93c5fd');
          gradient.addColorStop(1, '#3b82f6');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
        }
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        // Generate pseudo-random heights that look like audio visualization
        const time = Date.now() / 1000;
        const barHeight = Math.abs(Math.sin(time * 2 + i * 0.5) * 0.7 + Math.sin(time * 3 + i * 0.3) * 0.3) * canvas.height;
        
        const x = i * barWidth;
        const y = (canvas.height - barHeight) / 2;
        
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#60a5fa');
        gradient.addColorStop(0.5, '#3b82f6');
        gradient.addColorStop(1, '#2563eb');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={96}
        className="w-full h-full"
      />
    </div>
  );
}
