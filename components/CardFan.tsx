"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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

// Metadata for known design tools
const TOOL_META: Record<
  string,
  { category: string; description: string; proficiency: number; gradient: string; shadow: string }
> = {
  ps: {
    category: "Photo & Compositing",
    description: "Advanced photo retouching, visual effects & digital compositing.",
    proficiency: 97,
    gradient: "from-[#001d40] to-[#0a4a8a]",
    shadow: "rgba(49,168,255,0.45)",
  },
  ai: {
    category: "Vector & Branding",
    description: "Logos, brand identity systems, typography & illustration.",
    proficiency: 99,
    gradient: "from-[#2a1700] to-[#7a3600]",
    shadow: "rgba(255,154,0,0.45)",
  },
  id: {
    category: "Print & Layout",
    description: "Brochures, catalogues, editorial layouts & print production.",
    proficiency: 92,
    gradient: "from-[#33001a] to-[#8a0030]",
    shadow: "rgba(255,51,102,0.45)",
  },
  ae: {
    category: "Motion & Animation",
    description: "Campaign motion graphics, animated visuals & VFX.",
    proficiency: 88,
    gradient: "from-[#0d0033] to-[#3a0080]",
    shadow: "rgba(153,153,255,0.45)",
  },
  pr: {
    category: "Video Editing",
    description: "Campaign films, social content & presentation reels.",
    proficiency: 85,
    gradient: "from-[#0d0033] to-[#3a0080]",
    shadow: "rgba(153,153,255,0.45)",
  },
  lr: {
    category: "Color Grading",
    description: "Photography color treatment, presets & batch editing.",
    proficiency: 90,
    gradient: "from-[#001233] to-[#003380]",
    shadow: "rgba(49,168,255,0.45)",
  },
  fg: {
    category: "UI & Prototyping",
    description: "Digital interfaces, social templates & interactive prototypes.",
    proficiency: 82,
    gradient: "from-[#1a0033] to-[#5a0099]",
    shadow: "rgba(162,89,255,0.45)",
  },
};

function getFallbackMeta(title: string) {
  return {
    category: "Design Tool",
    description: `Professional-grade ${title} for creative workflow.`,
    proficiency: 85,
    gradient: "from-[#111] to-[#222]",
    shadow: "rgba(255,255,255,0.2)",
  };
}

export function CardFan({
  cards,
  caption,
  onSelect,
}: {
  cards: FanCardData[];
  caption?: string;
  onSelect?: (card: FanCardData) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeCard = cards.find((c) => c.id === activeId) || cards[0];
  const meta = activeCard
    ? TOOL_META[activeCard.id] || getFallbackMeta(activeCard.title)
    : null;

  const handleSelect = (card: FanCardData) => {
    if (card.id === activeId) {
      setActiveId(null);
    } else {
      setActiveId(card.id);
      sound.playClick?.();
      onSelect?.(card);
    }
  };

  return (
    <div className="relative w-full flex flex-col gap-6">
      {/* Caption */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500">
          {caption || "Design tools in motion"}
        </span>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {cards.map((card, i) => {
          const m = TOOL_META[card.id] || getFallbackMeta(card.title);
          const isActive = activeId === card.id;
          const isHovered = hovered === card.id;

          return (
            <motion.button
              key={card.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleSelect(card)}
              onMouseEnter={() => {
                sound.playHover?.();
                setHovered(card.id);
              }}
              onMouseLeave={() => setHovered(null)}
              className={`group relative flex flex-col items-center justify-center gap-2 rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-300 border ${
                isActive
                  ? "border-white/40 bg-gradient-to-b shadow-2xl scale-105"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
              }`}
              style={
                isActive
                  ? {
                      background: `linear-gradient(160deg, ${m.gradient.replace("from-", "").replace("to-", "").split(" ")[0]} 0%, #0a0a0a 100%)`,
                      boxShadow: `0 12px 40px ${m.shadow}, 0 0 0 1px rgba(255,255,255,0.15)`,
                    }
                  : isHovered
                  ? {
                      boxShadow: `0 8px 24px ${m.shadow}40`,
                    }
                  : {}
              }
              aria-label={card.title}
            >
              {/* Icon */}
              <div
                className={`relative flex items-center justify-center rounded-xl transition-all duration-300 ${
                  isActive ? "w-12 h-12 sm:w-14 sm:h-14" : "w-10 h-10 sm:w-12 sm:h-12"
                }`}
              >
                {card.icon ? (
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="w-full h-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-lg">
                    {card.title[0]}
                  </div>
                )}

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </div>

              {/* Tool name */}
              <span
                className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-wider leading-none transition-colors duration-300 text-center ${
                  isActive ? "text-white font-bold" : "text-neutral-500 group-hover:text-neutral-300"
                }`}
              >
                {card.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Active Tool Detail Panel */}
      <AnimatePresence mode="wait">
        {activeCard && meta && (
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.6) 100%)`,
                boxShadow: `0 4px 30px ${meta.shadow}20`,
              }}
            >
              {/* Icon large */}
              <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                {activeCard.icon ? (
                  <img src={activeCard.icon} alt={activeCard.title} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                ) : (
                  <span className="text-white font-bold text-2xl">{activeCard.title[0]}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-display text-base sm:text-lg font-bold text-white leading-none">
                    {activeCard.title}
                  </h3>
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border"
                    style={{
                      color: activeCard.to || "#c4a574",
                      borderColor: `${activeCard.to || "#c4a574"}40`,
                      background: `${activeCard.to || "#c4a574"}10`,
                    }}
                  >
                    {meta.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mt-1">
                  {meta.description}
                </p>

                {/* Proficiency Bar */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest shrink-0">
                    Proficiency
                  </span>
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${meta.proficiency}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${activeCard.to || "#c4a574"}, #ffffff80)` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-white shrink-0">
                    {meta.proficiency}%
                  </span>
                </div>
              </div>

              {/* Close hint */}
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="shrink-0 self-start sm:self-center text-neutral-500 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-wider cursor-pointer"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
