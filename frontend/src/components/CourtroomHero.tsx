'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Gavel as GavelIcon
} from 'lucide-react';

const courtroomBackgrounds = [
  {
    title: 'Supreme Appellate Chamber',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Federal Trial Bench',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
  },
  {
    title: 'Historic Chambers of Justice',
    url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1600',
  },
];

export function CourtroomHero() {
  const [bgIndex, setBgIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);
  const [strikePhase, setStrikePhase] = useState<'idle' | 'raising' | 'strike1' | 'strike2' | 'strike3'>('idle');
  const [isStriking, setIsStriking] = useState(false);
  const [shockwaves, setShockwaves] = useState<number[]>([]);

  // Rotate courtroom backgrounds smoothly every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % courtroomBackgrounds.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio Synth Gavel Sound Generator
  const playGavelSound = useCallback((pitch = 140) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Sharp wooden impact transient
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(1.0, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Audio context may be restricted before user interaction
    }
  }, [soundEnabled]);

  const triggerShockwave = useCallback(() => {
    const id = Date.now() + Math.random();
    setShockwaves((prev) => [...prev, id]);
    setTimeout(() => {
      setShockwaves((prev) => prev.filter((item) => item !== id));
    }, 1200);
  }, []);

  // Continuous "Order! Order!" Strike Loop (Every 6 seconds)
  useEffect(() => {
    const runOrderOrderRhythm = () => {
      setStrikePhase('raising');

      // Strike 1
      setTimeout(() => {
        setStrikePhase('strike1');
        playGavelSound(150);
        triggerShockwave();
        setStrikeCount((c) => c + 1);
      }, 500);

      // Strike 2 ("Order!")
      setTimeout(() => {
        setStrikePhase('raising');
      }, 1000);

      setTimeout(() => {
        setStrikePhase('strike2');
        playGavelSound(140);
        triggerShockwave();
        setStrikeCount((c) => c + 1);
      }, 1400);

      // Strike 3 ("Order!")
      setTimeout(() => {
        setStrikePhase('raising');
      }, 1900);

      setTimeout(() => {
        setStrikePhase('strike3');
        playGavelSound(130);
        triggerShockwave();
        setStrikeCount((c) => c + 1);
      }, 2300);

      // Settle
      setTimeout(() => {
        setStrikePhase('idle');
      }, 3400);
    };

    runOrderOrderRhythm();
    const interval = setInterval(runOrderOrderRhythm, 6500);
    return () => clearInterval(interval);
  }, [playGavelSound, triggerShockwave]);

  // Manual User Strike
  const handleManualStrike = () => {
    if (isStriking) return;
    setIsStriking(true);
    setStrikePhase('raising');

    setTimeout(() => {
      setStrikePhase('strike1');
      playGavelSound(160);
      triggerShockwave();
      setStrikeCount((c) => c + 1);
      setTimeout(() => {
        setStrikePhase('idle');
        setIsStriking(false);
      }, 800);
    }, 300);
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 bg-nepal-dark text-white border-b border-sakura-border">
      
      {/* 1. LAYER: Courtroom Background Crossfader with Deep Navy & Nepal Flag Tonal Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.22, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center filter saturate-150 contrast-125"
            style={{
              backgroundImage: `url(${courtroomBackgrounds[bgIndex].url})`,
            }}
          />
        </AnimatePresence>

        {/* Navy Gradient Grids for Maximum Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001F54] via-[#001F54]/90 to-[#001F54]/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001F54] via-transparent to-[#001F54]/80" />

        {/* Ambient Neon Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-nepal-blue/25 rounded-full blur-[140px]" />
        <div className="absolute top-12 right-12 w-80 h-80 bg-crimson/18 rounded-full blur-3xl" />
      </div>

      {/* 2. LAYER: Main Content Grid (Typography + Interactive Animated Gavel) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & High-Converting CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Prestige Authority Pill */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nepal-surface border border-sakura-border text-xs font-bold text-white tracking-wide shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-crimson" />
              <span>Nationwide Trial Litigators & Corporate Counsel</span>
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
              className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal font-sans"
            >
              When high-stakes corporate disputes arise or catastrophic injury demands justice, Apex Legal Counsel commands the courtroom and negotiating table with unwavering precision.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 font-sans"
            >
              <Link
                href="#case-evaluation"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-crimson hover:bg-crimson-hover border border-white/20 shadow-xl shadow-crimson/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Request Free Case Evaluation</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                href="/case-results"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-nepal-surface hover:bg-nepal-blue border border-sakura-border transition"
              >
                <span>Explore $250M+ In Verdicts</span>
              </Link>
            </motion.div>

            {/* Trust Credentials */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 flex flex-wrap items-center gap-6 sm:gap-10 border-t border-sakura-border/30 text-xs text-slate-200 font-sans"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-crimson" />
                <span className="font-bold text-white">Zero Fee Unless We Win</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-crimson" />
                <span className="font-bold text-white">24/7 Urgent Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-crimson" />
                <span className="font-bold text-white">Former Federal Prosecutors</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: High-Performance Animated Gavel Bench & "Order, Order" Rhythm */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            <div className="relative w-full max-w-md p-7 sm:p-8 rounded-3xl bg-nepal-surface/90 border border-sakura-border shadow-2xl backdrop-blur-xl space-y-6 overflow-hidden text-center">
              
              {/* Bench Chamber Top Title & Audio Toggle */}
              <div className="flex items-center justify-between border-b border-sakura-border/40 pb-3 text-xs">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-crimson animate-ping" />
                  <span className="font-serif font-bold text-sm tracking-wide">Courtroom in Session</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-nepal-dark border border-sakura-border text-[11px] font-bold text-white hover:text-crimson transition cursor-pointer"
                  title={soundEnabled ? 'Mute gavel audio strike' : 'Enable gavel sound on strike'}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-crimson" />
                      <span>Audio ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>Audio OFF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dynamic Animated "ORDER! ORDER!" Badge */}
              <div className="h-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {strikePhase !== 'idle' ? (
                    <motion.div
                      key={strikePhase}
                      initial={{ scale: 0.8, opacity: 0, y: 5 }}
                      animate={{ scale: 1.15, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-crimson text-white font-serif font-extrabold text-sm sm:text-base tracking-widest uppercase shadow-xl shadow-crimson/40 border border-white/40"
                    >
                      <Sparkles className="w-4 h-4 text-white animate-spin" />
                      <span>
                        {strikePhase === 'strike1' && 'ORDER IN THE COURT!'}
                        {strikePhase === 'strike2' && 'ORDER!'}
                        {strikePhase === 'strike3' && 'ORDER!'}
                        {strikePhase === 'raising' && 'THE COURT STANDS READY'}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300"
                    >
                      Click Sound Block to Strike Gavel
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* THE ANIMATED JUDGE'S GAVEL & SOUND BLOCK CANVAS */}
              <div 
                onClick={handleManualStrike}
                className="relative h-64 sm:h-72 w-full flex items-center justify-center cursor-pointer select-none group"
                title="Click to strike the gavel"
              >
                
                {/* Shockwave Energy Rings emitted from sound block impact point */}
                {shockwaves.map((id) => (
                  <motion.div
                    key={id}
                    initial={{ scale: 0.3, opacity: 0.9 }}
                    animate={{ scale: 3.2, opacity: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className="absolute bottom-12 w-28 h-10 rounded-full border-2 border-crimson shadow-[0_0_20px_#DC143C] pointer-events-none"
                  />
                ))}

                {/* THE GAVEL (Head + Handle) */}
                <motion.div
                  className="absolute origin-bottom-right"
                  style={{
                    bottom: '68px',
                    right: '48%',
                  }}
                  animate={{
                    rotate: 
                      strikePhase === 'raising' ? -38 :
                      strikePhase === 'strike1' ? 0 :
                      strikePhase === 'strike2' ? 0 :
                      strikePhase === 'strike3' ? 0 :
                      -12,
                    y: 
                      strikePhase === 'raising' ? -24 :
                      strikePhase === 'strike1' ? 4 :
                      strikePhase === 'strike2' ? 4 :
                      strikePhase === 'strike3' ? 4 :
                      0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: strikePhase === 'raising' ? 220 : 750,
                    damping: strikePhase === 'raising' ? 20 : 16,
                  }}
                >
                  {/* SVG Handcrafted Courtroom Judge's Gavel */}
                  <svg 
                    width="140" 
                    height="140" 
                    viewBox="0 0 140 140" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform"
                  >
                    {/* Gavel Handle (Polished Hardwood & Gold Trim) */}
                    <path 
                      d="M60 70 L115 125" 
                      stroke="#8B4513" 
                      strokeWidth="10" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M62 72 L113 123" 
                      stroke="#A0522D" 
                      strokeWidth="6" 
                      strokeLinecap="round"
                    />
                    {/* Brass Band on Handle */}
                    <circle cx="75" cy="85" r="5" fill="#D4AF37" />
                    <circle cx="105" cy="115" r="7" fill="#8B4513" stroke="#D4AF37" strokeWidth="2" />

                    {/* Gavel Hammer Head (Polished Mahogany Cylinder) */}
                    <g transform="translate(18, 30) rotate(45)">
                      {/* Hammer Body */}
                      <rect x="0" y="0" width="70" height="32" rx="6" fill="#5C2C16" />
                      <rect x="3" y="3" width="64" height="26" rx="4" fill="#8B4513" />
                      {/* Brass Central Collar */}
                      <rect x="25" y="0" width="20" height="32" fill="#D4AF37" />
                      <rect x="28" y="2" width="14" height="28" fill="#F3E5AB" />
                      {/* Striking Faces */}
                      <ellipse cx="2" cy="16" rx="4" ry="16" fill="#D4AF37" />
                      <ellipse cx="68" cy="16" rx="4" ry="16" fill="#D4AF37" />
                    </g>
                  </svg>
                </motion.div>

                {/* THE SOUND BLOCK (Striking Plate) */}
                <div className="absolute bottom-6 w-56 h-12 flex items-center justify-center">
                  {/* Brass Sound Block Base */}
                  <div className="w-48 h-8 rounded-2xl bg-gradient-to-r from-[#8B4513] via-[#D4AF37] to-[#8B4513] border border-[#D4AF37] shadow-2xl flex items-center justify-center relative">
                    {/* Inner Walnut Inset */}
                    <div className="w-40 h-5 rounded-xl bg-[#4A2511] border border-[#D4AF37]/50 flex items-center justify-center">
                      <span className="text-[9px] font-serif font-bold uppercase tracking-widest text-[#F3E5AB] opacity-80">
                        Lex Est Dictamen Rationis
                      </span>
                    </div>
                  </div>
                  {/* Base Shadow */}
                  <div className="absolute -bottom-2 w-52 h-4 bg-black/60 rounded-full blur-md" />
                </div>

              </div>

              {/* Bench Footer Stats */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-300 font-sans">
                <div className="flex items-center gap-1.5">
                  <GavelIcon className="w-4 h-4 text-crimson" />
                  <span>Verdicts Delivered: <strong className="text-white">45+</strong></span>
                </div>
                <div className="text-slate-400">
                  Total Strikes: <span className="font-bold text-crimson">{strikeCount}</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
