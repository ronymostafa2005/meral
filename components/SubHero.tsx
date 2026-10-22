"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Aperture, Images, Quote, BookOpen, type LucideIcon } from 'lucide-react';
import { useSite } from './SiteProvider';

const SERVICE_ICONS: Record<string, LucideIcon> = {
  direction: Aperture,
  campaigns: Images,
  voice: Quote,
  print: BookOpen
};

export const SubHero: React.FC = () => {
  const { content } = useSite();
  const practice = content.practice;

  return (
    <section className="relative w-full py-12 sm:py-16 px-4 sm:px-8 border-b border-red-950/40 overflow-hidden bg-[#050505]/55">
      {/* Background ambient crimson glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12 relative z-10">
        {/* Statement / Manifesto */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs tracking-widest text-red-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{practice.kicker}</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-medium leading-tight tracking-tight text-white"
          >
            {practice.line1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 font-bold">
              {practice.highlight}
            </span>{' '}
            {practice.line2}
          </motion.h2>

          <p className="mt-8 text-neutral-400 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            {practice.body}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 pt-10 border-t border-white/10">
          {practice.services.map((service, idx) => {
            const Icon = SERVICE_ICONS[service.icon] || Aperture;
            return (
              <motion.div
                key={`${service.icon}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group flex h-full items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5 transition-all duration-300 hover:border-brand hover:bg-white/[0.04]"
              >
                <div className="text-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors">
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
