"use client";

import React, { useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

interface WaterRippleCanvasProps {
  interactive?: boolean;
  className?: string;
}

export const WaterRippleCanvas: React.FC<WaterRippleCanvasProps> = ({
  interactive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Ripple wave simulation grids (low-res grid scaled up for 60fps performance)
    const scale = 4;
    let cols = Math.floor(width / scale);
    let rows = Math.floor(height / scale);
    let size = cols * rows;

    let buffer1 = new Float32Array(size);
    let buffer2 = new Float32Array(size);
    const damping = 0.955;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.floor(width / scale);
      rows = Math.floor(height / scale);
      size = cols * rows;
      buffer1 = new Float32Array(size);
      buffer2 = new Float32Array(size);
    };

    window.addEventListener('resize', handleResize);

    const disturb = (x: number, y: number, strength: number = 300, radius: number = 3) => {
      const cx = Math.floor(x / scale);
      const cy = Math.floor(y / scale);

      for (let j = -radius; j <= radius; j++) {
        for (let i = -radius; i <= radius; i++) {
          const nx = cx + i;
          const ny = cy + j;
          if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1) {
            const dist = Math.sqrt(i * i + j * j);
            if (dist <= radius) {
              buffer1[ny * cols + nx] += strength * (1 - dist / radius);
            }
          }
        }
      }
    };

    let lastMoveTime = 0;
    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const now = performance.now();
      if (now - lastMoveTime > 90) {
        disturb(e.clientX, e.clientY, 28, 2);
        lastMoveTime = now;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!interactive) return;
      disturb(e.clientX, e.clientY, 55, 3);
      sound.playWaterDrop();
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('click', handleClick);

    // Ambient random droplets in dark red & silver
    let lastAmbientDrop = 0;

    // Direct pixel data for rendering ripples
    let imgData = ctx.createImageData(cols, rows);

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      // Auto droplet every 4 seconds if idle
      if (time - lastAmbientDrop > 12000) {
        const randX = Math.random() * width;
        const randY = Math.random() * height;
        disturb(randX, randY, 22, 2);
        lastAmbientDrop = time;
      }

      // Update wave equation
      for (let y = 1; y < rows - 1; y++) {
        const rowOffset = y * cols;
        for (let x = 1; x < cols - 1; x++) {
          const idx = rowOffset + x;
          const val =
            (buffer1[idx - 1] +
              buffer1[idx + 1] +
              buffer1[idx - cols] +
              buffer1[idx + cols]) *
              0.5 -
            buffer2[idx];

          buffer2[idx] = val * damping;
        }
      }

      // Swap buffers
      const temp = buffer1;
      buffer1 = buffer2;
      buffer2 = temp;

      // Draw pixels with Crimson Red, Silver White & Deep Obsidian shading
      const data = imgData.data;
      for (let i = 0; i < size; i++) {
        const wave = buffer1[i];
        const pIdx = i * 4;

        if (Math.abs(wave) > 1.4) {
          const intensity = Math.min(Math.abs(wave) * 0.55, 180);

          if (wave > 0) {
            data[pIdx] = Math.min(255, 210 + intensity * 0.15);
            data[pIdx + 1] = Math.min(255, 196 + intensity * 0.1);
            data[pIdx + 2] = Math.min(255, 170 + intensity * 0.08);
            data[pIdx + 3] = Math.min(70, intensity * 0.32);
          } else {
            data[pIdx] = Math.min(180, 120 + intensity * 0.15);
            data[pIdx + 1] = Math.min(150, 96);
            data[pIdx + 2] = Math.min(110, 64);
            data[pIdx + 3] = Math.min(40, intensity * 0.18);
          }
        } else {
          data[pIdx + 3] = 0; // Fully transparent
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Create an offscreen-rendered scaled image
      createImageBitmap(imgData).then((bmp) => {
        ctx.drawImage(bmp, 0, 0, width, height);
      });
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-10 mix-blend-soft-light opacity-40 transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    />
  );
};
