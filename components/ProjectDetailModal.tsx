"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowRight, Award, CheckCircle2, Droplets } from 'lucide-react';
import { Project } from '../types/portfolio';
import { sound } from '../utils/audio';
import { PROJECTS } from '../data/portfolioData';
import { ScrambleText } from './ScrambleText';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playWaterDrop();
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-black/92 backdrop-blur-xl flex justify-center p-0 sm:p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} Case Study`}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#090909] border border-red-500/30 rounded-none sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col my-auto"
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-[#090909]/95 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-semibold">
                CASE STUDY &bull; {project.year}
              </span>
              <span className="text-neutral-600">&bull;</span>
              <span className="text-xs font-mono text-white font-medium">{project.client}</span>
            </div>

            <button
              onClick={() => {
                sound.playWaterDrop();
                onClose();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
              aria-label="Close case study dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 sm:p-12 space-y-12">
            {/* Title & Headline */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-red-600/30 border border-red-500/50 text-red-300 uppercase">
                  {project.category}
                </span>
                {project.awards?.map((award) => (
                  <span
                    key={award}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-white border border-white/20"
                  >
                    <Award className="w-3.5 h-3.5 text-red-500" />
                    {award}
                  </span>
                ))}
              </div>

              <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
                {project.title}
              </h2>
              <p className="mt-4 text-xl sm:text-2xl text-neutral-300 font-light leading-relaxed">
                {project.headline}
              </p>
            </div>

            {/* Hero Cover Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-white/15 bg-black shadow-2xl">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.liveUrl && (
                <div className="absolute bottom-4 right-4 z-10">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-[0_0_20px_rgba(239,68,68,0.7)] transition-all cursor-pointer"
                  >
                    <span>VISIT LIVE PLATFORM</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/10 text-xs font-mono">
              <div>
                <span className="text-neutral-500 block mb-1">CLIENT</span>
                <span className="text-white text-sm font-semibold">{project.client}</span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-1">YEAR</span>
                <span className="text-red-400 text-sm font-semibold">{project.year}</span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-1">SERVICES</span>
                <span className="text-white text-sm">{project.role.join(', ')}</span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-1">CATEGORY</span>
                <span className="text-white text-sm">{project.category}</span>
              </div>
            </div>

            {/* Project Deep Dive (Overview, Challenge, Solution) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">The Challenge</h3>
                <p className="text-neutral-300 text-base leading-relaxed font-light">
                  {project.challenge}
                </p>

                <h3 className="font-display text-2xl font-bold text-white mt-8 mb-3">Our Approach &amp; Solution</h3>
                <p className="text-neutral-300 text-base leading-relaxed font-light">
                  {project.solution}
                </p>
              </div>

              <div className="bg-[#111111] p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-500 font-bold mb-4">
                    <Droplets className="w-3.5 h-3.5 text-red-500" />
                    <span>// MEASURABLE IMPACT</span>
                  </div>
                  <ul className="space-y-4">
                    {project.results.map((result) => (
                      <li key={result} className="flex items-start gap-3 text-neutral-200 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-xs font-mono uppercase text-neutral-400 mb-2">TAGS &amp; ARCHITECTURE</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-full bg-black border border-white/10 text-[10px] font-mono text-neutral-300 uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            {project.galleryImages.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-display text-2xl font-bold text-white">Visual Artifacts &amp; Design System</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.galleryImages.map((imgUrl, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-[4/3] group relative">
                      <img src={imgUrl} alt={`${project.title} asset ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Project Footer Switcher */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-neutral-400">NEXT CASE STUDY</span>
              <button
                onClick={() => {
                  sound.playWaterDrop();
                  onSelectProject(nextProject);
                }}
                className="group flex items-center gap-3 text-white hover:text-red-400 font-display text-xl sm:text-2xl font-bold transition-colors cursor-pointer"
              >
                <span>{nextProject.title}</span>
                <ArrowRight className="w-5 h-5 text-red-500 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
