"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { sound } from "../utils/audio";

export type FanCardData = {
  id: string;
  title: string;
  image?: string;
  mark?: string;
  from?: string;
  to?: string;
  icon?: string;
};

// Default high-fashion creative artworks matching the user's reference screenshot
const DEFAULT_PALETTES = [
  {
    image: "/work/unseen.jpg",
    color: "#8A2BE2", // Deep Purple / Violet
    gradient: "from-purple-900/60 via-purple-600/30 to-black/40",
  },
  {
    image: "/work/rise-2.jpg",
    color: "#00E5FF", // Cyan / Neon Blue
    gradient: "from-cyan-900/60 via-cyan-500/30 to-black/40",
  },
  {
    image: "/work/rise-1.jpg",
    color: "#FF1493", // Hot Pink / Magenta (Center Card)
    gradient: "from-pink-900/60 via-rose-500/30 to-black/40",
  },
  {
    image: "/work/rise-3.jpg",
    color: "#FFB800", // Amber / Cyber Gold
    gradient: "from-amber-900/60 via-yellow-500/30 to-black/40",
  },
  {
    image: "/work/village.jpg",
    color: "#00E676", // Neon Green / Emerald
    gradient: "from-emerald-900/60 via-teal-500/30 to-black/40",
  },
];

// Exact curved fan layout matching the user screenshot (Center upright at pinnacle, sides tilting down)
const ARC_SLOTS = [
  { offset: -2, x: "-55%", y: 38, rotate: -22, scale: 0.86, z: 10 },
  { offset: -1, x: "-28%", y: 16, rotate: -11, scale: 0.96, z: 20 },
  { offset: 0, x: "0%", y: 0, rotate: 0, scale: 1.1, z: 30 }, // Center upright
  { offset: 1, x: "28%", y: 16, rotate: 11, scale: 0.96, z: 20 },
  { offset: 2, x: "55%", y: 38, rotate: 22, scale: 0.86, z: 10 },
];

export function CardFan({
  cards,
  caption,
  onSelect,
}: {
  cards: FanCardData[];
  caption?: string;
  onSelect?: (card: FanCardData) => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Take up to 5 cards for the symmetrical fan matching the reference
  const fanCards = cards.slice(0, 5);
  const activeIdx = hoveredIdx !== null ? hoveredIdx : 2; // Default center is active
  const activeCard = fanCards[activeIdx] || fanCards[2] || cards[0];

  return (
    <div className="relative mx-auto w-full max-w-[780px] flex flex-col items-center">
      {/* 1. COMPACT FAN STAGE (Zero bloated height, cards fill the view) */}
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] flex items-center justify-center overflow-visible">
        {/* Ambient atmospheric backglow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl transition-colors duration-500"
          style={{ background: DEFAULT_PALETTES[activeIdx]?.color || "#FF1493" }}
        />

        {/* The 5 Fan Cards */}
        {fanCards.map((card, i) => {
          const slot = ARC_SLOTS[i] || ARC_SLOTS[2];
          const isHovered = hoveredIdx === i;
          const isCenter = slot.offset === 0;
          const palette = DEFAULT_PALETTES[i] || DEFAULT_PALETTES[2];
          const cardImage = card.image || palette.image;

          return (
            <motion.button
              key={card.id || i}
              type="button"
              aria-label={card.title}
              onMouseEnter={() => {
                sound.playHover();
                setHoveredIdx(i);
              }}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => {
                sound.playClick();
                onSelect?.(card);
              }}
              animate={{
                x: slot.x,
                y: isHovered ? slot.y - 18 : slot.y,
                rotate: isHovered ? 0 : slot.rotate,
                scale: isHovered ? slot.scale * 1.08 : slot.scale,
                zIndex: isHovered ? 50 : slot.z,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              style={{
                transformOrigin: "50% 100%",
              }}
              className="group absolute w-[150px] sm:w-[180px] md:w-[200px] aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-[#0a0a0d] shadow-[0_20px_45px_rgba(0,0,0,0.85)] outline-none transition-shadow duration-300 hover:border-white/70 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            >
              {/* Card Photo Artwork */}
              <img
                src={cardImage}
                alt={card.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Tinted Color Gradient Overlay matching the reference */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${palette.gradient} mix-blend-color opacity-70`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Top Software Icon Badge */}
              {card.icon && (
                <div className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-xl bg-black/70 p-1 border border-white/20 backdrop-blur-md shadow-md">
                  <img src={card.icon} alt="" className="h-full w-full object-contain" />
                </div>
              )}

              {/* Bottom Subtle Label on Card */}
              <div className="absolute inset-x-2 bottom-2 z-20 text-center">
                <span className="font-display text-[10px] sm:text-xs font-bold text-white tracking-wider drop-shadow-md truncate block">
                  {card.title}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 2. COMPACT CENTERED CAPTION (Matching the screenshot: e.g. "Eyewear That Stands Out") */}
      <div className="mt-2 text-center">
        <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide transition-all">
          {activeCard?.title ? `${activeCard.title} • Motion & Art Direction` : "Design Tools In Motion"}
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 mt-0.5">
          {caption || "Graphic design & campaign systems"}
        </p>
      </div>
    </div>
  );
}
