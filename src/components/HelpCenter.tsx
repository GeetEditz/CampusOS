'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Brain, 
  MessageSquare, 
  Users, 
  Lock, 
  Star,
  Award,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  Cpu,
  BarChart3,
  Network
} from 'lucide-react';

export default function HelpCenter() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How are opportunities recommended?",
      a: "CampusOS uses an AI matching engine that evaluates your Academic Identity (Branch, Year) and your Onboarding Skills. It cross-references these against the tags and requirements of live opportunities shared by Seniors. The higher the Match Score, the higher the opportunity appears in your feed."
    },
    {
      q: "How does credibility affect visibility?",
      a: "Mentors and students with higher Credibility Scores receive an algorithmic boost. When a highly credible Guru posts an opportunity, it is instantly prioritized and distributed faster to matching students, ensuring high-quality intel isn't buried."
    },
    {
      q: "How does the AI mentor work?",
      a: "The AI Mentor is powered by an NVIDIA NIM Llama 3.1 agent that has access to the entire CampusOS database. It analyzes the context of your questions and fetches verified institutional knowledge to guide your career path securely."
    },
    {
      q: "Can users report fake intel?",
      a: "Yes. CampusOS utilizes peer verification. If an opportunity receives significant downvotes, our automated trust systems temporarily flag the post for review, protecting the integrity of the network."
    }
  ];

  return (
    <div className="flex flex-col gap-16 w-full max-w-7xl mx-auto p-4 md:p-8 animate-fadeIn font-sans pb-32 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full rounded-3xl overflow-hidden glass-panel border border-white/5 bg-gradient-to-br from-indigo-950/40 via-black to-black p-10 md:p-20 text-center flex flex-col items-center justify-center min-h-[400px] group mt-4">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
        
        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-indigo-400 px-4 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/30 mb-6 flex items-center gap-2 shadow-sm animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Intelligence Center
        </span>
        
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tight leading-tight max-w-4xl mb-6">
          CampusOS democratizes hidden institutional knowledge using AI.
        </h1>
        
        <p className="text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed font-medium">
          We transform fragmented campus whispers into a centralized, verifiable intelligence network. Discover how our credibility algorithms and neural networks power your career roadmap.
        </p>
      </section>

      {/* 2. WHAT CAMPUSOS DOES */}
      <section className="flex flex-col gap-8 w-full relative">
        <div className="flex flex-col items-center text-center gap-2 mb-4">
          <h2 className="text-2xl md:text-3xl font-black text-white">Platform Capabilities</h2>
          <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Enterprise-Grade Student Intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Target />, title: "AI Opportunity Discovery", desc: "Neural matching connects you with hidden internships and hackathons instantly." },
            { icon: <Network />, title: "Senior Intelligence Feed", desc: "A curated timeline of verified campus opportunities posted directly by seniors." },
            { icon: <MessageSquare />, title: "Mentorship Systems", desc: "Direct node-messaging to establish powerful 1-on-1 mentorship channels." },
            { icon: <BarChart3 />, title: "Opportunity Heatmaps", desc: "Live analytics displaying trending domains and active branch engagements." },
            { icon: <Brain />, title: "Personalized Roadmaps", desc: "Dynamic visibility scoring tailors the entire platform to your precise skillset." },
            { icon: <Cpu />, title: "Network Visualization", desc: "A mathematical orbital rendering of your campus's hidden relationship pipelines." }
          ].map((feature, i) => (
            <div key={i} className="glass-panel border border-white/5 rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="w-12 h-12 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-2">{feature.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CREDIBILITY SCORE SYSTEM */}
      <section className="flex flex-col gap-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 mb-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">How Trust is Built</h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              CampusOS utilizes an algorithmic credibility engine to ensure high-quality intelligence. Your trust level governs your influence on the network.
            </p>
          </div>
          <div className="hidden md:flex bg-emerald-950/30 border border-emerald-500/20 px-4 py-2 rounded-xl items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Verified Logic Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Hierarchy of Trust</h3>
            {[
              { rank: "Rookie", pts: "0 - 100", color: "zinc", desc: "New students exploring the ecosystem." },
              { rank: "Contributor", pts: "101 - 300", color: "blue", desc: "Active members verifying basic intel." },
              { rank: "Mentor", pts: "301 - 600", color: "purple", desc: "Trusted seniors guiding juniors effectively." },
              { rank: "Pioneer", pts: "601 - 900", color: "cyan", desc: "Top 5% of network influencers." },
              { rank: "Guru", pts: "901+", color: "amber", desc: "Legendary alumni commanding the feed." }
            ].map((tier, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/2 border border-white/5 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border border-${tier.color}-500/30 bg-${tier.color}-950/40 text-${tier.color}-400 font-black`}>
                  {i + 1}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{tier.rank}</span>
                    <span className="text-[10px] font-black tracking-widest text-zinc-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">{tier.pts} PTS</span>
                  </div>
                  <span className="text-xs text-zinc-400 mt-1">{tier.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
              <TrendingUp className="text-emerald-400" />
              Dynamic Scoring Mechanics
            </h3>
            
            <p className="text-sm text-zinc-300 leading-relaxed mb-8">
              Our PostgreSQL database triggers are actively verifying your interactions. Credibility is NOT statically assigned; it must be earned through rigorous academic peer-review.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { action: "Posting verified opportunity intel", pts: "+10" },
                { action: "Receiving helpful upvotes", pts: "+5" },
                { action: "Commenting useful advice", pts: "+3" },
                { action: "Mentorship engagement", pts: "+15" },
                { action: "Opportunity success report", pts: "+20" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-black/40 border border-white/5 p-3 rounded-xl">
                  <span className="text-xs font-semibold text-zinc-300">{item.action}</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/30 px-2.5 py-1 rounded border border-emerald-500/20">{item.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI INTELLIGENCE SYSTEM EXPLANATION */}
      <section className="relative w-full rounded-3xl overflow-hidden glass-panel border border-white/5 bg-gradient-to-r from-zinc-950 to-black p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 group">
        <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-blue-900/10 to-transparent pointer-events-none"></div>
        
        <div className="flex-1 z-10 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-400 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 shadow-sm">
              Neural Infrastructure
            </span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            How the AI Engine Operates
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
            CampusOS is powered by NVIDIA NIM microservices running Llama 3.1. The AI does not just answer questions; it has programmatic access to your academic profile, skill parameters, and real-time campus data.
          </p>
          
          <ul className="flex flex-col gap-4 mt-2">
            {[
              "Real-time Opportunity Matching",
              "Automated Skill-Gap Analysis",
              "Context-Aware Career Roadmaps"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-semibold text-zinc-200">
                <CheckIcon /> {text}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex-1 w-full relative z-10">
          {/* Animated Mockup Diagram */}
          <div className="w-full aspect-video bg-black/60 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-between shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent)] animate-pulse"></div>
            
            <div className="w-full flex justify-between items-center px-8 relative z-10 mt-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-1">
                <UserIcon /> <span className="text-[8px] text-zinc-400 font-bold uppercase">Profile</span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-blue-500/30 mx-4 relative">
                <div className="absolute w-3 h-3 bg-blue-400 rounded-full -top-[7px] animate-ping"></div>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-blue-950 border border-blue-500/50 flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex-1 border-t-2 border-dashed border-blue-500/30 mx-4 relative">
                 <div className="absolute right-0 w-3 h-3 bg-blue-400 rounded-full -top-[7px] animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-1">
                <TargetIcon /> <span className="text-[8px] text-zinc-400 font-bold uppercase">Feed</span>
              </div>
            </div>
            
            <div className="text-center text-[10px] text-zinc-500 font-bold tracking-widest uppercase relative z-10 mb-4">
              Vectorized Processing Pipeline
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE FAQ */}
      <section className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-white text-center">Frequently Asked Questions</h2>
        
        <div className="w-full flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`glass-panel border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${openFaq === i ? 'border-indigo-500/50 bg-white/5' : 'border-white/5 hover:border-white/10'}`}
              onClick={() => toggleFaq(i)}
            >
              <div className="p-5 flex justify-between items-center select-none">
                <h4 className="text-sm font-bold text-zinc-200">{faq.q}</h4>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
              </div>
              <div className={`px-5 overflow-hidden transition-all duration-500 ${openFaq === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="w-full rounded-3xl overflow-hidden glass-panel border border-white/5 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.15),transparent)] p-12 text-center flex flex-col items-center gap-6 mt-8 relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        <Lock className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-500" />
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight max-w-2xl">
          CampusOS transforms hidden knowledge into accessible intelligence.
        </h2>
        <p className="text-sm text-zinc-400 mb-4 font-medium">
          Enterprise-grade ethics. Peer-verified transparency. Unrivaled momentum.
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="glow-btn px-8 py-3.5 rounded-xl text-sm font-black text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          Access Institutional Feed
        </button>
      </section>

    </div>
  );
}

// Minimal Icons for Diagrams
const CheckIcon = () => (
  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center shrink-0">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  </div>
);
const UserIcon = () => <User size={20} className="text-zinc-400" />;
const TargetIcon = () => <Target size={20} className="text-zinc-400" />;
import { User } from 'lucide-react';
