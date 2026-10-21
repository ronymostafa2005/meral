"use client";

import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテト0123456789!<>-_\\/[]{}—=+*^?#________';

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  triggerOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    sound.playBlip(750, 0.03);

    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (letter === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }

      iteration += 1 / 2;
    }, 30);
  };

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  return (
    <span
      onMouseEnter={() => triggerOnHover && scramble()}
      className={`cursor-pointer transition-colors ${
        isScrambling ? 'text-red-400' : ''
      } ${className}`}
    >
      {displayText}
    </span>
  );
};
