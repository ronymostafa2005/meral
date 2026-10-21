"use client";

import React from 'react';
import { motion } from 'motion/react';
import { STUDIO_STATS } from '../data/portfolioData';
import { LiquidWaveText } from './LiquidWaveText';
import { Droplets, Sparkles } from 'lucide-react';

export const SubHero: React.FC = () => {
  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-8 border-b border-red-950/40 overflow-hidden bg-[#050505]">
      {/* Background ambient crimson glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-20 relative z-10">
        {/* Statement / Manifesto */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs tracking-widest text-red-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>01 &bull; PRACTICE</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-medium leading-tight tracking-tight text-white"
          >
            The work is for developments that need a point of view.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 font-bold">
              Not a listing.
            </span>{' '}
            A campaign with one sentence, one picture, and a mark that knows when to step back.
          </motion.h2>

          <p className="mt-8 text-neutral-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            Meral designs the campaigns clients see first: key visuals, brand lines, and print for real estate. This page shows that work only.
          </p>
        </div>

        {/* Studio Stats Grid with Crimson & Obsidian Finish */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10">
          {STUDIO_STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group p-5 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 hover:border-red-500/40 hover:bg-red-950/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white group-hover:text-red-500 transition-colors">
                  {stat.value}
                </span>
                <Droplets className="w-4 h-4 text-neutral-600 group-hover:text-red-500 group-hover:scale-125 transition-all" />
              </div>
              <p className="font-mono text-[11px] sm:text-xs text-neutral-400 tracking-wider uppercase mt-1 leading-snug">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
