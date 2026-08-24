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
    <section 
      id="courtroom-hero"
      className="courtroom-hero position-relative min-vh-75 d-flex align-items-center justify-content-center overflow-hidden bg-nepal-dark text-white border-bottom border-sakura py-5"
    >
      
      {/* 1. FULL BACKGROUND IMAGE WITH ULTRA-SMOOTH GPU-ACCELERATED KEN-BURNS ANIMATION */}
      <div className="position-absolute top-0 start-0 w-100 h-100 z-0 overflow-hidden pointer-events-none">
        <div className="position-relative w-100 h-100 hero-ken-burns">
          <Image
            src="/images/courtroom_hero.jpg"
            alt="Apex Legal Courtroom Bench and Judicial Chambers"
            fill
            priority
            sizes="100vw"
            className="object-fit-cover object-fit-center filter-saturate"
          />
        </div>

        {/* Ambient Dark Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ background: 'linear-gradient(90deg, rgba(0, 31, 84, 0.65) 0%, rgba(0, 31, 84, 0.45) 50%, rgba(0, 31, 84, 0.3) 100%)' }}
        />
      </div>

      {/* 2. FOREGROUND CONTENT GRID */}
      <div className="container-xl position-relative z-1 py-5">
        <div className="row align-items-center g-5">
          
          {/* Left Column: Authoritative Copy & Direct Legal CTAs */}
          <div className="col-12 col-lg-7 d-flex flex-column gap-4">
            
            {/* National Counsel Authority Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="badge bg-nepal-surface border border-sakura px-3 py-2 rounded-pill small fw-bold text-white d-inline-flex align-items-center gap-2 align-self-start shadow"
            >
              <ShieldCheck className="text-crimson" style={{ width: '16px', height: '16px' }} />
              <span>Nationwide Trial Litigators & Supreme Court Counsel</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif display-4 fw-bold text-white lh-tight mb-0"
            >
              <span>Commanding The Courtroom.</span> <br />
              <span className="text-crimson">Decisive Landmark Results.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="fs-5 text-white lead mb-0"
              style={{ maxWidth: '650px' }}
            >
              When high-stakes corporate disputes arise or catastrophic injury demands justice, Apex Legal Counsel commands the courtroom and negotiating table with unwavering precision.
            </motion.p>

            {/* Conversion CTA Group */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3 pt-2"
            >
              <Link
                href="#case-evaluation"
                className="btn btn-danger btn-crimson btn-lg px-4 py-3 rounded-pill fw-bold text-white d-flex align-items-center justify-content-center gap-2 shadow"
              >
                <span>Request Free Case Evaluation</span>
                <ArrowRight className="text-white" style={{ width: '18px', height: '18px' }} />
              </Link>

              <Link
                href="/case-results"
                className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-bold text-white bg-nepal-surface border-sakura shadow"
              >
                <span>Explore $250M+ In Verdicts</span>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="d-flex flex-wrap align-items-center gap-4 pt-3 border-top border-sakura small text-white"
            >
              <div className="d-flex align-items-center gap-2">
                <CheckCircle2 className="text-crimson" style={{ width: '16px', height: '16px' }} />
                <span className="fw-bold">Zero Fee Unless We Win</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle2 className="text-crimson" style={{ width: '16px', height: '16px' }} />
                <span className="fw-bold">24/7 Confidential Intake</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <CheckCircle2 className="text-crimson" style={{ width: '16px', height: '16px' }} />
                <span className="fw-bold">Former Federal Prosecutors</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Floating Court & Order Judicial Crest with Balancing Scales */}
          <div className="col-12 col-lg-5 d-flex justify-content-center justify-content-lg-end">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="sakura-glass-card p-4 rounded-4 shadow-lg text-white w-100"
              style={{ maxWidth: '420px' }}
            >
              
              {/* Subtle Judicial Gold Header Ribbon */}
              <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-sakura">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-crimson" style={{ width: '10px', height: '10px' }} />
                  <span className="font-serif fw-bold text-white small">Courtroom Authority</span>
                </div>
                
                {/* Audio Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 border-sakura"
                  style={{ fontSize: '11px' }}
                  title={soundEnabled ? 'Mute gavel sound' : 'Enable gavel sound on strike'}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="text-crimson" style={{ width: '14px', height: '14px' }} />
                      <span className="fw-bold">Sound ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="text-white" style={{ width: '14px', height: '14px' }} />
                      <span className="fw-bold">Sound OFF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Dynamic Animated Scales of Justice with Law Equilibrium Sway */}
              <div className="d-flex flex-column align-items-center justify-content-center py-3 gap-2">
                <motion.div
                  animate={{
                    rotate: strikeActive ? [-15, 15, -8, 8, 0] : [-3, 3, -3],
                  }}
                  transition={{
                    duration: strikeActive ? 1.2 : 6,
                    repeat: strikeActive ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                  className="d-flex align-items-center justify-content-center rounded-3 bg-nepal-blue border border-sakura shadow"
                  style={{ width: '64px', height: '64px' }}
                >
                  <Scale className="text-white" style={{ width: '36px', height: '36px' }} />
                </motion.div>

                <div className="text-center">
                  <span className="d-block font-serif fs-5 fw-bold text-white">
                    Fiat Justitia Ruat Caelum
                  </span>
                  <span className="d-block small text-crimson fw-bold text-uppercase" style={{ letterSpacing: '0.1em' }}>
                    Let Justice Be Done
                  </span>
                </div>
              </div>

              {/* Interactive "Order, Order" Gavel Strike Trigger */}
              <div className="d-flex flex-column gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleGavelStrike}
                  className="btn btn-danger btn-crimson w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 text-white fw-bold small text-uppercase shadow"
                >
                  <Gavel className={`text-white transition-transform ${strikeActive ? '-rotate-45' : ''}`} style={{ width: '16px', height: '16px' }} />
                  <span>{strikeActive ? 'Calling Court to Order...' : 'Strike Courtroom Gavel'}</span>
                </button>

                {/* Animated "ORDER!" Speech Banner */}
                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '24px' }}>
                  <AnimatePresence mode="wait">
                    {strikeText && (
                      <motion.div
                        key={strikeText}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="d-flex align-items-center gap-1 font-serif fw-bold text-crimson small text-uppercase"
                        style={{ letterSpacing: '0.1em' }}
                      >
                        <Sparkles className="text-crimson" style={{ width: '14px', height: '14px' }} />
                        <span>{strikeText}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Verified Firm Record Ticker */}
              <div className="pt-3 border-top border-sakura d-flex align-items-center justify-content-between small text-white">
                <div className="d-flex align-items-center gap-1">
                  <Award className="text-crimson" style={{ width: '14px', height: '14px' }} />
                  <span>Recoveries: <strong className="text-white">$250M+</strong></span>
                </div>
                <div>
                  <span className="text-white-50">Success: </span><strong className="text-crimson">98.6%</strong>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </div>

    </section>
  );
}
