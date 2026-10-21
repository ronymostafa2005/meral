"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, LayoutGrid, List, Search, Award, Sparkles, Droplets, Eye } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project, ProjectCategory } from '../types/portfolio';
import { filterProjects } from '../utils/logic';
import { sound } from '../utils/audio';
import { LiquidWaveText } from './LiquidWaveText';
import { ScrambleText } from './ScrambleText';

interface FeaturedWorkProps {
  onSelectProject: (project: Project) => void;
}

const CATEGORIES: ProjectCategory[] = [
  'All',
  'Campaign Design',
  'Brand Voice'
];

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProjects = filterProjects(PROJECTS, selectedCategory, searchQuery);

  const handleCategoryChange = (cat: ProjectCategory) => {
    sound.playWaterDrop();
    setSelectedCategory(cat);
  };

  const handleOpenProject = (project: Project) => {
    sound.playWaterRipple();
    onSelectProject(project);
  };

  return (
    <section id="works" className="relative w-full py-24 sm:py-32 px-4 sm:px-8 border-b border-white/10 bg-[#050505]/55">
      {/* Background ambient crimson light */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3 font-mono text-xs tracking-widest text-red-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>02 &bull; SELECTED WORK &bull; MERAL</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold uppercase tracking-tight text-white leading-none">
              <LiquidWaveText text="FEATURED" className="hover:text-red-500" />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-neutral-400">
                <LiquidWaveText text="PROJECTS" />
              </span>
            </h2>
          </div>

          <p className="text-neutral-400 text-sm sm:text-base max-w-md font-light leading-relaxed">
            Campaigns and brand pieces for Lux Realty and Rise Tower Developments. Only Meral’s work.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
          {/* Categories Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                onMouseEnter={() => sound.playHover()}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-[0_0_16px_rgba(239,68,68,0.7)] border border-red-400 font-bold'
                    : 'bg-[#111111] text-neutral-400 hover:text-white border border-white/10 hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Layout Toggles */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111111] border border-white/15 focus:border-red-500 rounded-full pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                >
                  &times;
                </button>
              )}
            </div>

            {/* View Mode Grid/List */}
            <div className="flex items-center p-1 rounded-full bg-[#111111] border border-white/10">
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('grid');
                }}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Grid Layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('list');
                }}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="List Layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display: Grid or List */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center font-mono text-neutral-500 text-sm">
            No projects found matching &ldquo;{searchQuery}&rdquo;. Try another search or filter.
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View with Vertical Stagger and Hover Parallax */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: (idx % 2) * 0.15 }}
                  onClick={() => handleOpenProject(project)}
                  className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#0c0c0c] border border-white/10 hover:border-red-500/60 shadow-[0_4px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_35px_rgba(239,68,68,0.25)] transition-all duration-500 cursor-pointer"
                >
                  {/* Image Canvas with Water Ripple Overlay */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 group-hover:filter group-hover:brightness-110 transition-all duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Gradient Overlay (Dark Obsidian to Crimson Twilight) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-black/30 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white tracking-widest uppercase">
                          {project.year}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-red-600/80 backdrop-blur-md text-[10px] font-mono text-white tracking-wider uppercase font-semibold">
                          {project.category}
                        </span>
                      </div>

                      {project.awards && project.awards.length > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-red-500/40 text-[10px] font-mono text-red-400">
                          <Award className="w-3 h-3 text-red-400" />
                          <span>{project.awards[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Hover Quick Action Pill */}
                    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-[0_0_20px_rgba(239,68,68,0.8)] transition-all duration-300">
                      <Eye className="w-3.5 h-3.5" />
                      <span>CASE STUDY</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
                        {project.client}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1 group-hover:text-red-500 transition-colors">
                        <ScrambleText text={project.title} />
                      </h3>
                      <p className="mt-2 text-neutral-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {project.headline}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                      {project.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 tracking-wider"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* List View with Full Horizontal Row */
          <div className="flex flex-col divide-y divide-white/10">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project)}
                className="group py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-red-950/15 px-4 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-xs text-red-500 font-bold">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white group-hover:text-red-500 transition-colors">
                      <ScrambleText text={project.title} />
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono tracking-wider mt-1">
                      {project.client} &bull; {project.category} &bull; {project.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-white/5">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="w-10 h-10 rounded-full border border-white/20 group-hover:border-red-500 group-hover:bg-red-600 flex items-center justify-center text-white transition-all shadow-md">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
