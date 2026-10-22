"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Sparkles, Layers, Eye } from "lucide-react";
import { Project } from "../types/portfolio";
import { sound } from "../utils/audio";
import { ScrambleText } from "./ScrambleText";

interface Brand3DCardProps {
  client: string;
  projects: Project[];
  onOpenProject: (project: Project) => void;
  index: number;
}

// 5 3D Orbital Slots surrounding the central brand logo
const SLOTS = [
  {
    id: "top-left",
    left: "14%",
    top: "14%",
    width: "25%",
    rotateZ: -12,
    rotateY: 14,
    rotateX: 8,
    z: 10,
    hoverZ: 40,
  },
  {
    id: "top-right",
    left: "86%",
    top: "14%",
    width: "24%",
    rotateZ: 14,
    rotateY: -14,
    rotateX: 8,
    z: 11,
    hoverZ: 40,
  },
  {
    id: "bottom-left",
    left: "16%",
    top: "84%",
    width: "23%",
    rotateZ: 9,
    rotateY: 10,
    rotateX: -8,
    z: 12,
    hoverZ: 40,
  },
  {
    id: "bottom-right",
    left: "84%",
    top: "84%",
    width: "24%",
    rotateZ: -11,
    rotateY: -12,
    rotateX: -8,
    z: 13,
    hoverZ: 40,
  },
  {
    id: "top-center",
    left: "50%",
    top: "10%",
    width: "20%",
    rotateZ: -3,
    rotateY: 0,
    rotateX: 12,
    z: 9,
    hoverZ: 35,
  },
];

function extractPieces(projects: Project[]) {
  const pieces: { src: string; project: Project }[] = [];
  const seen = new Set<string>();

  for (const project of projects) {
    if (project.coverImage && !seen.has(project.coverImage)) {
      seen.add(project.coverImage);
      pieces.push({ src: project.coverImage, project });
    }
  }
  for (const project of projects) {
    for (const img of project.galleryImages || []) {
      if (img && !seen.has(img) && pieces.length < SLOTS.length) {
        seen.add(img);
        pieces.push({ src: img, project });
      }
    }
  }
  return pieces.slice(0, SLOTS.length);
}

function BrandLogoCenter({
  client,
  logo,
  accentColor,
}: {
  client: string;
  logo?: string;
  accentColor: string;
}) {
  return (
    <div className="absolute left-1/2 top-1/2 z-30 flex aspect-square w-[26%] sm:w-[24%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl border border-white/30 bg-[#0a0a0d]/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-2xl transition-transform duration-500 group-hover:scale-105">
      {/* Soft central ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-40 blur-xl"
        style={{ background: accentColor }}
      />

      {/* Brand Logo Icon */}
      <div className="relative flex h-[50%] w-[50%] items-center justify-center">
        {logo ? (
          <img src={logo} alt={client} className="h-full w-full object-contain" />
        ) : client.toLowerCase().includes("rise") ? (
          <svg viewBox="0 0 64 64" className="h-full w-full text-white" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <ellipse
                key={i}
                cx="32"
                cy="16"
                rx="3.2"
                ry="9"
                fill="currentColor"
                transform={`rotate(${i * 60} 32 32)`}
              />
            ))}
            <circle cx="32" cy="32" r="3.2" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
            <path
              d="M8 30 L32 10 L56 30"
              fill="none"
              stroke="white"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M16 28 V52 H48 V28" fill="none" stroke="white" strokeWidth="2.4" />
            <path d="M28 52 V38 H36 V52" fill="none" stroke="white" strokeWidth="2.2" />
          </svg>
        )}
      </div>

      {/* Brand Title below mark */}
      <span className="relative mt-1 max-w-[88%] text-center font-display text-[clamp(0.48rem,0.85vw,0.65rem)] font-bold uppercase leading-tight tracking-[0.14em] text-white">
        {client.replace(" Developments", "")}
      </span>
      <span className="relative text-[9px] font-mono uppercase tracking-widest text-[#c4a574]">
        KV.2026
      </span>
    </div>
  );
}

