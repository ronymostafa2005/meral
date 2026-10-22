"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { ArrowRight, Droplets } from 'lucide-react';
import { LiquidWaveText } from './LiquidWaveText';
import { useSite } from './SiteProvider';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { content } = useSite();
  const intro = content.intro;
  const images = intro.images.filter(Boolean);
  const frames = images.length ? images : ['/work/rise-1.jpg'];
  const [imageIndex, setImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if ?autostart=1 is present
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autostart') === '1') {
        onComplete();
        return;
      }
    }

    const imgInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % frames.length);
    }, 220);

    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progInterval);
          return 100;
        }
        return prev + 12;
      });
    }, 32);

    return () => {
      clearInterval(imgInterval);
      clearInterval(progInterval);
    };
  }, [frames.length, onComplete]);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        handleFinish();
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleFinish = () => {
    if (isExiting) return;
    setIsExiting(true);
    sound.playSuccess();
    setTimeout(() => {
      onComplete();
    }, 280);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleFinish}
          className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#050505] text-[#ededed] cursor-pointer select-none overflow-hidden"
          role="dialog"
          aria-label="Studio Preloader"
        >
          {/* Ambient red atmospheric glows */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-red-800/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Top Header Indicators */}
          <div className="flex justify-between items-center text-xs tracking-widest text-neutral-400 uppercase font-mono relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-semibold text-white">{intro.brand}</span>
              <span className="text-neutral-600 hidden sm:inline">{intro.discipline}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFinish();
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 hover:border-red-500 hover:bg-red-500/10 text-neutral-300 hover:text-white transition-all text-xs"
            >
              <span>{intro.enter}</span>
              <ArrowRight className="w-3 h-3 text-red-500" />
            </button>
          </div>

          {/* Center Iconic Cappen Dual-Text & Morphing Capsule */}
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 my-auto relative z-10">
            {/* Left Headline: HUMAN THINKERS */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center md:text-left"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter uppercase leading-none">
                <LiquidWaveText text={intro.leftA} className="text-white hover:text-red-500" />
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-neutral-400">
                  <LiquidWaveText text={intro.leftB} />
                </span>
              </h1>
            </motion.div>

            {/* Central Animated Capsule with Water Wave Ripples */}
            <div className="relative flex items-center justify-center">
              {/* Expanding concentric water ripples */}
              <div className="absolute w-56 h-80 rounded-[4rem] border border-red-500/30 animate-ping pointer-events-none opacity-40" />
              <div className="absolute w-64 h-88 rounded-[4.5rem] border border-white/20 animate-pulse pointer-events-none" />

              {/* Glowing red backlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/40 to-transparent rounded-[3rem] blur-xl" />

              {/* Capsule Container */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative w-40 sm:w-48 h-60 sm:h-72 rounded-[3.5rem] overflow-hidden border-2 border-white/30 shadow-[0_0_35px_rgba(239,68,68,0.4)] bg-[#0a0a0a]"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imageIndex}
                    src={frames[imageIndex % frames.length]}
                    alt="Selected campaign by Meral"
                    initial={{ opacity: 0, scale: 1.15, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Glass reflection gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-red-950/60 pointer-events-none" />

                {/* Subtle red badge inside */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[9px] font-mono text-white tracking-widest uppercase">
                  {intro.badge}
                </div>
              </motion.div>
            </div>

            {/* Right Headline: DIGITAL MAKERS */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center md:text-right"
            >
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter uppercase leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 via-white to-red-500">
                  <LiquidWaveText text={intro.rightA} />
                </span>
                <br />
                <LiquidWaveText text={intro.rightB} className="text-white hover:text-red-500" />
              </h2>
            </motion.div>
          </div>

          {/* Bottom Bar: Fluid Progress & Tagline */}
          <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs tracking-wider text-neutral-400 font-mono relative z-10">
            <div className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-red-500 animate-bounce" />
              <span className="text-neutral-300">
                {intro.note}
              </span>
            </div>

            {/* Numeric Progress Counter */}
            <div className="flex items-center gap-3">
              <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-white transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-bold text-white tracking-widest text-sm">
                <span className="text-red-500">{progress.toString().padStart(3, '0')}</span>%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
