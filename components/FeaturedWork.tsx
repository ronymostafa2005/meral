"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, LayoutGrid, List, Search } from 'lucide-react';
import { Project } from '../types/portfolio';
import { filterProjects } from '../utils/logic';
import { sound } from '../utils/audio';
import { LiquidWaveText } from './LiquidWaveText';
import { ScrambleText } from './ScrambleText';
import { Brand3DCard } from './Brand3DCard';
import { useSite } from './SiteProvider';

interface FeaturedWorkProps {
  onSelectProject: (project: Project) => void;
}

function groupByClient(projects: Project[]) {
  const order: string[] = [];
  const groups = new Map<string, Project[]>();
  for (const project of projects) {
    const existing = groups.get(project.client);
    if (existing) {
      existing.push(project);
    } else {
      groups.set(project.client, [project]);
      order.push(project.client);
    }
  }
  return order.map((client) => ({ client, projects: groups.get(client) ?? [] }));
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({ onSelectProject }) => {
  const { content } = useSite();
  const works = content.works;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', ...Array.from(new Set(works.projects.map((project) => project.category).filter(Boolean)))];
  const filteredProjects = filterProjects(works.projects, selectedCategory, searchQuery);
  const clientGroups = groupByClient(filteredProjects);

  const handleCategoryChange = (cat: string) => {
    sound.playWaterDrop();
    setSelectedCategory(cat);
  };

  const handleOpenProject = (project: Project) => {
    sound.playWaterRipple();
    onSelectProject(project);
  };

  return (
    <section id="works" className="relative w-full py-12 sm:py-16 px-4 sm:px-8 border-b border-white/10 bg-[#050505]/55">
      {/* Background ambient crimson light */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:gap-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs tracking-widest text-red-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{works.kicker}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold uppercase tracking-tight text-white leading-none">
              <LiquidWaveText text={works.titleA} className="hover:text-red-500" />{' '}
              <span className="text-white hover:text-red-400 transition-colors">
                <LiquidWaveText text={works.titleB} />
              </span>
            </h2>
          </div>

          <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-light leading-relaxed">
            {works.intro}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
          {/* Categories Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                onMouseEnter={() => sound.playHover()}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-black border border-white font-bold'
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
                  viewMode === 'grid' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
                title="3D Brand Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setViewMode('list');
                }}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
                title="List Layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display: 3D Brand Cards Grid or List */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center font-mono text-neutral-500 text-sm">
            No projects found matching &ldquo;{searchQuery}&rdquo;. Try another search or filter.
          </div>
        ) : viewMode === 'grid' ? (
          /* 3D Brand Cards Grid with Central Logo and Orbiting Artwork */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <AnimatePresence>
              {clientGroups.map((group, idx) => (
                <Brand3DCard
                  key={group.client}
                  client={group.client}
                  projects={group.projects}
                  onOpenProject={handleOpenProject}
                  index={idx}
                />
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
