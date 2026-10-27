"use client";

import React, { useState, useEffect } from 'react';
import { Preloader } from './Preloader';
import { Navbar } from './Navbar';
import { HeroFolioblox } from './HeroFolioblox';
import { SubHero } from './SubHero';
import { FeaturedWork } from './FeaturedWork';
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
  const { content, owner } = useSite();

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
      {/* Navbar is embedded inside HeroFolioblox */}

      {/* Main Content Sections */}
      <main className="relative z-[1]">
        {/* Hero with portrait and program fan */}
        <HeroFolioblox />

        {/* SubHero with Manifesto & Studio Metrics */}
        <SubHero />

        {/* Featured Work with Filters, Grid/List & Case Studies */}
        <FeaturedWork onSelectProject={(project) => setSelectedProject(project)} />

        {/* About Studio, Capabilities & Client Marquee */}
        <AboutSection />

        {/* Awards & Recognition Gallery */}
        <AwardsSection />

        {/* "LET'S TALK IDEAS" Interactive Cappen & Kivo Bot */}
        <IdeaBot />
      </main>

      {/* Footer */}
      <Footer />

      {owner && (
        <a
          href="/dashboard"
          className="fixed bottom-5 left-5 z-40 rounded-full border border-white/20 bg-black/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur"
        >
          Edit portfolio
        </a>
      )}

      {/* Case Study Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(project) => setSelectedProject(project)}
      />

    </div>
  );
}
