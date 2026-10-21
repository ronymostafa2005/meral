"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronUp, Droplets } from 'lucide-react';
import { sound } from '../utils/audio';

const SECTIONS = [
  { id: 'hero', label: 'HERO', num: '01' },
  { id: 'works', label: 'WORKS', num: '02' },
  { id: 'about', label: 'ABOUT', num: '03' },
  { id: 'awards', label: 'AWARDS', num: '04' },
  { id: 'talk', label: 'TALK', num: '05' },
];

export const VerticalScrollTracker: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isWaterSurging, setIsWaterSurging] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Check current section
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    sound.playWaterDrop();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    setIsWaterSurging(true);
    sound.playWaterRipple();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsWaterSurging(false), 1200);
  };

  return (
    <aside
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center select-none"
      aria-label="Vertical scroll navigation"
    >
      {/* Scroll percentage */}
      <div className="mb-4 font-mono text-[10px] tracking-widest text-neutral-400 font-semibold">
        <span className="text-red-500">{Math.round(scrollProgress).toString().padStart(2, '0')}</span>
        <span className="text-neutral-600">%</span>
      </div>

      {/* Vertical Track with Liquid Crimson Gradient */}
      <div className="relative w-1 h-56 rounded-full bg-white/10 overflow-hidden shadow-[0_0_12px_rgba(239,68,68,0.2)]">
        {/* Fill Line */}
        <motion.div
          className="w-full bg-gradient-to-b from-white via-red-500 to-red-600 rounded-full"
          style={{ height: `${scrollProgress}%` }}
          transition={{ ease: 'easeOut', duration: 0.1 }}
        />

        {/* Liquid Droplet Bead */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 -ml-0.2 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.9)] border-2 border-white flex items-center justify-center pointer-events-none"
          style={{ top: `calc(${scrollProgress}% - 7px)` }}
        >
          <div className="w-1 h-1 rounded-full bg-white animate-ping" />
        </motion.div>
      </div>

      {/* Milestone Points */}
      <div className="flex flex-col gap-5 mt-6 items-center">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              title={`Scroll to ${sec.label}`}
            >
              {/* Dot */}
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3 h-3 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] ring-2 ring-white/50'
                    : 'bg-white/30 group-hover:bg-white group-hover:scale-125'
                }`}
              />

              {/* Flyout Label on hover or active */}
              <div
                className={`absolute right-7 px-2.5 py-1 rounded bg-[#111111]/90 border border-white/15 backdrop-blur-md text-[10px] font-mono tracking-wider whitespace-nowrap transition-all duration-200 pointer-events-none ${
                  isActive
                    ? 'opacity-100 translate-x-0 text-white border-red-500/50'
                    : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-neutral-400'
                }`}
              >
                <span className="text-red-400 mr-1.5">{sec.num}</span>
                {sec.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`mt-6 w-9 h-9 rounded-full bg-black/60 border border-white/20 hover:border-red-500 hover:bg-red-500/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 shadow-lg ${
          scrollProgress > 15 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="Surge to Top"
      >
        <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
      </button>

      {/* Ambient water droplet icon */}
      <div className="mt-3 text-red-500/50" title="Interactive Water Physics Active">
        <Droplets className="w-3.5 h-3.5 animate-pulse" />
      </div>
    </aside>
  );
};
