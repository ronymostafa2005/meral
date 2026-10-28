"use client";

import React, { useState, useEffect } from 'react';
import { Preloader } from './Preloader';
import { Navbar } from './Navbar';
import { HeroStage } from './HeroStage';
import { ToolStage } from './ToolStage';
import { SubHero } from './SubHero';
import { FeaturedWork } from './FeaturedWork';
import { ProjectArchive } from './ProjectArchive';
import { ProjectDetailModal } from './ProjectDetailModal';
import { AboutSection } from './AboutSection';
import { AwardsSection } from './AwardsSection';
import { IdeaBot } from './IdeaBot';
import { Footer } from './Footer';
import { VerticalScrollTracker } from './VerticalScrollTracker';
import { Project } from '../types/portfolio';
import { useSite } from './SiteProvider';

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { content } = useSite();

  useEffect(() => {
    // Check if ?autostart=1 is present
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autostart') === '1') {
        setLoading(false);
      }
    }

  }, []);

  const handleOpenProjectBot = () => {
    const el = document.getElementById('talk');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans selection:bg-[#c4a574] selection:text-black"
      style={{ backgroundColor: content.brand.background, color: content.brand.text }}
    >
      {/* Vertical Scroll Progress Tracker (Pinned on right) */}
      <VerticalScrollTracker />

      {/* Preloader Intro */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Navigation */}
      <Navbar onOpenProjectBot={handleOpenProjectBot} />

      {/* Main Content Sections */}
      <main className="relative z-[1]">
        {/* Hero card — carries its own navigation; the fixed header above
            stays hidden until the visitor scrolls past it. */}
        <HeroStage onOpenProjectBot={handleOpenProjectBot} />

        {/* The design-tool fan. It used to live inside the old hero, so it
            sits here in its own right now that the hero has been replaced. */}
        <ToolStage />

        {/* SubHero with Manifesto & Studio Metrics */}
        <SubHero />

        {/* Featured Work with Filters, Grid/List & Case Studies */}
        <FeaturedWork onSelectProject={(project) => setSelectedProject(project)} />

        {/* The rest of the archive, paged, directly under the featured work */}
        <ProjectArchive />

        {/* About Studio, Capabilities & Client Marquee */}
        <AboutSection />

        {/* Awards & Recognition Gallery */}
        <AwardsSection />

        {/* "LET'S TALK IDEAS" Interactive Cappen & Kivo Bot */}
        <IdeaBot />
      </main>

      {/* Footer */}
      <Footer />

      {/* Case Study Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(project) => setSelectedProject(project)}
      />

    </div>
  );
}
