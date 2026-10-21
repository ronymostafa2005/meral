"use client";

import React from 'react';
import { motion } from 'motion/react';
import { CAPABILITIES, CLIENT_LOGOS } from '../data/portfolioData';
import { Check, Sparkles, Droplets } from 'lucide-react';
import { LiquidWaveText } from './LiquidWaveText';
import { ScrambleText } from './ScrambleText';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full py-28 px-4 sm:px-8 border-b border-white/10 overflow-hidden bg-[#050505] scroll-mt-20">
      {/* Background ambient crimson glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        {/* Top Manifesto Statement */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-red-500 uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>03 &bull; MERAL &bull; GRAPHIC DESIGN</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] max-w-5xl"
          >
            Campaigns are built to be read once. The place comes first, the offer second, and nothing extra stays in the frame.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6 text-neutral-300 font-light text-base sm:text-lg leading-relaxed">
            <p>
              Meral is a graphic designer working on real estate campaigns. The work here is hers: art direction, key visuals, brand lines, and print for Lux Realty and Rise Tower Developments.
            </p>
            <p>
              Each project is a small system. A name, a sentence, a photograph, and a mark. The same discipline runs from a night tower visual to a printed sheet.
            </p>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xs font-mono tracking-widest uppercase text-red-400">
              // PRACTICE
            </h3>
            <span className="text-xs font-mono text-neutral-400">ART DIRECTION TO PRINT</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {CAPABILITIES.map((cap) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group bg-[#0c0c0c] border border-white/10 hover:border-red-500/40 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:bg-gradient-to-br hover:from-[#110507] hover:to-[#0c0c0c] transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-red-500 font-bold">{cap.number}</span>
                    <Droplets className="w-4 h-4 text-neutral-600 group-hover:text-red-500 transition-colors" />
                  </div>
                  <h4 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-red-400 transition-colors mb-3">
                    <ScrambleText text={cap.title} />
                  </h4>
                  <p className="text-neutral-400 text-sm sm:text-base font-light mb-8 leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-6 border-t border-white/10">
                  {cap.tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Client Roster Marquee */}
        <div className="pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xs font-mono tracking-widest uppercase text-neutral-400">
              // CLIENTS IN THIS SELECTION
            </h3>
            <span className="text-xs font-mono text-red-400">
              SELECTED BRANDS
            </span>
          </div>

          {/* Marquee Row */}
          <div className="overflow-hidden py-5 border-y border-white/10 relative bg-black/40">
            <div className="animate-marquee flex items-center gap-12 sm:gap-16 whitespace-nowrap">
              {CLIENT_LOGOS.concat(CLIENT_LOGOS).map((client, idx) => (
                <div key={idx} className="flex items-center gap-12 sm:gap-16">
                  <span className="font-display text-xl sm:text-2xl font-bold text-neutral-400 hover:text-white hover:scale-105 transition-all cursor-default">
                    {client}
                  </span>
                  <span className="text-red-500/50 text-lg">&bull;</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
