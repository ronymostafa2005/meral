"use client";

import React, { createElement, useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';

interface LiquidWaveTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div' | 'p';
  waveSpread?: number;
  interactive?: boolean;
}

export const LiquidWaveText: React.FC<LiquidWaveTextProps> = ({
  text,
  className = '',
  as = 'span',
  waveSpread = 0.12,
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const letters = Array.from(text);

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    sound.playWaterDrop();
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
  };

  return createElement(
    as,
    {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      className: `inline-flex flex-wrap items-baseline cursor-pointer select-none group relative ${className}`,
    },
    letters.map((char, index) => {
        if (char === ' ') {
          return (
            <span key={index} className="inline-block w-[0.3em]">
              &nbsp;
            </span>
          );
        }

        return (
          <motion.span
            key={index}
            className="inline-block transition-colors duration-300 relative"
            animate={
              isHovered
                ? {
                    y: [0, -10, 4, -6, 0],
                    rotate: [-1, 3, -2, 1, 0],
                    scale: [1, 1.12, 0.96, 1.05, 1],
                    color: ['#ffffff', '#ef4444', '#f87171', '#ffffff'],
                  }
                : {
                    y: [0, -3, 0],
                  }
            }
            transition={
              isHovered
                ? {
                    duration: 0.8,
                    delay: index * waveSpread,
                    ease: 'easeInOut',
                  }
                : {
                    duration: 3.5,
                    repeat: Infinity,
                    delay: index * 0.1,
                    ease: 'easeInOut',
                  }
            }
          >
            {char}
            {/* Chromatic Liquid Shadow on hover */}
            {isHovered && (
              <span
                className="absolute inset-0 text-red-500 opacity-60 blur-[1px] pointer-events-none -z-10 translate-x-[1px] translate-y-[1px]"
                aria-hidden="true"
              >
                {char}
              </span>
            )}
          </motion.span>
        );
    })
  );
};
