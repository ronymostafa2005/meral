"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { sound } from '../utils/audio';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cappen_cookie_consent');
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    sound.playClick();
    localStorage.setItem('cappen_cookie_consent', 'accepted');
    setVisible(false);
    setModalOpen(false);
  };

  return (
    <>
      <button
        id="cookie-banner-trigger"
        onClick={() => setModalOpen(true)}
        className="hidden"
        aria-hidden="true"
      />

      <AnimatePresence>
        {visible && !modalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[90%] sm:w-auto bg-[#141414] border border-white/20 rounded-full px-5 py-2.5 shadow-2xl flex items-center justify-between gap-4 font-mono text-xs select-none"
          >
            <div className="flex items-center gap-2 text-neutral-200">
              <span>WE USE COOKIES — THE DIGITAL KIND</span>
              <span>🍪</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="text-neutral-400 hover:text-white underline text-[11px] cursor-pointer"
              >
                PREFERENCES
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold uppercase transition-colors cursor-pointer text-[11px] shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              >
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#121212] border border-white/20 rounded-2xl p-6 font-mono text-xs text-neutral-300 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-syne text-lg font-bold text-white uppercase">
                  COOKIE PREFERENCES 🍪
                </span>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-neutral-400 text-xs leading-relaxed">
                We use cookies and other technologies to improve your experience, measure performance, and analyze site metrics for portfolio exploration.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <div className="text-white font-medium">Essential Cookies</div>
                    <div className="text-[10px] text-neutral-400">Required for core studio rendering and audio</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Always On</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <div>
                    <div className="text-white font-medium">Analytics &amp; Performance</div>
                    <div className="text-[10px] text-neutral-400">Helps us refine interactive showcases</div>
                  </div>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-white/20 text-neutral-300 hover:text-white text-xs uppercase"
                >
                  DECLINE
                </button>
                <button
                  onClick={handleAccept}
                  className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs uppercase hover:bg-neutral-200 transition-colors"
                >
                  SAVE &amp; ACCEPT ALL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
