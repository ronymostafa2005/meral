"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Volume2,
} from "lucide-react";
import { Project } from "../types/portfolio";
import { sound } from "../utils/audio";
import { LiquidWaveText } from "./LiquidWaveText";
import { ScrambleText } from "./ScrambleText";

interface BookFolioProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

export const BookFolio: React.FC<BookFolioProps> = ({ projects, onOpenProject }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Keep index within bounds if projects change
  useEffect(() => {
    if (activeIndex >= projects.length) {
      setActiveIndex(Math.max(0, projects.length - 1));
    }
  }, [projects.length, activeIndex]);

  const activeProject = projects[activeIndex] || projects[0];

  const handleSelect = (idx: number) => {
    if (idx === activeIndex) return;
    sound.playWaterRipple();
    setActiveIndex(idx);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playWaterDrop();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playWaterDrop();
    setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation (Left / Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!projects.length) return null;

  return (
    <div className="relative w-full flex flex-col gap-8 select-none">
      {/* 1. TOP CHAPTER INDEX TABS (Exact match to screenshot) */}
      <div className="w-full overflow-x-auto pb-4 scrollbar-none">
        <div className="flex items-start justify-between min-w-[700px] border-b border-white/10 pb-4 px-2">
          {projects.map((proj, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className="group flex flex-col items-start text-left cursor-pointer transition-all duration-300"
              >
                {/* Title & Client */}
                <span
                  className={`font-sans text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                    isActive ? "text-white" : "text-neutral-400 group-hover:text-neutral-200"
                  }`}
                >
                  {proj.title}
                </span>
                <span className="font-mono text-[10px] text-neutral-500 tracking-wider truncate max-w-[130px]">
                  {proj.client}
                </span>

                {/* Dot Indicator below each item */}
                <div className="mt-3 flex items-center justify-center w-full">
                  <span
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-6 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                        : "w-2 bg-neutral-600 group-hover:bg-neutral-400"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THE 3D BOOK ACCORDION STAGE */}
      <div
        className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] rounded-3xl overflow-hidden bg-[#070709] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.8)] p-2 sm:p-4"
        style={{ perspective: "1500px" }}
      >
        {/* Ambient colored background aura */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 transition-all duration-700 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${
              activeProject?.accentColor || "#ef4444"
            }33 0%, transparent 70%)`,
          }}
        />

        {/* 3D Book Panels Container */}
        <div
          className="relative w-full h-full flex items-stretch gap-1 sm:gap-2 overflow-hidden rounded-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          {projects.map((proj, idx) => {
            const isActive = idx === activeIndex;
            const isLeft = idx < activeIndex;
            const isRight = idx > activeIndex;

            // Rotation angle simulating book pages unfolding
            let rotateY = 0;
            let transformOrigin = "center center";
            if (isLeft) {
              rotateY = 24 + (activeIndex - idx) * 3;
              transformOrigin = "right center";
            } else if (isRight) {
              rotateY = -24 - (idx - activeIndex) * 3;
              transformOrigin = "left center";
            }

            return (
              <motion.div
                key={proj.id}
                onClick={() => handleSelect(idx)}
                layout
                transition={{
                  layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin,
                  transform: `rotateY(${rotateY}deg) scale(${isActive ? 1 : 0.96})`,
                  zIndex: isActive ? 20 : 10 - Math.abs(activeIndex - idx),
                }}
                className={`relative h-full cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-500 ${
                  isActive
                    ? "flex-[3.8] sm:flex-[4.5] border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                    : "flex-[0.7] sm:flex-[0.9] border-white/10 hover:border-white/20 opacity-70 hover:opacity-90"
                }`}
              >
                {/* Book Page Image */}
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* 3D Spine & Page Crease Shadows (Creates the realistic open book fold) */}
                {isLeft && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                )}
                {isRight && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />
                )}

                {/* Top spine crease line */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-[1px] bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />

                {/* Inactive Panel Vertical Spine Title */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px]">
                    <span
                      className="font-display text-xs sm:text-sm font-bold tracking-widest text-white/80 uppercase whitespace-nowrap"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                      }}
                    >
                      {proj.title}
                    </span>
                  </div>
                )}

                {/* Active Page Overlay Gradient */}
                {isActive && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                )}

                {/* Active Page Content Card */}
                {isActive && (
                  <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 z-20 pointer-events-auto">
                    {/* Top Row: Year, Category & Open Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-white/20 bg-black/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
                          {proj.year || "2026"}
                        </span>
                        <span className="rounded-full bg-red-600/90 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white shadow-md">
                          {proj.category}
                        </span>
                      </div>

                      <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] text-neutral-300 backdrop-blur-md">
                        <BookOpen className="w-3 h-3 text-red-500" /> Folio Page {idx + 1}/
                        {projects.length}
                      </span>
                    </div>

                    {/* Bottom Row: Editorial Title, Client, and Case Study Button */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div className="max-w-xl">
                        <p className="font-mono text-xs text-[#c4a574] uppercase tracking-widest mb-1">
                          {proj.client}
                        </p>
                        <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
                          {proj.title}
                        </h3>
                        {proj.headline && (
                          <p className="mt-2 text-xs sm:text-sm text-neutral-300 line-clamp-2 max-w-md font-light">
                            {proj.headline}
                          </p>
                        )}

                        {/* Tags */}
                        {proj.tags && proj.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {proj.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-sm"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Open Case Study Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playWaterRipple();
                          onOpenProject(proj);
                        }}
                        className="group flex items-center gap-2 self-start sm:self-end px-5 py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-bold hover:bg-neutral-200 transition-all cursor-pointer shadow-xl active:scale-95"
                      >
                        <span>Open Case Study</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 3. FLIP ARROWS (PREV / NEXT) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous page"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next page"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/75 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all cursor-pointer hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 4. FOOTER NOTE & NAVIGATION HINT */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-500 px-2">
        <span>Click any page or use &larr; &rarr; arrow keys to unfold</span>
        <span>
          Page {activeIndex + 1} of {projects.length}
        </span>
      </div>
    </div>
  );
};
