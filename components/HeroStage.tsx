"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { sound } from "../utils/audio";
import { useSite } from "./SiteProvider";

interface HeroStageProps {
  onOpenProjectBot?: () => void;
}

/**
 * The tone the photo's own surround settles to. Both the foot of the phone
 * banner and the field of copy beneath it start here, so the two meet without
 * a seam and the whole card reads as one lit space.
 */
const BAND_FOOT = "color-mix(in srgb, var(--brand-hot, #f95721) 22%, #120302)";

/**
 * The opening card.
 *
 * Everything on it comes from the dashboard, and the atmosphere is mixed from
 * the brand colours rather than hard-coded: the radial behind the portrait is
 * the hot accent stepped down to the page background, so changing the accent
 * in Brand Identity re-tints the whole stage instead of leaving an orange hero
 * on a navy site.
 *
 * This card carries its own navigation. The fixed site header stays hidden
 * until the visitor scrolls past it, so the two never stack at the top.
 */
export const HeroStage: React.FC<HeroStageProps> = ({ onOpenProjectBot }) => {
  const { content } = useSite();
  const hero = content.hero;
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const clients = content.about.clients.filter(Boolean).slice(0, 4);

  const scrollTo = (id: string) => {
    sound.playWaterDrop();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative w-full select-none overflow-hidden pb-12 pt-2 sm:pt-4"
      style={{ backgroundColor: "var(--page-bg, #0a0707)" }}
    >
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6">
        {/* MAIN HERO CARD */}
        <div
          className="relative w-full overflow-hidden rounded-[2.2rem] border border-white/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.9)] sm:rounded-[3rem]"
          style={{ backgroundColor: "var(--page-bg, #050505)" }}
        >
          {/* Atmosphere, mixed from the hot accent. The card is the one place
              on the site that runs hot — everything below it stays on the
              studio's gold — so the glow is built from --brand-hot rather than
              the primary accent, and follows it if the owner changes it. */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(circle at 44% 36%," +
                " color-mix(in srgb, var(--brand-hot, #f95721) 72%, #ffd0a8) 0%," +
                " var(--brand-hot, #f95721) 22%," +
                " color-mix(in srgb, var(--brand-hot, #f95721) 70%, #000) 46%," +
                " color-mix(in srgb, var(--brand-hot, #f95721) 32%, #000) 72%," +
                " color-mix(in srgb, var(--brand-hot, #f95721) 9%, #000) 96%)",
            }}
          />

          {/* Portrait fills the card. The shot carries its own glow, so it
              sits over the radial and keeps its colour; the overlays below
              only buy back contrast where type sits on top of it. */}
          {/* On a phone the card is tall and narrow while the shot is wide, so
              filling it would zoom into a fragment of her face. Below lg the
              photo becomes a banner band across the top instead: the band is
              shorter than it is wide, so cover scales to the band's height and
              the whole picture stays in frame, with the copy below it. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-80 overflow-hidden sm:h-96 lg:inset-0 lg:h-full">
            <img
              src={hero.portrait}
              alt={hero.portraitAlt}
              /* Desktop anchors to the top of the frame: cover has to crop
                 somewhere, and taking it off the bottom costs a little
                 shoulder — which the disciplines row covers anyway — rather
                 than the top of her head. */
              className="h-full w-full object-cover object-[55%_center] brightness-[0.98] contrast-[1.04] lg:object-[62%_top]"
            />
            {/* Feathers the photo's rectangle into the radial behind it. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 78% 86% at 56% 44%, transparent 0%, transparent 62%," +
                  " color-mix(in srgb, #120302 45%, transparent) 86%, #120302 100%)",
              }}
            />
            {/* The side gradients clear the headline and statement columns,
                which only exist once the copy sits over the photo. */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background:
                  "linear-gradient(to right, rgba(18,3,2,0.78) 0%," +
                  " rgba(18,3,2,0.34) 20%, rgba(18,3,2,0.08) 36%, transparent 50%)",
              }}
            />
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background:
                  "linear-gradient(to left, rgba(18,3,2,0.66) 0%," +
                  " rgba(18,3,2,0.28) 14%, transparent 30%)",
              }}
            />
            {/* Foot: under the disciplines row on desktop, and the seam where
                the banner band meets the copy on a phone. */}
            {/* Desktop: settles the photo under the disciplines row. */}
            <div className="absolute inset-x-0 bottom-0 hidden h-44 bg-gradient-to-t from-[#120302] via-[#120302]/70 to-transparent lg:block" />
            {/* Phone: hands the band off to the field below in the same tone,
                so there is no seam where the photo stops. */}
            <div
              className="absolute inset-x-0 bottom-0 h-24 lg:hidden"
              style={{
                background:
                  "linear-gradient(to top, " +
                  BAND_FOOT +
                  " 0%, color-mix(in srgb, var(--brand-hot, #f95721) 16%, #120302) 55%, transparent 100%)",
              }}
            />
          </div>

          {/* Below the band the raw radial would leave white copy on bright
              orange. Rather than blacking it out, this carries the same deep
              red the photo sits in down through the copy, so the card reads as
              one lit room rather than a photo pasted onto a dark panel.
              Phone only — on lg the photo covers this area itself. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 top-80 z-[2] sm:top-96 lg:hidden"
            style={{
              background:
                "linear-gradient(to bottom, " +
                BAND_FOOT +
                " 0%," +
                " color-mix(in srgb, var(--brand-hot, #f95721) 15%, #0f0201) 42%," +
                " color-mix(in srgb, var(--brand-hot, #f95721) 8%, #0c0201) 100%)",
            }}
          />

          {/* 1. NAVIGATION INSIDE THE CARD */}
          <header className="relative z-30 flex items-center justify-between px-6 pb-4 pt-7 sm:px-10 lg:px-14">
            <a
              href="#hero"
              onClick={(event) => {
                event.preventDefault();
                sound.playWaterRipple();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer font-sans text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90 sm:text-2xl"
            >
              {content.brand.logoWord || content.brand.name}
            </a>

            <div className="flex items-center gap-7 sm:gap-10">
              <nav className="hidden items-center gap-8 font-sans text-sm font-medium text-white/80 md:flex">
                {[
                  { id: "hero", label: "Home" },
                  { id: "about", label: content.nav.about },
                  { id: "works", label: content.nav.works },
                ].map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    onMouseEnter={() => sound.playHover()}
                    className="cursor-pointer capitalize transition-colors hover:text-white"
                  >
                    {/* Nav labels are stored uppercase for the fixed header;
                        this card sets them in sentence case. */}
                    {link.label.toLocaleLowerCase()}
                  </button>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => {
                  sound.playWaterDrop();
                  if (onOpenProjectBot) onOpenProjectBot();
                  else scrollTo("talk");
                }}
                className="group flex cursor-pointer items-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-xs font-semibold text-black shadow-lg transition-all hover:bg-neutral-100 active:scale-95 sm:text-sm"
              >
                <span>{content.nav.cta}</span>
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors"
                  style={{ backgroundColor: "var(--brand-hot, #f95721)" }}
                >
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>
          </header>

          {/* 2. CENTRE STAGE */}
          {/* Top padding clears the banner band on a phone (band height minus
              the nav that overlaps it); on lg the copy sits over the photo. */}
          <div className="relative z-10 flex min-h-[560px] w-full flex-col justify-between px-6 pb-8 pt-60 sm:min-h-[620px] sm:px-10 sm:pt-72 lg:min-h-[700px] lg:px-14 lg:pt-8">

            {/* Typography */}
            <div className="relative z-20 my-auto flex w-full flex-col items-start gap-6 pt-6 sm:gap-8 lg:grid lg:grid-cols-12 lg:items-center lg:pt-0">
              {/* Four columns and capped: the headline has to stop well before
                  it reaches her face. */}
              <div className="z-20 flex w-full max-w-[25rem] flex-col justify-center text-left lg:col-span-4">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-2 font-sans text-base font-medium tracking-tight text-white/85 sm:text-lg"
                >
                  {hero.greeting}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="font-sans text-[2.5rem] font-extrabold leading-[0.97] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)] sm:text-[2.9rem] md:text-[3.3rem] lg:text-[3.4rem] xl:text-[3.9rem]"
                >
                  <span className="block">{hero.headline}</span>
                  <span className="mt-1 block">{hero.headlineAccent}</span>
                </motion.h1>
              </div>

              {/* Wide gap: she stands in it, untouched by either column. */}
              <div className="hidden lg:col-span-5 lg:block" />

              <div className="z-20 mt-2 flex w-full flex-col justify-center text-left lg:col-span-3 lg:ml-auto lg:mt-0 lg:max-w-[16rem]">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="space-y-3 rounded-2xl border border-white/10 bg-[#0d0504]/40 p-3.5 backdrop-blur-sm lg:border-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
                >
                  <h2 className="font-sans text-xl font-bold leading-[1.22] tracking-tight text-white sm:text-2xl lg:text-3xl">
                    {hero.statementHeadline}
                  </h2>
                  <p className="text-xs font-normal leading-relaxed text-white/70 sm:text-sm">
                    {hero.statementBody}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* 3. DISCIPLINES */}
            {hero.services.length > 0 && (
              <div className="relative z-20 mt-6 w-full border-t border-white/10 pt-8 sm:mt-8 sm:pt-10">
                <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
                  {hero.services.map((service, index) => (
                    <div
                      key={`${service.number}-${index}`}
                      onMouseEnter={() => {
                        sound.playHover();
                        setHoveredService(index);
                      }}
                      onMouseLeave={() => setHoveredService(null)}
                      className={`group flex cursor-default flex-col gap-1 rounded-xl p-2 transition-all duration-300 ${
                        hoveredService === index ? "bg-white/[0.04]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: "var(--brand-hot, #f95721)" }}
                        />
                        <span
                          className="font-mono text-xs font-bold tracking-wider"
                          style={{ color: "var(--brand-hot, #f95721)" }}
                        >
                          #{service.number}
                        </span>
                      </div>
                      <p className="font-sans text-xs font-medium text-white/85 transition-colors group-hover:text-white sm:text-sm">
                        {service.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. CLIENT STRIP */}
        {clients.length > 0 && (
          <div className="mt-6 flex w-full flex-col justify-between gap-6 px-4 py-4 text-neutral-400 sm:px-6 md:flex-row md:items-center">
            <div className="font-sans text-xs tracking-wide text-neutral-400">
              {hero.clientsLine}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-neutral-300 sm:gap-12">
              {clients.map((client) => (
                <div
                  key={client}
                  className="flex cursor-default items-center gap-2 transition-colors hover:text-white"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--brand, #c4a574)" }}
                  />
                  <span>{client}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
