"use client";

import React, { useEffect, useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { sound } from '../utils/audio';
import { getFormattedStudioTime } from '../utils/logic';
import { ScrambleText } from './ScrambleText';
import { MeralLogo } from './MeralLogo';
import { useSite } from './SiteProvider';

interface NavbarProps {
  onOpenProjectBot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProjectBot }) => {
  const { content } = useSite();
  const nav = content.nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localTime, setLocalTime] = useState('--:--');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<'works' | 'about' | 'awards' | 'talk'>('works');

  useEffect(() => {
    const updateTimes = () => {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setLocalTime(getFormattedStudioTime(zone));
    };
    updateTimes();
    const timer = setInterval(updateTimes, 15000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['works', 'about', 'awards', 'talk'] as const;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (id: string) => {
    sound.playWaterDrop();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/10 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              sound.playWaterRipple();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2"
            aria-label="Studio Homepage"
          >
            <MeralLogo wordClassName="text-lg sm:text-xl" markClassName="h-7 w-7" />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase">
            <button
              onClick={() => scrollTo('works')}
              onMouseEnter={() => sound.playHover()}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${
                activeSection === 'works' ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full border transition-all ${
                  activeSection === 'works'
                    ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                    : 'bg-transparent border-neutral-600'
                }`}
              />
              <ScrambleText text={nav.works} />
            </button>

            <button
              onClick={() => scrollTo('about')}
              onMouseEnter={() => sound.playHover()}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${
                activeSection === 'about' ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full border transition-all ${
                  activeSection === 'about'
                    ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                    : 'bg-transparent border-neutral-600'
                }`}
              />
              <ScrambleText text={nav.about} />
            </button>

            <button
              onClick={() => scrollTo('awards')}
              onMouseEnter={() => sound.playHover()}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${
                activeSection === 'awards' ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full border transition-all ${
                  activeSection === 'awards'
                    ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                    : 'bg-transparent border-neutral-600'
                }`}
              />
              <ScrambleText text={nav.awards} />
            </button>

            <button
              onClick={() => {
                sound.playWaterDrop();
                onOpenProjectBot();
              }}
              onMouseEnter={() => sound.playHover()}
              className={`flex items-center gap-2 transition-colors cursor-pointer ${
                activeSection === 'talk' ? 'text-red-400 font-bold' : 'text-neutral-400 hover:text-red-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full border transition-all ${
                  activeSection === 'talk'
                    ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                    : 'bg-transparent border-neutral-600'
                }`}
              />
              <ScrambleText text={nav.talk} />
            </button>
          </nav>

          {/* Right Header Extras: Studio Clocks & Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Clocks (Desktop) */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono text-neutral-400 tracking-wider">
              <div className="flex items-center gap-1.5" title="Local time">
                <Globe className="w-3 h-3 text-red-500" />
                <span>LOCAL {localTime}</span>
              </div>
            </div>

            {/* Talk to Us Button (CTA) */}
            <button
              onClick={() => {
                sound.playWaterDrop();
                onOpenProjectBot();
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black text-xs font-mono tracking-wider font-semibold transition-colors hover:bg-[#c4a574] cursor-pointer"
            >
              <span>{nav.cta}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 text-white hover:text-red-400 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#050505]/98 backdrop-blur-xl md:hidden flex flex-col justify-between p-8 pt-28">
          <nav className="flex flex-col gap-6 text-2xl font-display uppercase tracking-tight">
            <button
              onClick={() => scrollTo('works')}
              className="text-left text-white hover:text-red-500 transition-colors flex items-center justify-between"
            >
              <span>{nav.mobileWorks}</span>
              <span className="text-xs font-mono text-red-500">01</span>
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-left text-white hover:text-red-500 transition-colors flex items-center justify-between"
            >
              <span>{nav.mobileAbout}</span>
              <span className="text-xs font-mono text-red-500">02</span>
            </button>
            <button
              onClick={() => scrollTo('awards')}
              className="text-left text-white hover:text-red-500 transition-colors flex items-center justify-between"
            >
              <span>{nav.mobileAwards}</span>
              <span className="text-xs font-mono text-red-500">03</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProjectBot();
              }}
              className="text-left text-red-500 font-bold flex items-center justify-between"
            >
              <span>{nav.mobileTalk}</span>
              <span className="text-xs font-mono text-white">04</span>
            </button>
          </nav>

          <div className="border-t border-white/10 pt-6 font-mono text-xs text-neutral-400 flex flex-col gap-2">
            <div className="flex justify-between">
              <span>LOCAL {localTime}</span>
            </div>
            <p className="text-neutral-500 mt-2">{content.brand.logoWord} &bull; GRAPHIC DESIGN</p>
          </div>
        </div>
      )}
    </>
  );
};
