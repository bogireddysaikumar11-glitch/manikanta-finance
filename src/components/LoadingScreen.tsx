"use client";

import { useState, useEffect } from "react";
import { Bike, ShieldCheck, Gauge, Database, Sparkles, CheckCircle2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  isInline?: boolean;
}

export default function LoadingScreen({
  message,
  isInline = false,
}: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(25);

  const steps = [
    { title: "Starting Engine & Secure Session", desc: "Argon2id 256-bit encryption verified" },
    { title: "Loading Vehicle Inventory & Valuations", desc: "Syncing Hero, Honda, Bajaj, TVS & Royal Enfield stock" },
    { title: "Auditing Customer Dues & EMI Ledger", desc: "Calculating daily collections & profit margins" },
    { title: "Verifying Immutable PostgreSQL Database", desc: "Showroom records online & synchronized" },
    { title: "Manikanta Finance Workspace Ready", desc: "Ride Today, Better Tomorrow" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
      setProgress((prev) => (prev >= 95 ? 30 : prev + 20));
    }, 1800);

    return () => clearInterval(timer);
  }, [steps.length]);

  const currentStep = steps[stepIndex];

  return (
    <div
      className={`${
        isInline
          ? "min-h-[400px] w-full rounded-2xl"
          : "fixed inset-0 z-50 min-h-screen"
      } bg-[#030712] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden select-none`}
    >
      {/* 1. Ambient Background Glowing Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/10 via-transparent to-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none opacity-30" />

      {/* 2. Center Animated Emblem & Brand Unit */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Animated Emblem Crest with Breathing Gold Aura */}
        <div className="relative mb-6 group">
          {/* Rotating Outer Golden Halo */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-600/40 blur-md animate-pulse-gold pointer-events-none" />

          {/* Golden Ring Border */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-2xl shadow-amber-500/30">
            <img
              src="/images/manikanta_logo.jpg"
              alt="Manikanta Finance Official Crest"
              className="w-full h-full object-cover rounded-full border-2 border-slate-950"
            />
          </div>

          {/* Floating Spinning Alloy Wheel Badge */}
          <div className="absolute -bottom-2 -right-1 bg-slate-900 border-2 border-amber-400 p-2 rounded-full text-amber-400 shadow-lg shadow-black/80 animate-wheel-spin">
            <Bike className="w-5 h-5 stroke-[2.2]" />
          </div>

          {/* Floating Security Badge */}
          <div className="absolute -top-1 -left-2 bg-slate-900 border-2 border-emerald-400 p-1.5 rounded-full text-emerald-400 shadow-lg shadow-black/80">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Brand Title with 3D Gold Gradient Effect */}
        <h1 className="text-2xl sm:text-3xl font-black tracking-wider bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
          MANIKANTA FINANCE
        </h1>

        <div className="mt-1 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-amber-400/90 uppercase">
          <span>★ Since 26 Years Ago</span>
          <span>•</span>
          <span>All Two Wheeler Bikes ★</span>
        </div>

        {/* 3. Tachometer / Speedometer Revving Animation */}
        <div className="mt-6 flex items-center justify-center gap-4 bg-slate-900/70 border border-slate-800/80 px-5 py-2.5 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
              RPM SPEED:
            </span>
          </div>

          {/* Speedometer Gauge Bar */}
          <div className="flex items-center gap-1">
            {[40, 60, 80, 100, 120, 140, 160].map((speed, idx) => (
              <div
                key={speed}
                className={`w-1.5 h-4 rounded-full transition-all duration-300 ${
                  idx <= (stepIndex % 7)
                    ? idx > 4
                      ? "bg-rose-500 shadow-xs shadow-rose-500/50"
                      : "bg-amber-400 shadow-xs shadow-amber-400/50"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 4. Sleek Metallic Progress Bar */}
        <div className="mt-6 w-full max-w-xs">
          <div className="h-2 w-full bg-slate-900/90 rounded-full border border-slate-800 overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full transition-all duration-700 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* 5. Cycling Status Messages */}
        <div className="mt-4 min-h-[50px] flex flex-col items-center justify-center">
          <div className="text-sm font-bold text-slate-200 flex items-center gap-2 animate-in fade-in duration-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{message || currentStep.title}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {currentStep.desc}
          </p>
        </div>

        {/* 6. Footer System Indicator */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            PostgreSQL v16
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Live Ledger Sync
          </span>
        </div>
      </div>
    </div>
  );
}
