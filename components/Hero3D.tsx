"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { sound } from "../utils/audio";
import { ScrambleText } from "./ScrambleText";
import { ToolStage } from "./ToolStage";
import { useSite } from "./SiteProvider";

export function Hero3D() {
  const { content } = useSite();
  const hero = content.hero;

  return (
    <section
      id="hero"
      className="relative flex w-full flex-col overflow-hidden bg-[#050505]/55 px-5 pb-3 pt-16 sm:px-8 sm:pb-5 sm:pt-20 lg:min-h-[88svh] lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,165,116,0.14)_0%,_rgba(140,64,72,0.08)_46%,_transparent_78%)]" />

      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 pt-1 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 sm:flex-row sm:text-xs sm:tracking-widest">
        <span className="text-white">{hero.leftLabel}</span>
        <span>{hero.rightLabel}</span>
      </div>

      <div className="relative z-20 mx-auto grid w-full max-w-6xl items-center gap-5 py-3 sm:gap-6 sm:py-4 lg:grid-cols-[1.15fr_0.85fr] lg:py-4">
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <p className="text-brand font-mono text-[11px] uppercase tracking-[0.32em]">
            {hero.eyebrow}
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-3 font-display text-[2.6rem] font-extrabold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            {hero.headline}
            <span className="text-brand mt-1 block">
              {hero.headlineAccent}
            </span>
          </motion.h1>
          <p className="mt-5 max-w-xl text-[15px] font-light leading-7 text-neutral-300 sm:text-base sm:leading-8">
            {hero.body}
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {hero.facts.filter(Boolean).map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-300"
              >
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="order-1 mx-auto flex flex-col items-center lg:order-2"
        >
          <div className="relative h-44 w-44 sm:h-56 sm:w-56 lg:h-72 lg:w-72">
            <div className="border-brand absolute -inset-2.5 rounded-full border" />
            <div className="absolute -inset-1 rounded-full border border-white/10" />
            <div className="h-full w-full overflow-hidden rounded-full bg-[#161616] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
              <img
                src={hero.portrait}
                alt={hero.portraitAlt}
                width={1024}
                height={1024}
                className="h-full w-full origin-center scale-[1.08] object-cover object-center"
              />
            </div>
          </div>
          <figcaption className="mt-5 max-w-[16rem] px-3 text-center">
            <span className="block font-display text-2xl tracking-wide text-white">{hero.name}</span>
            <span className="mt-1 block font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-neutral-500">
              {hero.roleLine1}
              <br />
              {hero.roleLine2}
            </span>
          </figcaption>
        </motion.figure>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-6xl">
        <ToolStage />
      </div>

      <div className="relative z-20 mx-auto mt-2 flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 text-center font-mono text-[11px] text-neutral-400 sm:flex-row sm:text-left">
        <a
          href="#works"
          onClick={() => sound.playWaterDrop()}
          className="group flex items-center gap-2 text-white transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition-colors">
            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
          </span>
          <ScrambleText text={hero.cta} />
        </a>
        <span className="max-w-xs leading-5 tracking-wide text-neutral-500 sm:max-w-none">
          {hero.toolsLine}
        </span>
      </div>
    </section>
  );
}
