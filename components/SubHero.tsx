"use client";

import React from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../data/portfolioData';
import { Aperture, Images, Quote, BookOpen, type LucideIcon } from 'lucide-react';

const SERVICE_ICONS: Record<(typeof SERVICES)[number]['icon'], LucideIcon> = {
  direction: Aperture,
  campaigns: Images,
  voice: Quote,
  print: BookOpen
};

export const SubHero: React.FC = () => {
  return (
    <section className="relative w-full py-24 sm:py-32 px-4 sm:px-8 border-b border-red-950/40 overflow-hidden bg-[#050505]/55">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 pt-10 border-t border-white/10">
          {SERVICES.map((service, idx) => {
            const Icon = SERVICE_ICONS[service.icon];
            return (
              <motion.div
                key={service.icon}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5 transition-all duration-300 hover:border-[#c4a574]/40 hover:bg-[#c4a574]/[0.04]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#c4a574] transition-colors group-hover:border-[#c4a574]/40">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-100">
                    {service.title}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-neutral-500">
                    {service.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
