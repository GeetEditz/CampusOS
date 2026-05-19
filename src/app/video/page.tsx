'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Share2, 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Play
} from 'lucide-react';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import { Button } from '@/components/ui/button';

export default function VideoDemoPage() {
  // Replace this URL with your custom YouTube embed URL or Loom URL
  const demoVideoUrl = "https://www.youtube.com/embed/plieCub8FN0"; 

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans relative overflow-x-hidden selection:bg-primary/30 selection:text-white">
      
      {/* Immersive background glowing gradients */}
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/10 blur-[150px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none"></div>
      
      {/* Thin line background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Floating Curved Glassmorphic Navbar */}
      <div className="sticky top-4 z-50 w-[calc(100%-2rem)] max-w-6xl mx-auto mt-4">
        <header className="px-6 py-3 flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl shadow-black/40 relative z-20">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/white-logo-no-bg.png" alt="CampusOS Logo" className="w-5 h-5 object-contain" />
              <div className="absolute -inset-1 rounded-lg bg-white/10 blur opacity-20"></div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">CampusOS</span>
              <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20 font-bold uppercase tracking-wider">Demo Tour</span>
            </div>
          </div>

          <Button asChild variant="outline" className="border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5 text-zinc-300 hover:text-white text-xs font-bold gap-2 rounded-xl transition-all cursor-pointer">
            <Link href="/login">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Portal
            </Link>
          </Button>
        </header>
      </div>

      {/* Hero section */}
      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center relative z-10 gap-10">
        
        <div className="flex flex-col items-center gap-4 max-w-3xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">NVIDIA NIM Opportunity Engine</span>
          </div>
          
          <h1 className="font-black text-4xl sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-none">
            Democratizing Campus Opportunities
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mt-2">
            Watch the video presentation below to discover how CampusOS breaks down the &ldquo;Senior Network Privilege Gap&rdquo; using high-fidelity SaaS dashboards and local AI roadmap generation.
          </p>
        </div>

        {/* Video Dialog Block */}
        <div className="w-full max-w-4xl p-1 bg-white/[0.02] border border-white/10 rounded-2xl shadow-2xl relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 blur opacity-15 pointer-events-none"></div>
          
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc={demoVideoUrl}
            thumbnailSrc="/THUMB.jpg"
            thumbnailAlt="CampusOS Dashboard Tour Thumbnail"
            className="w-full"
            audioSrc="/audio.mp3"
          />
        </div>

        {/* Call to action & feature checklist */}
        <div className="flex items-center justify-center mt-4 w-full">
          <Button asChild className="glow-btn px-10 h-12 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer">
            <Link href="/login">
              <span>Access CampusOS Portal</span>
              <Play className="w-3 h-3 fill-white" />
            </Link>
          </Button>
        </div>

        {/* Segmented Feature Highlights Grid */}
        <div className="w-full border-t border-white/5 pt-16 mt-8 flex flex-col gap-8 text-left">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider text-center sm:text-left">What&apos;s Demonstrated in the Video</h3>
            <p className="text-xs text-zinc-500 mt-1 text-center sm:text-left">A walkthrough of the core intelligence modules running inside the CampusOS workspace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Share2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Intel Share Feed</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Allowing verified senior mentors to post high-urgency unadvertised referrals, faculty tips, and placement study guides.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Brain className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">NIM Recommendation</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Real-time preparation roadmaps generated by Meta Llama 3.1 405B scanning student department, skills, and target goals.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">AI Mentor Chat</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Conversational companion offering immediate context-aware mock interviews, resume feedback, and advisor tip navigation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Opportunity Analytics</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Branch engagements, career domain allocations, and monthly application metrics mapped into interactive Recharts views.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer copyright */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest relative z-10">
        <span>&copy; {new Date().getFullYear()} CampusOS. All rights reserved.</span>
        <span>Built with Next.js, Tailwind v4 & NVIDIA NIM AI</span>
      </footer>

    </div>
  );
}
