"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, CornerDownLeft, Sparkles, Check, ArrowRight, RotateCcw, Droplets } from 'lucide-react';
import { BotFormData } from '../types/portfolio';
import { calculateProjectEstimate, validateStep } from '../utils/logic';
import { sound } from '../utils/audio';
import { LiquidWaveText } from './LiquidWaveText';
import { ScrambleText } from './ScrambleText';

const PROJECT_TYPES = [
  'Campaign Key Visual',
  'Brand Voice & Identity',
  'Art Direction',
  'Print & Editorial',
  'Social Campaign Set',
  'Real Estate Launch'
];

const BUDGET_RANGES = [
  'Up to $15k',
  '$15k to $35k',
  '$35k to $75k',
  '$75k to $150k',
  'Over $150k'
];

export const IdeaBot: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<BotFormData>({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    note: ''
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleNextStep = () => {
    setErrorMsg('');
    if (currentStep === 0) {
      sound.playWaterDrop();
      setCurrentStep(1);
      return;
    }

    const val = validateStep(currentStep, formData);
    if (!val.isValid) {
      setErrorMsg(val.error || 'Please fill in this step');
      sound.playBlip(220, 0.1);
      return;
    }

    sound.playWaterDrop();
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNextStep();
    }
  };

  const handleSubmit = () => {
    const val = validateStep(5, formData);
    if (!val.isValid) {
      setErrorMsg(val.error || 'Please verify form inputs');
      return;
    }

    setIsSubmitting(true);
    sound.playWaterRipple();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      sound.playSuccess();
    }, 1200);
  };

  const handleReset = () => {
    sound.playWaterDrop();
    setFormData({
      name: '',
      email: '',
      projectType: '',
      budget: '',
      note: ''
    });
    setCurrentStep(0);
    setIsSubmitted(false);
    setErrorMsg('');
  };

  const estimate = calculateProjectEstimate(formData.projectType, formData.budget);

  return (
    <section id="talk" className="relative w-full py-28 px-4 sm:px-8 border-b border-white/10 bg-[#050505]/55 scroll-mt-20">
      {/* Background ambient crimson glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-80 bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-950/20 text-xs font-mono uppercase text-red-400 mb-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>05 &bull; PROJECT INQUIRY &bull; MERAL</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase">
            <LiquidWaveText text="LET’S TALK" className="hover:text-red-500" />{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-white to-red-400">
              <LiquidWaveText text="IDEAS" />
            </span>
          </h2>
          <p className="text-neutral-400 font-mono text-xs sm:text-sm mt-3">
            A short brief is enough. Meral reviews campaign, brand, and print inquiries directly.
          </p>
        </div>

        {/* Terminal Bot Interface Box */}
        <div className="relative bg-[#0c0c0c] border border-white/15 hover:border-red-500/40 rounded-3xl overflow-hidden shadow-2xl transition-colors">
          {/* Terminal Window Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/90 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="w-3 h-3 rounded-full bg-neutral-600" />
              <span className="w-3 h-3 rounded-full bg-neutral-600" />
              <span className="ml-3 text-xs font-mono text-neutral-400">meral-inquiry</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-semibold">LIVE STUDIO DISPATCH</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 sm:p-10 font-mono">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto text-3xl shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                  ⚡
                </div>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                    Brief Transmitted, {formData.name || 'Visionary'}!
                  </h3>
                  <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                    The brief for <span className="text-white font-medium">{formData.projectType || 'your project'}</span> is noted. Meral will reply at <span className="text-red-400 font-medium">{formData.email}</span>.
                  </p>
                </div>

                {/* Estimate Summary Card */}
                <div className="max-w-md mx-auto bg-neutral-950 border border-red-500/20 rounded-2xl p-5 text-left text-xs space-y-2.5">
                  <div className="text-red-500 uppercase tracking-widest font-bold">// INSTANT SCOPE PROJECTION</div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Project Focus:</span>
                    <span className="text-white font-semibold">{formData.projectType || 'Digital Experience'}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Estimated Timeline:</span>
                    <span className="text-red-400 font-semibold">{estimate.timeline}</span>
                  </div>
                  <div className="flex justify-between text-neutral-300">
                    <span>Core Staffing:</span>
                    <span className="text-white">{estimate.recommendedTeam.join(' &bull; ')}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white text-xs uppercase font-bold transition-all shadow-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Inquiry</span>
                </button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Step 0: Welcome Bot intro */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0 text-red-500">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
                      Hello. This is Meral’s inquiry desk. Share the project, the timeline, and what the campaign needs to say. You’ll get a plain scope note back on this page.
                    </p>
                    {currentStep === 0 && (
                      <div className="pt-2">
                        <button
                          onClick={handleNextStep}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] group cursor-pointer"
                        >
                          <span>Shall we get started? Hit Enter</span>
                          <CornerDownLeft className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 1: Name */}
                {currentStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 pl-12"
                  >
                    <label htmlFor="bot-name" className="text-xs text-neutral-400">
                      01 / Hi, my name is:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="bot-name"
                        type="text"
                        autoFocus={currentStep === 1}
                        disabled={currentStep > 1}
                        placeholder="Type your name or company..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-md bg-transparent border-b border-white/30 focus:border-red-500 text-base text-white py-1 focus:outline-none transition-colors disabled:opacity-70 disabled:border-transparent"
                      />
                      {currentStep === 1 && (
                        <button
                          onClick={handleNextStep}
                          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-bold rounded-full transition-colors cursor-pointer shadow-md"
                        >
                          Next &rarr;
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Email */}
                {currentStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 pl-12"
                  >
                    <label htmlFor="bot-email" className="text-xs text-neutral-400">
                      02 / You can reach me at:
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="bot-email"
                        type="email"
                        autoFocus={currentStep === 2}
                        disabled={currentStep > 2}
                        placeholder="yourname@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-md bg-transparent border-b border-white/30 focus:border-red-500 text-base text-white py-1 focus:outline-none transition-colors disabled:opacity-70 disabled:border-transparent"
                      />
                      {currentStep === 2 && (
                        <button
                          onClick={handleNextStep}
                          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs uppercase font-bold rounded-full transition-colors cursor-pointer shadow-md"
                        >
                          Next &rarr;
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Project Type */}
                {currentStep >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 pl-12"
                  >
                    <div className="text-xs text-neutral-400">
                      03 / We’re looking to create:
                    </div>
                    <div className="flex flex-wrap gap-2 max-w-2xl">
                      {PROJECT_TYPES.map((type) => (
                        <button
                          key={type}
                          disabled={currentStep > 3}
                          onClick={() => {
                            sound.playWaterDrop();
                            setFormData({ ...formData, projectType: type });
                            if (currentStep === 3) {
                              setTimeout(() => setCurrentStep(4), 200);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                            formData.projectType === type
                              ? 'bg-red-600 text-white font-bold shadow-[0_0_12px_rgba(239,68,68,0.7)] border border-red-400'
                              : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:border-red-500/40'
                          } disabled:cursor-default`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Budget */}
                {currentStep >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 pl-12"
                  >
                    <div className="text-xs text-neutral-400">
                      04 / Our anticipated budget investment is:
                    </div>
                    <div className="flex flex-wrap gap-2 max-w-xl">
                      {BUDGET_RANGES.map((b) => (
                        <button
                          key={b}
                          disabled={currentStep > 4}
                          onClick={() => {
                            sound.playWaterDrop();
                            setFormData({ ...formData, budget: b });
                            if (currentStep === 4) {
                              setTimeout(() => setCurrentStep(5), 200);
                            }
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                            formData.budget === b
                              ? 'bg-red-600 text-white font-bold shadow-[0_0_12px_rgba(239,68,68,0.7)] border border-red-400'
                              : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10 hover:border-red-500/40'
                          } disabled:cursor-default`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Notes & Final Submit */}
                {currentStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 pl-12"
                  >
                    <label htmlFor="bot-note" className="text-xs text-neutral-400">
                      05 / Additional details or launch goals (optional):
                    </label>
                    <textarea
                      id="bot-note"
                      rows={3}
                      placeholder="Tell us about your brand, deadline, or dream vision..."
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      className="w-full max-w-xl bg-neutral-900 border border-white/10 rounded-2xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                    />

                    {/* Estimate preview box */}
                    <div className="p-4 bg-gradient-to-r from-red-950/30 to-neutral-950 border border-red-500/20 rounded-2xl text-xs space-y-1.5 max-w-xl text-neutral-300">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-red-500" />
                        <span>Instant Scope Projection</span>
                      </div>
                      <div>Estimated cycle: <span className="text-red-400 font-semibold">{estimate.timeline}</span></div>
                      <div>Key staffing: <span className="text-white">{estimate.recommendedTeam.join(' &bull; ')}</span></div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.6)] cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>TRANSMITTING BRIEF...</span>
                        ) : (
                          <>
                            <span>SEND REQUEST</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Error message display */}
                {errorMsg && (
                  <div className="pl-12 text-xs font-mono text-red-400">
                    ! {errorMsg}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
