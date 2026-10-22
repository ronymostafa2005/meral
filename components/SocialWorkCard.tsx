"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Project } from "../types/portfolio";
import { sound } from "../utils/audio";

interface SocialWorkCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  index: number;
}

export const SocialWorkCard: React.FC<SocialWorkCardProps> = ({ project, onOpen, index }) => {
  // Gallery images combined (coverImage + galleryImages)
  const allImages = React.useMemo(() => {
    const list = [project.coverImage, ...(project.galleryImages || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [project.coverImage, project.galleryImages]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => 140 + ((index * 37 + 19) % 180));
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    sound.playClick();
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    } else {
      setIsLiked(false);
      setLikeCount((prev) => Math.max(1, prev - 1));
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
    setShowHeartPop(true);
    sound.playWaterRipple();
    setTimeout(() => setShowHeartPop(false), 900);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playWaterDrop();
    const url = typeof window !== "undefined" ? `${window.location.origin}#works` : "";
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${url} - ${project.title}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {}
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setIsSaved(!isSaved);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playHover();
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playHover();
    setActiveImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const clientHandle = project.client
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "");

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      className="group relative flex flex-col rounded-3xl border border-white/10 bg-[#0c0c0e]/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      {/* 1. SOCIAL HEADER */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-white/[0.07] bg-white/[0.015]">
        <div className="flex items-center gap-3">
          {/* Avatar with Instagram-style gradient story ring */}
          <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-red-600 via-[#c4a574] to-red-400">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111] overflow-hidden flex items-center justify-center border border-black">
              {project.clientLogo ? (
                <img
                  src={project.clientLogo}
                  alt={project.client}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-xs font-black tracking-wider text-white">
                  {project.client.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* User details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-bold text-xs sm:text-sm text-white tracking-tight">
                {clientHandle}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c4a574] fill-[#c4a574]/20" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 tracking-wider">
              {project.category} &bull; {project.year || "2026"}
            </span>
          </div>
        </div>

        {/* More Actions / Project Indicator */}
        <div className="flex items-center gap-2">
          {project.featured && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 font-mono text-[9px] uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            title="More details"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MEDIA FRAME (Social Post Canvas) */}
      <div
        className="relative aspect-[4/5] sm:aspect-[4/5] w-full overflow-hidden bg-[#070709] cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
        onClick={() => onOpen(project)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={allImages[activeImageIdx] || project.coverImage}
            src={allImages[activeImageIdx] || project.coverImage}
            alt={project.title}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </AnimatePresence>

        {/* Subtle gradient vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Carousel Multi-image Badge (e.g. 1/4) */}
        {allImages.length > 1 && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono">
            <Layers className="w-3 h-3 text-neutral-300" />
            <span>
              {activeImageIdx + 1}/{allImages.length}
            </span>
          </div>
        )}

        {/* Carousel Prev/Next Buttons (appear on card hover if multi-image) */}
        {allImages.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="pointer-events-auto p-1.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-sm transition-transform active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="pointer-events-auto p-1.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-sm transition-transform active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Double Click Heart Animation Pop */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 0.9] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
            >
              <div className="p-4 rounded-full bg-black/30 backdrop-blur-sm">
                <Heart className="w-20 h-20 text-red-500 fill-red-500 filter drop-shadow-[0_0_24px_rgba(239,68,68,0.8)]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Category Tag inside image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] uppercase tracking-wider">
            {project.client}
          </span>
        </div>
      </div>

      {/* 3. SOCIAL ACTION BAR */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 sm:px-5">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Like Heart */}
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Like"
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 active:scale-125 ${
                isLiked
                  ? "text-red-500 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  : "hover:text-red-400"
              }`}
            />
          </button>

          {/* Comment / Open Case Study */}
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Open comments and case study"
            title="View project case study"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-105 active:scale-95 transition-transform" />
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="relative text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Share project"
            title="Share project link"
          >
            <Send className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-105 active:scale-95 transition-transform" />
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-red-600 text-[9px] font-mono text-white shadow-lg">
                Copied!
              </span>
            )}
          </button>
        </div>

        {/* Right side: Bookmark & Case Study CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Save project"
          >
            <Bookmark
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                isSaved ? "text-[#c4a574] fill-[#c4a574]" : "hover:text-white"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => onOpen(project)}
            className="flex items-center gap-1 px-3 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white text-neutral-300 hover:text-black font-mono text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            <span>View Case</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4. SOCIAL CAPTION & ENGAGEMENT */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-2 text-xs sm:text-sm">
        {/* Likes Count */}
        <p className="font-semibold text-neutral-200 text-xs">
          Liked by <span className="text-white font-bold">{project.client}</span> and{" "}
          <span className="text-white font-bold">{likeCount.toLocaleString()} others</span>
        </p>

        {/* Post Caption: Title & Headline */}
        <div className="text-neutral-300 leading-relaxed">
          <span className="font-bold text-white mr-1.5 font-display tracking-wide">
            {project.title}
          </span>
          <span className="text-neutral-400 font-light">
            {project.headline || project.summary || "Creative direction & visual identity."}
          </span>
        </div>

        {/* Hashtags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-[11px] font-mono text-[#c4a574] hover:text-white transition-colors"
              >
                #{tag.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        )}

        {/* View Details Prompt */}
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="block pt-1 text-[11px] font-mono text-neutral-500 hover:text-red-400 transition-colors text-left"
        >
          View all deliverables & project overview &rarr;
        </button>
      </div>
    </motion.article>
  );
};
