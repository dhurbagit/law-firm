'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Gavel, 
  Scale, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Award
} from 'lucide-react';

export function CourtroomHero() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [strikeActive, setStrikeActive] = useState(false);
  const [strikeText, setStrikeText] = useState<string | null>(null);

  // Web Audio Synth Gavel Impact Sound
  const playGavelSound = useCallback((pitch = 145) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(1.0, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio context restricted until user gesture
    }
  }, [soundEnabled]);

  // Handle Interactive Gavel Strike ("Order! Order!")
  const handleGavelStrike = () => {
    if (strikeActive) return;
    setStrikeActive(true);
    playGavelSound(155);
    setStrikeText('ORDER IN THE COURT!');

    setTimeout(() => {
      playGavelSound(145);
      setStrikeText('ORDER!');
    }, 450);

    setTimeout(() => {
      playGavelSound(135);
      setStrikeText('ORDER!');
    }, 900);

    setTimeout(() => {
      setStrikeActive(false);
      setStrikeText(null);
    }, 2200);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#001F54] text-white border-b border-sakura-border font-sans">
      
      {/* 1. FULL BACKGROUND IMAGE WITH CINEMATIC KEN-BURNS ANIMATION */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            x: [0, -8, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/courtroom_hero.jpg"
            alt="Apex Legal Courtroom Bench and Judicial Chambers"
            fill
            priority
            className="object-cover object-center filter saturate-[1.1] contrast-[1.15]"
          />
        </motion.div>

        {/* Cinematic Multi-Layered Overlays (Navy, Nepal Flag Tones & Vignette for Perfect Text Contrast) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001F54]/95 via-[#001F54]/85 to-[#001F54]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001F54] via-transparent to-[#001F54]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#00153B_80%)] opacity-70" />

        {/* Ambient Courtroom Light Beams */}
        <div className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-b from-white/5 to-transparent blur-3xl transform -skew-x-12 pointer-events-none" />
      </div>

      {/* 2. FOREGROUND CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Authoritative Copy & Direct Legal CTAs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* National Counsel Authority Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0A2540]/90 border border-sakura-border text-xs font-bold text-white tracking-wide shadow-xl backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-crimson" />
              <span>Nationwide Trial Litigators & Supreme Court Counsel</span>
              <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-ping" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]"
            >
              Commanding The Courtroom. <br />
              <span className="text-crimson">Decisive Landmark Results.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal"
            >
              When high-stakes corporate disputes arise or catastrophic injury demands justice, Apex Legal Counsel commands the courtroom and negotiating table with unwavering precision.
            </motion.p>

            {/* Conversion CTA Group */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                href="#case-evaluation"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-crimson hover:bg-crimson-hover border border-white/20 shadow-2xl shadow-crimson/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Request Free Case Evaluation</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                href="/case-results"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#0A2540]/80 hover:bg-[#003893] border border-sakura-border backdrop-blur-md transition shadow-lg"
              >
                <span>Explore $250M+ In Verdicts</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-sakura-border/30 text-xs text-slate-200"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-crimson" />
                <span className="font-bold text-white">Zero Fee Unless We Win</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-crimson" />
                <span className="font-bold text-white">24/7 Confidential Intake</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-crimson" />
                <span className="font-bold text-white">Former Federal Prosecutors</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Floating Court & Order Judicial Crest with Balancing Scales */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-sm rounded-3xl bg-[#0A2540]/90 border border-sakura-border p-6 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden"
            >
              
              {/* Subtle Judicial Gold Header Ribbon */}
              <div className="flex items-center justify-between border-b border-sakura-border/40 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-crimson animate-pulse" />
                  <span className="font-serif font-bold text-white text-sm">Courtroom Authority</span>
                </div>
                
                {/* Audio Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#001F54] border border-sakura-border text-[11px] font-bold text-white hover:text-crimson transition cursor-pointer"
                  title={soundEnabled ? 'Mute gavel sound' : 'Enable gavel sound on strike'}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-crimson" />
                      <span>Sound ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>Sound OFF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dynamic Animated Scales of Justice with Gentle Law Equilibrium Sway */}
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <motion.div
                  animate={{
                    rotate: strikeActive ? [-15, 15, -8, 8, 0] : [-3, 3, -3],
                  }}
                  transition={{
                    duration: strikeActive ? 1.2 : 6,
                    repeat: strikeActive ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#003893] to-[#001F54] border border-sakura-border flex items-center justify-center shadow-lg text-white"
                >
                  <Scale className="w-9 h-9 text-white" />
                </motion.div>

                <div className="text-center space-y-1">
                  <span className="block font-serif text-lg font-bold text-white">
                    Fiat Justitia Ruat Caelum
                  </span>
                  <span className="block text-[11px] font-bold text-crimson uppercase tracking-widest">
                    Let Justice Be Done
                  </span>
                </div>
              </div>

              {/* Interactive "Order, Order" Gavel Strike Trigger */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGavelStrike}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-hover hover:from-crimson-hover hover:to-crimson text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-crimson/30 transition transform active:scale-95 cursor-pointer border border-white/20"
                >
                  <Gavel className={`w-4 h-4 text-white transition-transform ${strikeActive ? '-rotate-45' : ''}`} />
                  <span>{strikeActive ? 'Calling Court to Order...' : 'Strike Courtroom Gavel'}</span>
                </button>

                {/* Animated "ORDER!" Speech Banner */}
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {strikeText && (
                      <motion.div
                        key={strikeText}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="inline-flex items-center gap-1.5 text-xs font-serif font-extrabold text-crimson tracking-widest uppercase"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-crimson" />
                        <span>{strikeText}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Verified Firm Record Ticker */}
              <div className="pt-3 border-t border-sakura-border/40 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-crimson" />
                  <span>Recoveries: <strong className="text-white">$250M+</strong></span>
                </div>
                <div className="font-semibold text-white">
                  Success: <span className="font-bold text-crimson">98.6%</span>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </div>

    </section>
  );
}