export const Brand3DCard: React.FC<Brand3DCardProps> = ({
  client,
  projects,
  onOpenProject,
  index,
}) => {
  const pieces = extractPieces(projects);
  const primaryProject = projects[0] || {
    id: "temp",
    title: client,
    category: "Campaign Design",
    year: "2026",
    summary: "",
    tags: ["CAMPAIGN", "KEY VISUAL"],
    accentColor: "#c4a574",
  };

  const accentColor = primaryProject.accentColor || "#c4a574";
  const [hoveredPiece, setHoveredPiece] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 8), y: x * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredPiece(null);
  };

  const tags = Array.from(new Set(projects.flatMap((p) => p.tags || []))).slice(0, 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
      className="group relative flex flex-col rounded-3xl border border-white/10 bg-[#0a0a0c]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] hover:border-white/25 transition-all duration-300 overflow-visible"
    >
      {/* 1. 3D STAGE: BRAND LOGO IN CENTER & 3D FLOATING WORK AROUND IT */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden rounded-t-3xl bg-[#060608] cursor-pointer"
        style={{ perspective: "1100px" }}
        onClick={() => onOpenProject(primaryProject)}
      >
        {/* Ambient radial color glow behind pieces */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 opacity-60 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}33 0%, rgba(6,6,8,0.95) 75%)`,
          }}
        />

        {/* 3D Container with subtle dynamic tilt */}
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* FLOATING 3D PIECES (SURROUNDING THE LOGO) */}
          {pieces.map((piece, i) => {
            const slot = SLOTS[i] || SLOTS[0];
            const isHovered = hoveredPiece === i;

            return (
              <motion.button
                key={piece.src}
                type="button"
                onMouseEnter={() => {
                  sound.playHover();
                  setHoveredPiece(i);
                }}
                onMouseLeave={() => setHoveredPiece(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playWaterRipple();
                  onOpenProject(piece.project);
                }}
                style={{
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  transform: `translate(-50%, -50%) rotateZ(${
                    isHovered ? 0 : slot.rotateZ
                  }deg) rotateY(${isHovered ? 0 : slot.rotateY}deg) rotateX(${
                    isHovered ? 0 : slot.rotateX
                  }deg) scale(${isHovered ? 1.15 : 1})`,
                  zIndex: isHovered ? 40 : slot.z,
                  transformStyle: "preserve-3d",
                }}
                className="absolute aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl border border-white/30 bg-black shadow-[0_15px_30px_rgba(0,0,0,0.6)] outline-none transition-all duration-300 hover:border-white/70 hover:shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
                title={piece.project.title}
              >
                <img
                  src={piece.src}
                  alt={piece.project.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Subtle sheen layer */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20" />

                {/* Hover title preview tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-x-1 bottom-1.5 z-20 rounded-lg bg-black/85 px-1.5 py-1 text-center backdrop-blur-md border border-white/20"
                    >
                      <p className="truncate font-sans text-[10px] font-bold text-white">
                        {piece.project.title}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* THE BRAND LOGO IN THE CENTER */}
          <BrandLogoCenter
            client={client}
            logo={projects.find((p) => p.clientLogo)?.clientLogo}
            accentColor={accentColor}
          />
        </div>

        {/* Top Badges overlay inside 3D stage */}
        <div className="pointer-events-none absolute left-4 right-4 top-4 z-40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/20 bg-black/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-md">
              {primaryProject.year || "2026"}
            </span>
            <span className="rounded-full bg-red-600/80 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              {projects.length > 1 ? `${projects.length} Works` : primaryProject.category}
            </span>
          </div>

          <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-neutral-300 backdrop-blur-md">
            <Sparkles className="w-2.5 h-2.5 text-[#c4a574]" /> 3D Orbit
          </span>
        </div>
      </div>

      {/* 2. CARD INFO & MARKETING DETAILS (BELOW 3D STAGE) */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7 gap-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
              Brand & Real Estate KV
            </span>
            <span className="text-xs font-mono text-neutral-500">
              {projects.length} Selected Campaigns
            </span>
          </div>

          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-white group-hover:text-red-500 transition-colors">
            <ScrambleText text={client} />
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {projects.map((p) => p.title).join(" · ")}
          </p>
        </div>

        {/* Project Selector Pills (Direct Click to Specific Campaign) */}
        {projects.length > 1 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProject(p);
                }}
                className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white hover:text-black px-2.5 py-1 text-[10px] font-mono text-neutral-300 transition-all cursor-pointer"
              >
                <Eye className="w-2.5 h-2.5" />
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tags & Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onOpenProject(primaryProject)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
          >
            <span>Case Study</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
