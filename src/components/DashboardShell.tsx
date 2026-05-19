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

  // 1. ONBOARDING / LOGIN GATE
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center p-4 overflow-hidden font-sans z-50">
        {/* Stellar Background */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-teal-600/5 blur-[150px] pointer-events-none"></div>
        
        {/* Multi-step Forms Panel */}
        <div className="w-full max-w-xl glass-panel border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col gap-6">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-lg">
              <BookOpen className="w-4 h-4" />
              <div className="absolute -inset-1 rounded-xl bg-primary/30 blur opacity-40"></div>
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                CampusOS
              </h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">AI College Opportunity Network</p>
            </div>
          </div>

          {/* STAGE 1: Standard Credential Gate */}
          {authStep === 'login' && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <h2 className="text-lg font-black text-white">Unlock Senior Intelligence</h2>
                <p className="text-zinc-400 text-xs mt-0.5">Democratizing unadvertised student referrals and faculty tips.</p>
              </div>

              {/* Role/Pathway selector tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLoginPath('judge')}
                  className={`py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all cursor-pointer ${
                    loginPath === 'judge' 
                      ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  Judge Demo
                </button>
                <button
                  type="button"
                  onClick={() => setLoginPath('student')}
                  className={`py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all cursor-pointer ${
                    loginPath === 'student' 
                      ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  Student SSO
                </button>
                <button
                  type="button"
                  onClick={() => setLoginPath('institutional')}
                  className={`py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all cursor-pointer ${
                    loginPath === 'institutional' 
                      ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  Institutional
                </button>
              </div>

              {/* View 1: Judge Demo Pathway */}
              {loginPath === 'judge' && (
                <div className="flex flex-col gap-3.5 p-4 rounded-xl bg-primary/3 border border-primary/10 relative overflow-hidden animate-fadeIn">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary/20 text-primary-foreground text-[8px] font-black uppercase tracking-widest rounded-bl-lg border-l border-b border-primary/20 animate-pulse">
                    Recommended
                  </div>
                  <label className="text-[10px] text-primary font-bold uppercase tracking-wider">Fast Evaluation Pathway</label>
                  <h3 className="text-xs font-bold text-white leading-relaxed">Instantly unlocks pre-loaded student portfolio, real-time metrics, & network visualizer.</h3>
                  <Button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs transition-all hover:scale-101 active:scale-99 border border-primary/30 shadow-md shadow-emerald-950/20 hover:opacity-90 mt-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>One-Click Demo/Judge Portal Login</span>
                  </Button>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                    ⚡ Bypasses onboarding to instantly demonstrate placements, compatibility indices, and SVG active directory. Ideal for rapid hackathon pitches.
                  </p>
                </div>
              )}

              {/* View 2: Student SSO Pathway */}
              {loginPath === 'student' && (
                <div className="flex flex-col gap-3.5 p-4 rounded-xl bg-white/[0.015] border border-white/5 relative overflow-hidden animate-fadeIn">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[8px] font-black uppercase tracking-widest rounded-bl-lg border-l border-b border-zinc-700/50">
                    AI Onboarding Flow
                  </div>
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">SSO Sign-In</label>
                  <h3 className="text-xs font-bold text-white leading-relaxed">Launches custom profile onboarding fields and initializes AI opportunities generator.</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEmailInput('arjun.mehta@university.edu');
                      setAuthStep('onboarding');
                    }}
                    className="w-full flex items-center justify-center gap-2.5 h-10 rounded-xl bg-white text-black font-semibold text-xs transition-all hover:bg-zinc-200 active:scale-98 mt-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>SSO Google Login</span>
                  </Button>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                    💡 Displays how the campus crawler and NVIDIA NIM AI build customized career matches for newly registered users.
                  </p>
                </div>
              )}

              {/* View 3: Institutional Pathway */}
              {loginPath === 'institutional' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-4 animate-fadeIn">
                  <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.015] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[8px] font-black uppercase tracking-widest rounded-bl-lg border-l border-b border-zinc-700/50">
                      College Directory
                    </div>
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Enterprise Credentials</label>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Institutional Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <Input 
                          type="email" 
                          value={emailInput}
                          onChange={e => setEmailInput(e.target.value)}
                          placeholder="e.g. arjun@university.edu" 
                          className="w-full bg-white/3 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white glass-input placeholder-zinc-600"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Portal Password</label>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <Input 
                          type="password" 
                          value={passwordInput}
                          onChange={e => setPasswordInput(e.target.value)}
                          placeholder="••••••••" 
                          className="w-full bg-white/3 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white glass-input placeholder-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="glow-btn w-full h-10 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-101 transition-all"
                    >
                      <span>Access Network Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                    <p className="text-[10px] text-zinc-600 font-medium text-center leading-relaxed">
                      🔐 Standard credentials login matching university profiles in the database.
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STAGE 2: Core Onboarding */}
          {authStep === 'onboarding' && (
            <form onSubmit={handleOnboardingComplete} className="flex flex-col gap-5 animate-fadeIn">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <h2 className="text-lg font-black text-white">Scan Student Profile Parameters</h2>
                <p className="text-zinc-400 text-xs">This feeds the NVIDIA NIM AI scanner to generate matching career paths.</p>
              </div>

              <div className="flex flex-col gap-4 border-y border-white/5 py-4 overflow-y-auto max-h-[350px] pr-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Full Name</label>
                  <Input 
                    type="text" 
                    value={onboardName}
                    onChange={e => setOnboardName(e.target.value)}
                    placeholder="e.g. Arjun Mehta" 
                    className="w-full bg-white/3 border border-white/5 rounded-xl p-2.5 text-xs text-white glass-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Eligible Department</label>
                    <select
                      value={onboardBranch}
                      onChange={e => setOnboardBranch(e.target.value)}
                      className="bg-zinc-950 border border-white/5 rounded-xl p-2.5 text-xs text-zinc-300 font-semibold"
                    >
                      <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                      <option value="Electronics & Communication">Electronics (ECE)</option>
                      <option value="Information Technology">Information Tech (IT)</option>
                      <option value="Electrical Engineering">Electrical (EE)</option>
                      <option value="Mechanical Engineering">Mechanical (ME)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">B.Tech Year</label>
                    <Input 
                      type="number" 
                      value={onboardYear}
                      onChange={e => setOnboardYear(Number(e.target.value))}
                      min={1}
                      max={4}
                      className="w-full bg-white/3 border border-white/5 rounded-xl p-2.5 text-xs text-white glass-input"
                      required
                    />
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Skills tags</label>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      value={newSkillInput}
                      onChange={e => setNewSkillInput(e.target.value)}
                      placeholder="e.g. PyTorch, React, Java" 
                      className="flex-grow bg-white/3 border border-white/5 rounded-xl p-2 text-xs text-white glass-input"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddSkillOnboard}
                      className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {onboardSkills.map(s => (
                      <Badge key={s} variant="secondary" className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] px-2 py-0.5 rounded-lg">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Interests tags */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Primary Interests</label>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      value={newInterestInput}
                      onChange={e => setNewInterestInput(e.target.value)}
                      placeholder="e.g. AI Research, Placements" 
                      className="flex-grow bg-white/3 border border-white/5 rounded-xl p-2 text-xs text-white glass-input"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddInterestOnboard}
                      className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-xl px-3 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {onboardInterests.map(i => (
                      <Badge key={i} variant="secondary" className="bg-teal-950/40 text-teal-400 border border-teal-500/20 font-bold text-[10px] px-2 py-0.5 rounded-lg">
                        {i}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="glow-btn w-full h-10 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-101 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Initialize AI Operating System</span>
              </Button>
            </form>
          )}

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
        <div className={`p-6 flex-1 min-h-0 w-full animate-stagger-1 ${pathname === '/chat' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className="w-full h-full">
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
