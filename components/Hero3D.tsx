"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { sound } from "../utils/audio";
import { ScrambleText } from "./ScrambleText";
import { ToolStage } from "./ToolStage";

const FACTS = ["Art direction", "Campaign design", "Print & brand voice"];

export function Hero3D() {
  return (
    <section
      id="hero"
      className="relative flex w-full flex-col overflow-hidden bg-[#050505] px-5 pb-8 pt-24 sm:px-8 sm:pb-12 sm:pt-28 lg:min-h-[100svh] lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(196,165,116,0.1)_0%,_rgba(10,8,6,0.2)_42%,_#050505_78%)]" />

      <div className="relative z-20 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 pt-2 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 sm:flex-row sm:text-xs sm:tracking-widest">
        <span className="text-white">Graphic designer</span>
        <span>Real estate campaigns</span>
      </div>

      <div className="relative z-20 mx-auto grid w-full max-w-6xl items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-10">
        <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#c4a574]">
            Meral
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mt-3 font-display text-[2.6rem] font-extrabold leading-none tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Campaigns with
            <span className="mt-1 block bg-gradient-to-r from-[#c4a574] via-white to-neutral-300 bg-clip-text text-transparent">
              a point of view.
            </span>
          </motion.h1>
          <p className="mt-5 max-w-xl text-[15px] font-light leading-7 text-neutral-300 sm:text-base sm:leading-8">
            Meral is a graphic designer. She builds the visual language of a development before the listing does: one place, one line, and a picture that explains why it is worth choosing.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            {FACTS.map((fact) => (
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
          <div className="relative h-52 w-52 sm:h-64 sm:w-64 lg:h-[22rem] lg:w-[22rem]">
            <div className="absolute -inset-3 rounded-full border border-[#c4a574]/35" />
            <div className="absolute -inset-1 rounded-full border border-white/10" />
            <div className="h-full w-full overflow-hidden rounded-full bg-[#161616] shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
              <img
                src="/work/meral.png"
                alt="Portrait of Meral, graphic designer"
                width={1176}
                height={1104}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <figcaption className="mt-5 max-w-[16rem] px-3 text-center">
            <span className="block font-display text-2xl tracking-wide text-white">Meral</span>
            <span className="mt-1 block font-mono text-[10px] uppercase leading-5 tracking-[0.16em] text-neutral-500">
              Art director
              <br />
              Campaign design
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
          className="group flex items-center gap-2 text-white transition-colors hover:text-[#c4a574]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:border-[#c4a574]">
            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
          </span>
          <ScrambleText text="VIEW THE WORK" />
        </a>
        <span className="max-w-xs leading-5 tracking-wide text-neutral-500 sm:max-w-none">
          Photoshop · Illustrator · InDesign · After Effects · Figma
        </span>
      </div>
    </section>
  );
}
