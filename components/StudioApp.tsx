"use client";

import React, { useState, useEffect } from 'react';
import { Preloader } from './Preloader';
import { Navbar } from './Navbar';
import { Hero3D } from './Hero3D';
import { SubHero } from './SubHero';
import { FeaturedWork } from './FeaturedWork';
import { ProjectDetailModal } from './ProjectDetailModal';
import { AboutSection } from './AboutSection';
import { AwardsSection } from './AwardsSection';
import { IdeaBot } from './IdeaBot';
import { Footer } from './Footer';
import { CookieConsent } from './CookieConsent';
import { WaterRippleCanvas } from './WaterRippleCanvas';
import { VerticalScrollTracker } from './VerticalScrollTracker';
import { Project } from '../types/portfolio';

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [waterActive, setWaterActive] = useState(true);

  useEffect(() => {
    // Check if ?autostart=1 is present
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('autostart') === '1') {
        setLoading(false);
      }
    }

    // Cursor position follower for ambient agency feel
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setCursorHovered(true);
      } else {
        setCursorHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const handleOpenProjectBot = () => {
    const el = document.getElementById('talk');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#ededed] font-sans overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* SVG Liquid Distortion Filter Definition */}
      <svg className="hidden" aria-hidden="true">
        <filter id="liquid-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.03"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Interactive Water Ripple Simulation Canvas */}
      {waterActive && <WaterRippleCanvas interactive={true} />}

      {/* Vertical Scroll Progress Tracker (Pinned on right) */}
      <VerticalScrollTracker />

      {/* Liquid Red & White Custom Cursor (hidden on touch) */}
      <div
        className={`hidden md:block fixed pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out border ${
          cursorHovered
            ? 'w-12 h-12 -ml-6 -mt-6 border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.7)] scale-125'
            : 'w-4 h-4 -ml-2 -mt-2 border-white/60 bg-red-600/40 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
        }`}
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
        }}
      >
        {cursorHovered && (
          <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-60" />
        )}
      </div>

      {/* Preloader Intro */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}

      {/* Navigation */}
      <Navbar onOpenProjectBot={handleOpenProjectBot} />

      {/* Main Content Sections */}
      <main className="relative">
        {/* Hero with 3D metallic centerpiece & artwork switcher */}
        <Hero3D />

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

      {/* Case Study Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}
