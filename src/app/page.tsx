'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Cpu, 
  Rss, 
  TrendingUp, 
  User, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  LockKeyhole,
  CheckSquare
} from 'lucide-react';

import { UserProfile, Post, Notification } from '@/lib/types';
import { MOCK_POSTS, MOCK_NOTIFICATIONS, INITIAL_USER, DEMO_PRELOAD_STATE } from '@/lib/mockData';

// Custom components
import Sidebar from '@/components/Sidebar';
import DashboardHome from '@/components/DashboardHome';
import IntelFeed from '@/components/IntelFeed';
import AIRecommendations from '@/components/AIRecommendations';
import AIMentor from '@/components/AIMentor';
import Leaderboard from '@/components/Leaderboard';
import OpportunityHeatmap from '@/components/OpportunityHeatmap';
import ProfileSettings from '@/components/ProfileSettings';
import NetworkVisualization from '@/components/NetworkVisualization';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  // Authentication & Onboarding States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'onboarding'>('login');
  const [loginPath, setLoginPath] = useState<'student' | 'judge' | 'institutional'>('judge');
  
  // Login Form States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Onboarding Form States
  const [onboardName, setOnboardName] = useState('');
  const [onboardBranch, setOnboardBranch] = useState('Computer Science & Engineering');
  const [onboardYear, setOnboardYear] = useState<number>(3);
  const [onboardSkills, setOnboardSkills] = useState<string[]>(['React', 'Next.js', 'Python']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [onboardInterests, setOnboardInterests] = useState<string[]>(['Artificial Intelligence', 'Full Stack Development']);
  const [newInterestInput, setNewInterestInput] = useState('');

  // Active Workspace State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedFeedPost, setSelectedFeedPost] = useState<Post | null>(null);

  // Command Palette & Keyboard Shortcuts States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearchQuery, setCommandSearchQuery] = useState('');
  const [showShortcutHelper, setShowShortcutHelper] = useState(false);

  // Keyboard shortcut listener hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut sequences inside input elements
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true');

      if (isInputFocused) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsCommandPaletteOpen(false);
          setShowShortcutHelper(false);
          (activeEl as HTMLElement).blur();
        }
        return;
      }

      // 1. Focus Search Palette on "/" or Ctrl+K / Cmd+K
      if (e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      // 2. Escape closes all modals
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsCommandPaletteOpen(false);
        setShowShortcutHelper(false);
      }

      // 3. Shortcut Helper on "?"
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcutHelper(prev => !prev);
      }

      // 4. Sequence hotkeys: "g" -> target
      if (e.key === 'g' || e.key === 'G') {
        const handleSequence = (nextEvent: KeyboardEvent) => {
          const k = nextEvent.key.toLowerCase();
          if (k === 'd') { setActiveTab('dashboard'); setSelectedFeedPost(null); }
          else if (k === 'f') { setActiveTab('feed'); setSelectedFeedPost(null); }
          else if (k === 'n') { setActiveTab('network'); }
          else if (k === 'a') { setActiveTab('ai-rec'); }
          else if (k === 'c') { setActiveTab('chat'); }
          else if (k === 'l') { setActiveTab('leaderboard'); }
          else if (k === 'h') { setActiveTab('heatmap'); }
          else if (k === 'p') { setActiveTab('profile'); }
          
          window.removeEventListener('keydown', handleSequence);
        };
        window.addEventListener('keydown', handleSequence);
        setTimeout(() => {
          window.removeEventListener('keydown', handleSequence);
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load from local storage
  useEffect(() => {
    const cachedProfile = localStorage.getItem('campusos_profile');
    const cachedPosts = localStorage.getItem('campusos_posts');
    const cachedAuth = localStorage.getItem('campusos_auth');

    if (cachedProfile) {
      setUserProfile(JSON.parse(cachedProfile));
    }
    if (cachedPosts) {
      setPosts(JSON.parse(cachedPosts));
    }
    if (cachedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state helpers
  const saveProfileState = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('campusos_profile', JSON.stringify(profile));
  };

  const savePostsState = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('campusos_posts', JSON.stringify(updatedPosts));
  };

  const handleDemoLogin = () => {
    saveProfileState(DEMO_PRELOAD_STATE.user);
    savePostsState(DEMO_PRELOAD_STATE.posts);
    setNotifications(DEMO_PRELOAD_STATE.notifications);
    setIsAuthenticated(true);
    localStorage.setItem('campusos_auth', 'true');
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setAuthStep('onboarding');
  };

  // Onboarding handler
  const handleOnboardingComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim()) return;

    const newProfile: UserProfile = {
      id: `u-${Date.now()}`,
      name: onboardName,
      email: emailInput || 'demo@university.edu',
      role: 'student',
      branch: onboardBranch,
      year: onboardYear,
      skills: onboardSkills,
      interests: onboardInterests,
      credibilityScore: 42,
      badge: 'Rookie'
    };

    saveProfileState(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('campusos_auth', 'true');
  };

  // Sign out handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthStep('login');
    localStorage.removeItem('campusos_auth');
  };

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

  // Feed handlers
  const handleAddPost = (newPostData: Omit<Post, 'id' | 'createdAt' | 'author' | 'upvotes' | 'downvotes' | 'commentsCount'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      commentsCount: 0,
      author: {
        id: userProfile.id,
        name: userProfile.name,
        avatarUrl: userProfile.avatarUrl,
        role: userProfile.role === 'senior' ? 'Senior (4th Year)' : 'Student',
        credibilityScore: userProfile.credibilityScore,
        badge: userProfile.badge
      }
    };

    const updated = [newPost, ...posts];
    savePostsState(updated);

    // Trigger notification
    const newAlert: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Intel Shared successfully!',
      message: `Your post "${newPostData.title}" has been published to the Senior Feed.`,
      type: 'alert',
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications([newAlert, ...notifications]);
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    const updated = posts.map(post => {
      if (post.id !== postId) return post;
      
      let upvoteDiff = 0;
      let downvoteDiff = 0;
      let hasUpvoted = post.hasUpvoted;
      let hasDownvoted = post.hasDownvoted;

      if (voteType === 'up') {
        if (hasUpvoted) {
          upvoteDiff = -1;
          hasUpvoted = false;
        } else {
          upvoteDiff = 1;
          hasUpvoted = true;
          if (hasDownvoted) {
            downvoteDiff = -1;
            hasDownvoted = false;
          }
        }
      } else {
        if (hasDownvoted) {
          downvoteDiff = -1;
          hasDownvoted = false;
        } else {
          downvoteDiff = 1;
          hasDownvoted = true;
          if (hasUpvoted) {
            upvoteDiff = -1;
            hasUpvoted = false;
          }
        }
      }

      return {
        ...post,
        upvotes: post.upvotes + upvoteDiff,
        downvotes: post.downvotes + downvoteDiff,
        hasUpvoted,
        hasDownvoted
      };
    });

    savePostsState(updated);
    
    // Update selectedPost state if open
    if (selectedFeedPost && selectedFeedPost.id === postId) {
      const match = updated.find(p => p.id === postId);
      if (match) setSelectedFeedPost(match);
    }
  };

  const handleAddComment = (postId: string, content: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1
        };
      }
      return post;
    });
    savePostsState(updated);

    if (selectedFeedPost && selectedFeedPost.id === postId) {
      setSelectedFeedPost(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
    }
  };

  // Rendering dashboard workspace tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardHome 
            posts={posts} 
            notifications={notifications} 
            user={userProfile} 
            setActiveTab={setActiveTab}
            onSelectPost={(post) => {
              setSelectedFeedPost(post);
              setActiveTab('feed');
            }}
            onAddPostClick={() => {
              setActiveTab('feed');
            }}
          />
        );
      case 'feed':
        return (
          <IntelFeed 
            posts={posts}
            user={userProfile}
            onAddPost={handleAddPost}
            onVote={handleVote}
            onAddComment={handleAddComment}
            selectedPost={selectedFeedPost}
            setSelectedPost={setSelectedFeedPost}
          />
        );
      case 'network':
        return <NetworkVisualization />;
      case 'ai-rec':
        return <AIRecommendations user={userProfile} />;
      case 'chat':
        return <AIMentor user={userProfile} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'heatmap':
        return <OpportunityHeatmap />;
      case 'profile':
        return <ProfileSettings user={userProfile} onUpdateProfile={saveProfileState} />;
      default:
        return <div className="text-zinc-400 text-xs">Tab coming soon</div>;
    }
  };

  // ONBOARDING GATE
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

              {/* Breathtaking Role/Pathway selector tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLoginPath('judge')}
                  className={`py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all ${
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
                  className={`py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all ${
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
                  className={`py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all ${
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
                    {/* Google SVG logo */}
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

          {/* STAGE 2: Core Onboarding (Fields requested by User) */}
          {authStep === 'onboarding' && (
            <form onSubmit={handleOnboardingComplete} className="flex flex-col gap-5 animate-fadeIn">
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <h2 className="text-lg font-black text-white">Scan Student Profile Parameters</h2>
                <p className="text-zinc-400 text-xs">This feeds the NVIDIA NIM AI scanner to generate matching career paths.</p>
              </div>

              <div className="flex flex-col gap-4 border-y border-white/5 py-4">
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

                {/* Skills tags onboarding list */}
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
                      className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
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

                {/* Interests tags onboarding list */}
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
                      className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
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

  // ACTIVE DASHBOARD LAYOUT
  const filteredCommandPosts = commandSearchQuery.trim() === '' 
    ? posts.slice(0, 3) 
    : posts.filter(p => 
        p.title.toLowerCase().includes(commandSearchQuery.toLowerCase()) || 
        p.description.toLowerCase().includes(commandSearchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(commandSearchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(commandSearchQuery.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 flex font-sans relative overflow-hidden select-none">
      
      {/* Soft floating dynamic background gradients */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none animate-float" style={{animationDelay: '3s'}}></div>

      {/* Side collapsible navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedFeedPost(null); // Reset when navigating tabs
        }} 
        user={userProfile} 
        onLogout={handleLogout} 
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto relative z-10">
        
        {/* Real-time Campus Activity Ticker */}
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

        {/* Content Box with stagger classes */}
        <div className="p-6 flex-1 flex flex-col justify-center items-center animate-stagger-1 w-full">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center items-center">
            {renderTabContent()}
          </div>
        </div>
      </main>

      {/* 1. Sleek Command Palette style Search Modal */}
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
                      onClick={() => { setActiveTab('dashboard'); setSelectedFeedPost(null); setIsCommandPaletteOpen(false); }}
                      className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <span>Go to Dashboard</span>
                      <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + d</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('feed'); setSelectedFeedPost(null); setIsCommandPaletteOpen(false); }}
                      className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <span>Go to Intel Feed</span>
                      <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + f</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('network'); setIsCommandPaletteOpen(false); }}
                      className="p-2.5 rounded-xl bg-white/2 border border-white/5 hover:border-primary/25 hover:bg-white/4 text-left text-xs font-semibold text-zinc-200 transition-all flex justify-between items-center cursor-pointer"
                    >
                      <span>Go to Network Map</span>
                      <span className="text-[9px] text-zinc-500 font-bold bg-zinc-950 px-1.5 py-0.25 rounded border border-zinc-900">g + n</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('ai-rec'); setIsCommandPaletteOpen(false); }}
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
                        setActiveTab('feed');
                        setIsCommandPaletteOpen(false);
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

      {/* 2. Modern Keyboard Shortcuts Helper Panel Modal */}
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
