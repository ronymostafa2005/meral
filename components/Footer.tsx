"use client";

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { sound } from '../utils/audio';
import { LiquidWaveText } from './LiquidWaveText';
import { ScrambleText } from './ScrambleText';
import { MeralLogo } from './MeralLogo';
import { useSite } from './SiteProvider';

export const Footer: React.FC = () => {
  const [year, setYear] = useState(2026);
  const { content } = useSite();
  const footer = content.footer;

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const scrollToTalk = () => {
    sound.playWaterDrop();
    document.getElementById('talk')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    sound.playWaterRipple();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-[1] w-full bg-[#030303]/70 text-white pt-20 pb-12 px-4 sm:px-8 md:pr-24 border-t border-red-500/20 select-none overflow-hidden">
      {/* Background ambient crimson glow */}
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-red-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Massive Callout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-red-500 block mb-3 font-semibold">
              {footer.kicker}
            </span>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
              <LiquidWaveText text={footer.lineA} className="hover:text-red-500" />
              <br />
              <span className="text-neutral-500 font-light">{footer.lineB}</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={scrollToTalk}
              onMouseEnter={() => sound.playHover()}
              className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-95"
            >
              <span>{footer.cta}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-3.5 rounded-full border border-white/20 hover:border-red-500 hover:bg-red-500/10 text-white transition-all cursor-pointer shadow-md"
              aria-label="Back to top of page"
              title="Surge to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Hubs and Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-mono text-xs">
          {/* Studios */}
          <div>
            <span className="text-red-400 uppercase tracking-widest block mb-4 font-semibold">
              {footer.practiceLabel}
            </span>
            <div className="space-y-4 text-neutral-300">
              <MeralLogo />
              <p className="text-neutral-400 leading-relaxed font-light">
                {footer.practiceBody}
              </p>
            </div>
          </div>

          {/* Socials */}
          <div>
            <span className="text-red-400 uppercase tracking-widest block mb-4 font-semibold">
              {footer.linksLabel}
            </span>
            <ul className="space-y-2.5">
              {footer.links.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    onMouseEnter={() => sound.playHover()}
                    className="group inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <ScrambleText text={s.name} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status & Legal */}
          <div>
            <span className="text-red-400 uppercase tracking-widest block mb-4 font-semibold">
              {footer.ethosLabel}
            </span>
            <p className="text-neutral-400 leading-relaxed font-light mb-4">
              {footer.ethosBody}
            </p>
            <div className="p-3.5 bg-neutral-900 border border-red-500/30 rounded-xl text-neutral-300 text-[11px] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
              <span>{footer.status}</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
          <div>
            &copy; {year} {content.brand.logoWord || 'MERAL'}. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>{footer.credit}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
