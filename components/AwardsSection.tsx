"use client";

import React from 'react';
import { motion } from 'motion/react';
import { AWARDS } from '../data/portfolioData';
import { Trophy, Award, Sparkles } from 'lucide-react';
import { LiquidWaveText } from './LiquidWaveText';
import { ScrambleText } from './ScrambleText';

export const AwardsSection: React.FC = () => {
  return (
    <section id="awards" className="relative w-full py-28 px-4 sm:px-8 border-b border-white/10 bg-[#050505]/55 scroll-mt-20">
      {/* Background ambient crimson glow */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-red-500 uppercase mb-3">
              <Trophy className="w-4 h-4 text-red-500" />
              <span>04 &bull; WHAT IS ON VIEW</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-[1.1]">
              Six campaigns. Two brands. Nothing else on this page.
            </h2>
          </div>

          <p className="text-neutral-400 text-sm sm:text-base max-w-md font-light leading-relaxed">
            The selection is limited to work Meral designed for Lux Realty and Rise Tower Developments.
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {AWARDS.map((award, idx) => (
            <motion.div
              key={award.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className="bg-[#0b0b0b] border border-white/10 hover:border-red-500/50 rounded-2xl p-6 flex flex-col justify-between hover:bg-gradient-to-br hover:from-[#140608] hover:to-[#0b0b0b] transition-all hover:-translate-y-1 group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-red-500 tracking-widest font-bold">
                    {award.year}
                  </span>
                  <Award className="w-4 h-4 text-red-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-display text-lg font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                  <ScrambleText text={award.title} />
                </h4>
                <p className="text-xs text-neutral-400 font-mono tracking-wider">
                  {award.type}
                </p>
              </div>

              {/* Platform Tag */}
              <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 font-medium group-hover:border group-hover:border-red-500/30 group-hover:text-white transition-colors">
                  {award.platform}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
