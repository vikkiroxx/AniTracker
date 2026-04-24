"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center flex flex-col items-center max-w-3xl px-6"
      >
        <div className="mb-6 rounded-full bg-white/5 border border-white/10 p-4 backdrop-blur-xl shadow-2xl">
          <Image src="/icon-192x192.png" alt="AniTracker Logo" width={64} height={64} className="rounded-xl drop-shadow-lg" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/60">
          Track Your Anime. <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Beautifully.</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          The minimal, fast, and modern way to sync your progress with AniList. Built for speed, designed for aesthetics.
        </p>

        <div className="flex gap-4">
          <a href="/api/auth/login" className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium transition-all shadow-[0_0_40px_-10px_rgba(200,50,255,0.5)] hover:scale-105 active:scale-95">
            <Play className="w-5 h-5 fill-current" />
            Get Started
          </a>
          <button className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-foreground border border-white/10 rounded-full font-medium transition-all backdrop-blur-sm hover:scale-105 active:scale-95">
            Explore
          </button>
        </div>
      </motion.div>
    </div>
  );
}
