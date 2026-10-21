"use client";

import React, { useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

interface WaterRippleCanvasProps {
  interactive?: boolean;
  className?: string;
}

const GOLD = [196, 165, 116];
const ROSE = [168, 78, 86];
const IVORY = [236, 230, 222];

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

    const scale = 8;
    const damping = 0.972;
    let animId = 0;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let size = 0;
    let buffer1 = new Float32Array(0);
    let buffer2 = new Float32Array(0);
    let field = document.createElement('canvas');
    let fieldCtx = field.getContext('2d');
    let imgData = new ImageData(1, 1);
    let lastMove = 0;
    let lastAmbient = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.max(2, Math.floor(width / scale));
      rows = Math.max(2, Math.floor(height / scale));
      size = cols * rows;
      buffer1 = new Float32Array(size);
      buffer2 = new Float32Array(size);
      field = document.createElement('canvas');
      field.width = cols;
      field.height = rows;
      fieldCtx = field.getContext('2d');
      imgData = new ImageData(cols, rows);
    };

    const disturb = (x: number, y: number, strength: number, radius: number) => {
      const cx = Math.floor(x / scale);
      const cy = Math.floor(y / scale);

      for (let j = -radius; j <= radius; j++) {
        for (let i = -radius; i <= radius; i++) {
          const nx = cx + i;
          const ny = cy + j;
          if (nx > 0 && nx < cols - 1 && ny > 0 && ny < rows - 1) {
            const dist = Math.hypot(i, j);
            if (dist <= radius) {
              buffer1[ny * cols + nx] += strength * (1 - dist / radius);
            }
          }
        }
      }
    };

    const onResize = () => resize();
    const onMove = (e: MouseEvent) => {
      if (!interactive) return;
      const now = performance.now();
      if (now - lastMove < 140) return;
      lastMove = now;
      disturb(e.clientX, e.clientY, 16, 3);
    };
    const onClick = (e: MouseEvent) => {
      if (!interactive) return;
      disturb(e.clientX, e.clientY, 34, 4);
      sound.playWaterDrop();
    };

    resize();
    disturb(width * 0.3, height * 0.35, 18, 4);
    disturb(width * 0.72, height * 0.62, 14, 3);
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!fieldCtx || document.hidden) return;

      if (time - lastAmbient > 4200) {
        disturb(Math.random() * width, Math.random() * height, 12, 3);
        lastAmbient = time;
      }

      const t = time * 0.00018;
      const data = imgData.data;

      for (let y = 0; y < rows; y++) {
        const row = y * cols;
        const ny = y / rows;
        for (let x = 0; x < cols; x++) {
          const idx = row + x;
          let ripple = 0;

          if (x > 0 && x < cols - 1 && y > 0 && y < rows - 1) {
            const next =
              (buffer1[idx - 1] + buffer1[idx + 1] + buffer1[idx - cols] + buffer1[idx + cols]) * 0.5 -
              buffer2[idx];
            buffer2[idx] = next * damping;
            ripple = buffer2[idx];
          }

          const nx = x / cols;
          const flow =
            Math.sin(nx * 4.6 + t + ny * 1.7) * 0.46 +
            Math.sin(ny * 3.8 - t * 0.72 + nx * 2.1) * 0.34 +
            Math.sin((nx + ny) * 6.4 + t * 1.15) * 0.2;
          const shimmer = Math.sin(flow * 2.2 + t * 0.8 + nx * 3);
          const tone = flow * 0.5 + 0.5;
          const lift = Math.max(0, shimmer) * 0.34 + Math.min(Math.abs(ripple) / 36, 1) * 0.28;

          let r = GOLD[0] * (1 - tone) + ROSE[0] * tone;
          let g = GOLD[1] * (1 - tone) + ROSE[1] * tone;
          let b = GOLD[2] * (1 - tone) + ROSE[2] * tone;
          r = r * (1 - lift) + IVORY[0] * lift;
          g = g * (1 - lift) + IVORY[1] * lift;
          b = b * (1 - lift) + IVORY[2] * lift;

          const alpha = Math.min(96, 34 + Math.abs(flow) * 28 + Math.min(Math.abs(ripple) * 1.1, 36));
          const p = idx * 4;
          data[p] = r;
          data[p + 1] = g;
          data[p + 2] = b;
          data[p + 3] = alpha;
        }
      }

      const swap = buffer1;
      buffer1 = buffer2;
      buffer2 = swap;

      fieldCtx.putImageData(imgData, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(field, 0, 0, width, height);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};
