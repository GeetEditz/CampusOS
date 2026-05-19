'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  BookOpen, 
  Mail, 
  LockKeyhole, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    isAuthenticated,
    authStep,
    setAuthStep,
    loginPath,
    setLoginPath,
    authMode,
    setAuthMode,
    authError,
    setAuthError,
    emailInput,
    setEmailInput,
    passwordInput,
    setPasswordInput,
    onboardName,
    setOnboardName,
    onboardBranch,
    setOnboardBranch,
    onboardYear,
    setOnboardYear,
    onboardSkills,
    setOnboardSkills,
    newSkillInput,
    setNewSkillInput,
    onboardInterests,
    setOnboardInterests,
    newInterestInput,
    setNewInterestInput,
    userProfile,
    posts,
    selectedFeedPost,
    setSelectedFeedPost,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    commandSearchQuery,
    setCommandSearchQuery,
    showShortcutHelper,
    setShowShortcutHelper,
    handleDemoLogin,
    handleLogin,
    handleOnboardingComplete,
    handleLogout
  } = useApp();

  // Reset all scroll positions on route change to guarantee absolute top-alignment
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.scrollTop = 0;
      const scrollContainers = document.querySelectorAll('.overflow-y-auto, .overflow-hidden, [class*="overflow-"]');
      scrollContainers.forEach(container => {
        container.scrollTop = 0;
      });
    }
  }, [pathname]);

  // Onboarding helpers
  const handleAddSkillOnboard = () => {
    if (newSkillInput.trim() && !onboardSkills.includes(newSkillInput.trim())) {
      setOnboardSkills([...onboardSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleAddInterestOnboard = () => {
    if (newInterestInput.trim() && !onboardInterests.includes(newInterestInput.trim())) {
      setOnboardInterests([...onboardInterests, newInterestInput.trim()]);
      setNewInterestInput('');
    }
  };

  // Convert current path to active tab ID
  const getActiveTab = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'dashboard';
    return pathname.replace('/', '');
  };

  const activeTab = getActiveTab();

  const filteredCommandPosts = commandSearchQuery.trim() === '' 
    ? posts.slice(0, 3) 
    : posts.filter(p => 
        p.title.toLowerCase().includes(commandSearchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(commandSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(commandSearchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(commandSearchQuery.toLowerCase()))
      );

  // 1. DEDICATED LOGIN ROUTE RENDERING & ROUTE PROTECTION GATE
  React.useEffect(() => {
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#030303] flex items-center justify-center font-sans z-50 text-zinc-500 text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 rounded-full border border-primary border-t-transparent animate-spin"></div>
          <span className="font-extrabold text-[10px] text-zinc-400 uppercase tracking-widest animate-pulse">Initializing Security Session...</span>
        </div>
      </div>
    );
  }

  // 2. ACTIVE DASHBOARD VIEWPORT WITH SIDEBAR
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 flex font-sans relative overflow-hidden select-none">
      
      {/* Soft floating background gradients */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none animate-float" style={{animationDelay: '3s'}}></div>

      {/* Persistent Sidebar Router */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setSelectedFeedPost(null);
          router.push(`/${tab}`);
        }} 
        user={userProfile} 
        onLogout={handleLogout} 
      />

      {/* Unified Main Viewport */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Real-time Ticker Header */}
        <div className="bg-black/85 border-b border-white/5 py-2.5 px-6 overflow-hidden sticky top-0 backdrop-blur-md z-25 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0 border-r border-white/10 pr-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulseGlow shrink-0"></span>
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 flex items-center gap-1">
              Live updates
            </span>
          </div>
          
          <div className="flex-grow overflow-hidden relative w-full flex items-center">
            <div className="animate-ticker flex items-center gap-16 text-[10.5px] font-extrabold text-zinc-400">
              <span className="flex items-center gap-2 shrink-0">🚀 <span className="text-zinc-200">12 AIML students</span> just applied to Google Summer of Code</span>
              <span className="flex items-center gap-2 shrink-0">⚡ New faculty prep challenge added by <span className="text-zinc-200">Dr. Verma</span> in AI/DL lab</span>
              <span className="flex items-center gap-2 shrink-0">🏆 <span className="text-emerald-400">4 CSE students</span> unlocked direct Microsoft referrals via Priya Sharma</span>
              <span className="flex items-center gap-2 shrink-0">🔥 Campus Visibility Average increased to <span className="text-primary">76%</span> today</span>
              <span className="flex items-center gap-2 shrink-0">📢 Placement drive for Core Electronics scheduled for Friday morning</span>
              
              {/* Loop duplicates */}
              <span className="flex items-center gap-2 shrink-0">🚀 <span className="text-zinc-200">12 AIML students</span> just applied to Google Summer of Code</span>
              <span className="flex items-center gap-2 shrink-0">⚡ New faculty prep challenge added by <span className="text-zinc-200">Dr. Verma</span> in AI/DL lab</span>
              <span className="flex items-center gap-2 shrink-0">🏆 <span className="text-emerald-400">4 CSE students</span> unlocked direct Microsoft referrals via Priya Sharma</span>
              <span className="flex items-center gap-2 shrink-0">🔥 Campus Visibility Average increased to <span className="text-primary">76%</span> today</span>
              <span className="flex items-center gap-2 shrink-0">📢 Placement drive for Core Electronics scheduled for Friday morning</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 border-l border-white/10 pl-4">
            <button 
              onClick={() => setShowShortcutHelper(true)} 
              className="text-[9.5px] uppercase font-black text-zinc-400 hover:text-white bg-white/3 border border-white/5 hover:bg-white/5 py-1 px-2.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>⌘K / ? Shortcuts</span>
            </button>
          </div>
        </div>

        {/* Dynamic content rendering container */}
        <div className={`p-6 flex-1 min-h-0 w-full animate-stagger-1 ${pathname === '/chat' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          <div className="w-full flex-1 min-h-0 flex flex-col">
            {children}
          </div>
        </div>
      </main>

      {/* Command Search Palette Modal */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-panel border border-white/10 rounded-2xl p-5 flex flex-col gap-4 animate-scaleIn shadow-2xl relative">
            
            <div className="flex items-center gap-3 border-b border-white/5 pb-3">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <input 
                type="text"
                autoFocus
                value={commandSearchQuery}
                onChange={e => setCommandSearchQuery(e.target.value)}
                placeholder="Search anything (e.g. PyTorch, google, referral, dashboard)..."
                className="flex-grow bg-transparent text-sm text-white placeholder-zinc-500 border-none outline-none animate-fadeIn"
              />
              <button 
                onClick={() => setIsCommandPaletteOpen(false)}
                className="text-[10px] font-bold text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded"
              >
                ESC
              </button>
            </div>

            {/* command options */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-1">
              
              {/* Workspaces navigation list */}
              {commandSearchQuery.trim() === '' && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-500 px-1">Navigation Commands</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => { setSelectedFeedPost(null); setIsCommandPaletteOpen(false); router.push('/dashboard'); }}
                      className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <span>Go to Dashboard</span>
                      <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + d</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedFeedPost(null); setIsCommandPaletteOpen(false); router.push('/feed'); }}
                      className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <span>Go to Intel Feed</span>
                      <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + f</span>
                    </button>
                    <button 
                      onClick={() => { setIsCommandPaletteOpen(false); router.push('/network'); }}
                      className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <span>Go to Network Map</span>
                      <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + n</span>
                    </button>
                    <button 
                      onClick={() => { setIsCommandPaletteOpen(false); router.push('/ai-rec'); }}
                      className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <span>Go to AI Roadmaps</span>
                      <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + a</span>
                    </button>
                    {userProfile.role === 'admin' && (
                      <>
                        <button 
                          onClick={() => { setIsCommandPaletteOpen(false); router.push('/admin-panel'); }}
                          className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                        >
                          <span>Go to Verification Directory</span>
                          <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + v</span>
                        </button>
                        <button 
                          onClick={() => { setIsCommandPaletteOpen(false); router.push('/admin-posts'); }}
                          className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                        >
                          <span>Go to Intel Feed Moderation</span>
                          <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + m</span>
                        </button>
                        <button 
                          onClick={() => { setIsCommandPaletteOpen(false); router.push('/admin-placement'); }}
                          className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                        >
                          <span>Go to NIM Placement Bulletin</span>
                          <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + b</span>
                        </button>
                        <button 
                          onClick={() => { setIsCommandPaletteOpen(false); router.push('/admin-notifications'); }}
                          className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                        >
                          <span>Go to Notification Broadcaster</span>
                          <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + u</span>
                        </button>
                        <button 
                          onClick={() => { setIsCommandPaletteOpen(false); router.push('/admin-ticker'); }}
                          className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                        >
                          <span>Go to Live Ticker Control</span>
                          <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + t</span>
                        </button>
                        <button 
                          onClick={() => { setIsCommandPaletteOpen(false); router.push('/admin-roles'); }}
                          className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                        >
                          <span>Go to Role & Promotion Manager</span>
                          <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + r</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Opportunities search matches */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-zinc-500 px-1">Opportunities Intel</span>
                {filteredCommandPosts.length === 0 ? (
                  <span className="text-xs text-zinc-500 px-1">No matching opportunities found.</span>
                ) : (
                  filteredCommandPosts.map(post => (
                    <div 
                      key={post.id}
                      onClick={() => {
                        setSelectedFeedPost(post);
                        setIsCommandPaletteOpen(false);
                        router.push('/feed');
                      }}
                      className="p-3 rounded-xl bg-white/2 border border-white/5 hover:border-primary/30 hover:bg-white/4 transition-all cursor-pointer flex justify-between items-center gap-4 animate-fadeIn"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-primary">{post.category}</span>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{post.title}</h4>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-extrabold px-1.5 py-0.25 rounded bg-emerald-950/20 border border-emerald-500/10 shrink-0">
                        {post.matchScore || 85}% Match
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>

            <div className="border-t border-white/5 pt-3 text-[10px] text-zinc-500 font-bold flex justify-between items-center uppercase tracking-widest">
              <span>ESC to close modal</span>
              <span>Enter to select option</span>
            </div>

          </div>
        </div>
      )}

      {/* Modern Keyboard Shortcuts Helper Panel Modal */}
      {showShortcutHelper && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel border border-white/10 rounded-2xl p-5 flex flex-col gap-4 animate-scaleIn shadow-2xl relative">
            <h3 className="text-sm font-black text-white border-b border-white/5 pb-2.5">
              🚀 Keyboard Shortcuts Console
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-zinc-400">Open Command Palette</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">/  or  Ctrl+K</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-zinc-400">Go to Dashboard</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">G + D</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-zinc-400">Go to Senior Intel Feed</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">G + F</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-zinc-400">Go to Institutional Network Map</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">G + N</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-zinc-400">Go to AI Roadmap Engine</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">G + A</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/3">
                <span className="text-zinc-400">Go to AI Mentor Chat</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">G + C</span>
              </div>
              {userProfile.role === 'admin' && (
                <div className="flex justify-between items-center py-1 border-b border-white/3">
                  <span className="text-zinc-400">Go to Verification Hub</span>
                  <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">G + V</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Close active modal</span>
                <span className="text-white font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">ESC</span>
              </div>
            </div>

            <button 
              onClick={() => setShowShortcutHelper(false)}
              className="w-full mt-2 py-2 rounded-xl bg-primary hover:bg-primary/90 font-bold text-xs text-white transition-all hover:scale-101 cursor-pointer"
            >
              Understand & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
