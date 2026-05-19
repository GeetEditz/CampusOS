'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  Mail, 
  LockKeyhole, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  const router = useRouter();
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
    handleDemoLogin,
    handleLogin,
    handleOnboardingComplete
  } = useApp();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Onboarding tags helpers
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

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-xs">
        Redirecting to dashboard...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 overflow-hidden font-sans z-50">
      {/* Stellar Background */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-teal-600/5 blur-[150px] pointer-events-none"></div>
      
      {/* Multi-step Forms Panel */}
      <div className="w-full max-w-xl glass-panel border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col gap-6">
        
        {/* Logo Header */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/white-logo-no-bg.png" alt="CampusOS Logo" className="w-6 h-6 object-contain" />
            <div className="absolute -inset-1 rounded-xl bg-white/10 blur opacity-30"></div>
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
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
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

            {/* View 2: Student SSO Pathway */}
            {loginPath === 'student' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4 animate-fadeIn">
                
                {/* Auth Mode Toggle */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                    className={`py-2 text-[9px] uppercase font-extrabold tracking-wider rounded-lg transition-all cursor-pointer ${
                      authMode === 'signin' 
                        ? 'bg-primary text-primary-foreground shadow-md scale-[1.01]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    className={`py-2 text-[9px] uppercase font-extrabold tracking-wider rounded-lg transition-all cursor-pointer ${
                      authMode === 'signup' 
                        ? 'bg-primary text-primary-foreground shadow-md scale-[1.01]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Auth Error Banner */}
                {authError && (
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-[10px] text-red-400 font-bold leading-relaxed animate-fadeIn shrink-0">
                    ⚠️ {authError}
                  </div>
                )}

                <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.015] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[8px] font-black uppercase tracking-widest rounded-bl-lg border-l border-b border-zinc-700/50">
                    Student Portal
                  </div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {authMode === 'signin' ? 'Student Credentials' : 'Register Student Profile'}
                  </label>
                  
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Student Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <Input 
                        type="email" 
                        value={emailInput}
                        onChange={e => { setEmailInput(e.target.value); setAuthError(''); }}
                        placeholder="e.g. arjun@university.edu" 
                        className="w-full bg-white/3 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white glass-input placeholder-zinc-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      {authMode === 'signin' ? 'Portal Password' : 'Create Portal Password'}
                    </label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <Input 
                        type="password" 
                        value={passwordInput}
                        onChange={e => { setPasswordInput(e.target.value); setAuthError(''); }}
                        placeholder="••••••••" 
                        className="w-full bg-white/3 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white glass-input placeholder-zinc-600"
                        required={authMode === 'signup'}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="glow-btn w-full h-10 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-101 transition-all"
                  >
                    <span>{authMode === 'signin' ? 'Access Student Workspace' : 'Proceed to Profile Setup'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </form>
            )}

            {/* View 3: Institutional Pathway */}
            {loginPath === 'institutional' && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4 animate-fadeIn">
                
                {/* Auth Mode Toggle */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                    className={`py-2 text-[9px] uppercase font-extrabold tracking-wider rounded-lg transition-all cursor-pointer ${
                      authMode === 'signin' 
                        ? 'bg-primary text-primary-foreground shadow-md scale-[1.01]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                    className={`py-2 text-[9px] uppercase font-extrabold tracking-wider rounded-lg transition-all cursor-pointer ${
                      authMode === 'signup' 
                        ? 'bg-primary text-primary-foreground shadow-md scale-[1.01]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Auth Error Banner */}
                {authError && (
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-[10px] text-red-400 font-bold leading-relaxed animate-fadeIn shrink-0">
                    ⚠️ {authError}
                  </div>
                )}

                <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.015] border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[8px] font-black uppercase tracking-widest rounded-bl-lg border-l border-b border-zinc-700/50">
                    College Directory
                  </div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {authMode === 'signin' ? 'Enterprise Credentials' : 'Register New Student Account'}
                  </label>
                  
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Institutional Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <Input 
                        type="email" 
                        value={emailInput}
                        onChange={e => { setEmailInput(e.target.value); setAuthError(''); }}
                        placeholder="e.g. arjun@university.edu" 
                        className="w-full bg-white/3 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white glass-input placeholder-zinc-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      {authMode === 'signin' ? 'Portal Password' : 'Create Portal Password'}
                    </label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <Input 
                        type="password" 
                        value={passwordInput}
                        onChange={e => { setPasswordInput(e.target.value); setAuthError(''); }}
                        placeholder="••••••••" 
                        className="w-full bg-white/3 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white glass-input placeholder-zinc-600"
                        required={authMode === 'signup'}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="glow-btn w-full h-10 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-101 transition-all"
                  >
                    <span>{authMode === 'signin' ? 'Access Network Portal' : 'Proceed to Profile Setup'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                  <p className="text-[10px] text-zinc-600 font-medium text-center leading-relaxed">
                    {authMode === 'signin' 
                      ? '🔐 Enter your email and password to resume your college career index.'
                      : '✨ Type email and secure password, then configure profile department and skills.'
                    }
                  </p>
                </div>
              </form>
            )}

            {/* Watch Demo Tour link */}
            <div className="border-t border-white/5 pt-4 mt-2 flex flex-col items-center">
              <Link href="/video" className="group text-xs text-zinc-400 hover:text-white transition-all flex items-center gap-2 font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Watch the CampusOS Video Demo Tour</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        )}

        {/* STAGE 2: Core Onboarding */}
        {authStep === 'onboarding' && (
          <form onSubmit={handleOnboardingComplete} className="flex flex-col gap-5 animate-fadeIn">
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <h2 className="text-lg font-black text-white">
                {loginPath === 'institutional' ? 'Configure Institutional Node' : 'Scan Student Profile Parameters'}
              </h2>
              <p className="text-zinc-400 text-xs">
                {loginPath === 'institutional' 
                  ? 'This calibrates the NVIDIA NIM AI engines for placement drive oversight and security auditing.'
                  : 'This feeds the NVIDIA NIM AI scanner to generate matching career paths.'}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-y border-white/5 py-4 overflow-y-auto max-h-[350px] pr-1">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Full Name</label>
                <Input 
                  type="text" 
                  value={onboardName}
                  onChange={e => setOnboardName(e.target.value)}
                  placeholder={loginPath === 'institutional' ? "e.g. Dr. Ramesh Gupta" : "e.g. Arjun Mehta"} 
                  className="w-full bg-white/3 border border-white/5 rounded-xl p-2.5 text-xs text-white glass-input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {loginPath === 'institutional' ? 'Managing Division' : 'Eligible Department'}
                  </label>
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
                    {loginPath === 'institutional' && (
                      <option value="Placement & Training Cell">Placement & Training Cell</option>
                    )}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {loginPath === 'institutional' ? 'Administrative Clearance' : 'B.Tech Year'}
                  </label>
                  {loginPath === 'institutional' ? (
                    <select
                      value={onboardYear}
                      onChange={e => setOnboardYear(Number(e.target.value))}
                      className="bg-zinc-950 border border-white/5 rounded-xl p-2.5 text-xs text-zinc-300 font-semibold"
                    >
                      <option value={1}>Tier 1: Department HOD</option>
                      <option value={2}>Tier 2: Faculty Advisor</option>
                      <option value={3}>Tier 3: Training & Placement Lead</option>
                      <option value={4}>Tier 4: College Director / Dean</option>
                    </select>
                  ) : (
                    <Input 
                      type="number" 
                      value={onboardYear}
                      onChange={e => setOnboardYear(Number(e.target.value))}
                      min={1}
                      max={4}
                      className="w-full bg-white/3 border border-white/5 rounded-xl p-2.5 text-xs text-white glass-input"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Skills tags */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  {loginPath === 'institutional' ? 'Focus Domains / Areas' : 'Skills tags'}
                </label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    placeholder={loginPath === 'institutional' ? "e.g. Placement Auditing, Faculty Tips" : "e.g. PyTorch, React, Java"} 
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
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  {loginPath === 'institutional' ? 'Administrative Priorities' : 'Primary Interests'}
                </label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    value={newInterestInput}
                    onChange={e => setNewInterestInput(e.target.value)}
                    placeholder={loginPath === 'institutional' ? "e.g. Anti-Spam Verification, Placement Drive" : "e.g. AI Research, Placements"} 
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
              <span>{loginPath === 'institutional' ? 'Initialize Administration Dashboard' : 'Initialize AI Operating System'}</span>
            </Button>
          </form>
        )}

      </div>
    </div>
  );
}
