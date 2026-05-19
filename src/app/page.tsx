'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Brain, 
  Share2, 
  MessageSquare, 
  BarChart3, 
  Database, 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  ChevronRight,
  Play
} from 'lucide-react';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const demoVideoUrl = "https://www.youtube.com/embed/3hccXiXX0u8";

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans relative overflow-x-hidden selection:bg-primary/30 selection:text-white">
      
      {/* Dynamic atmospheric background glowing gradients */}
      <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full bg-primary/10 blur-[160px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[20%] right-[-100px] w-[600px] h-[600px] rounded-full bg-emerald-600/5 blur-[130px] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[-200px] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      {/* Grid background layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Floating Curved Glassmorphic Navbar */}
      <div className="sticky top-4 z-50 w-[calc(100%-2rem)] max-w-6xl mx-auto mt-4">
        <nav className="px-6 py-3 flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl shadow-black/40 relative z-20">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/white-logo-no-bg.png" alt="CampusOS Logo" className="w-5 h-5 object-contain" />
              <div className="absolute -inset-1 rounded-lg bg-white/10 blur opacity-25"></div>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">CampusOS</span>
              <span className="ml-2 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Navigation center links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#problem" className="hover:text-white transition-colors">The Opportunity Gap</a>
            <a href="#features" className="hover:text-white transition-colors">Core Engine</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <Link href="/video" className="hover:text-white transition-colors flex items-center gap-1">
              <span>Video Tour</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="glow-btn px-5 h-9 rounded-xl font-bold text-xs text-white flex items-center gap-1.5 hover:scale-102 transition-all cursor-pointer">
              <Link href="/login">
                <span>Access Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col items-center text-center relative z-10 gap-8">
        <div className="flex flex-col items-center gap-5 max-w-3xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Commit Happens Hackathon Submission</span>
          </div>
          
          <h1 className="font-black text-4xl sm:text-5xl md:text-7xl tracking-tight bg-gradient-to-b from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent leading-none">
            Democratizing Campus Opportunities
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed mt-2 max-w-2xl">
            Shattering the &ldquo;Senior Network Privilege Gap&rdquo;. CampusOS compiles unadvertised sophomore internships, elite scholarships, research fellowships, and faculty lab tips into a verified, high-fidelity SaaS workspace.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Button asChild className="glow-btn px-8 h-12 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-102 transition-all w-full sm:w-auto cursor-pointer">
            <Link href="/login">
              <span>Access Student Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5 text-zinc-400 hover:text-white px-8 h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
            <Link href="/video">
              <Play className="w-3.5 h-3.5 text-zinc-500" />
              <span>Watch Video Tour</span>
            </Link>
          </Button>
        </div>

        {/* Interactive Image Showcase */}
        <div className="w-full max-w-5xl md:max-w-6xl p-1.5 bg-white/[0.02] border border-white/10 rounded-2xl shadow-2xl relative mt-8 animate-slideDown">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 blur opacity-15 pointer-events-none"></div>
          
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/image.png" 
            alt="CampusOS SaaS Platform Overview"
            className="w-full h-auto rounded-xl border border-white/10 shadow-2xl relative z-10"
          />
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section id="problem" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 scroll-mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4" />
              <span>The Systemic Privilege Gap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Why Underprivileged Students Miss Out
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              First-generation and low-income students frequently miss career-defining sophomore roles, elite hackathon nominations, and research fellowships because this information is locked inside exclusive senior circles.
            </p>
            
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-red-950/20 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✕</div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Locked Senior Circles</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Valuable tips and direct referral tags are only shared via close informal messaging loops.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-red-950/20 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✕</div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Unadvertised Roles</h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Many research labs and fellowship nominations are filled without any public listing.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden bg-white/[0.015]">
            <div className="absolute top-[-100px] right-[-100px] w-[200px] h-[200px] rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4" />
              <span>The CampusOS Solution</span>
            </div>
            <h2 className="text-2xl font-black text-white leading-tight">
              Democratizing Institutional Intel
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              CampusOS opens the black box, automatically compiling unadvertised roles, faculty tip-offs, and study guidelines into verified streams accessible to all department students.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-white/2 border border-white/5">
                <span className="text-[10px] font-black uppercase text-emerald-400">100% Transparent</span>
                <span className="text-[11px] text-zinc-400 leading-normal">Open feeds verify that all eligible branch students receive direct referral information.</span>
              </div>
              <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-white/2 border border-white/5">
                <span className="text-[10px] font-black uppercase text-emerald-400">AI Preparation</span>
                <span className="text-[11px] text-zinc-400 leading-normal">Meta Llama 3.1 scans active listings against student profiles to build instant study roadmaps.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 scroll-mt-12">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Workspace Capabilities</span>
          <h2 className="text-3xl font-black text-white">Engineered for Academic Acceleration</h2>
          <p className="text-xs text-zinc-500 max-w-xl">
            A comprehensive, high-fidelity platform consolidating peer verification, language model roadmap synthesis, and real-time activity metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-panel border border-white/10 rounded-2xl p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex gap-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Verified Intel Share Feed</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A community-curated feed where senior mentors post high-urgency unadvertised internship listings, research fellowships, and study resources. Supports custom department tags, comment columns, and vote meters.
              </p>
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex gap-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">NVIDIA NIM AI Roadmap Engine</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instant candidate evaluation. Our Llama 3.1 model scans the student&apos;s branch, skills, and target positions to synthesize personalized milestone prep plans, complete with recommended resource URLs.
              </p>
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex gap-5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Interactive AI Career Mentor</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A conversational companion built into the workspace. Simulates interview training, refines resume bullet points, and provides instant advice on faculty research labs. Includes pre-configured prompt helpers.
              </p>
            </div>
          </div>

          <div className="glass-panel border border-white/10 rounded-2xl p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex gap-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Heatmap & Opportunity Analytics</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Branch engagement run-rates, career category indexes, and active placement logs mapped into animated Recharts graphs. Provides immediate insight into department application trends.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Relational Schema / Architecture Section */}
      <section id="architecture" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 scroll-mt-12 bg-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Database className="w-4 h-4" />
              <span>Relational Schema & Security</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              High-Fidelity Postgres Architecture
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              CampusOS runs on a structured relational Postgres schema configured in Supabase. Public profiles, posts, comments, upvotes, and notifications are bound by strict Row-Level Security (RLS) triggers.
            </p>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300"><strong className="text-white">Profiles Table:</strong> Stores user details, skills, department tags, SSO statuses, and credibility score metrics.</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300"><strong className="text-white">Posts Table:</strong> Hosts unadvertised opportunities, category classifications, and urgency tags.</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300"><strong className="text-white">RLS Security Triggers:</strong> Guarantee only verified seniors can create post entries, and only owners can modify comments.</span>
              </div>
            </div>
          </div>

          {/* Database Schema Visual Mockup */}
          <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col gap-4 font-mono text-[10px] text-zinc-500 relative overflow-hidden bg-zinc-950">
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400">DATABASE RELATIONSHIPS</span>
              <span className="text-[8px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded font-bold">SQL SCHEMA</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white">Table: profiles</span>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <span>id (uuid, PK)</span>
                  <span>name (text)</span>
                  <span>role (text)</span>
                  <span>credibility_score (int)</span>
                </div>
              </div>

              <div className="flex justify-center text-[12px] text-primary select-none h-2 leading-none">↓ FK (author_id)</div>

              <div className="p-3 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white">Table: posts</span>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <span>id (uuid, PK)</span>
                  <span>title (text)</span>
                  <span>author_id (uuid, FK)</span>
                  <span>category (text)</span>
                </div>
              </div>

              <div className="flex justify-center text-[12px] text-primary select-none h-2 leading-none">↓ FK (post_id)</div>

              <div className="p-3 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-white">Table: comments</span>
                <div className="grid grid-cols-2 gap-1 text-[9px]">
                  <span>id (uuid, PK)</span>
                  <span>post_id (uuid, FK)</span>
                  <span>author_id (uuid, FK)</span>
                  <span>content (text)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10">
        <div className="glass-panel border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden bg-white/[0.015] flex flex-col items-center gap-6">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Join the Academic Index</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight max-w-xl">
            Shatter the Network Barrier in Your College
          </h2>
          
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg">
            Create your account instantly, configure your branch parameters, and start accessing senior referrals and Meta Llama 3.1 roadmap updates.
          </p>

          <Button asChild className="glow-btn px-10 h-12 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer">
            <Link href="/login">
              <span>Access CampusOS Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest relative z-10">
        <span>&copy; {new Date().getFullYear()} CampusOS. All rights reserved.</span>
        <span>Built for Commit Happens Hackathon</span>
      </footer>

    </div>
  );
}
