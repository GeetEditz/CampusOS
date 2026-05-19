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

export default function Home() {
  // Authentication & Onboarding States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'onboarding'>('login');
  
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Stellar Background */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none"></div>
        
        {/* Multi-step Forms Panel */}
        <div className="w-full max-w-xl glass-panel border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 flex flex-col gap-6">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg">
              <BookOpen className="w-4 h-4 text-white" />
              <div className="absolute -inset-1 rounded-xl bg-indigo-500/30 blur opacity-40"></div>
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
            <form onSubmit={handleLogin} className="flex flex-col gap-5 animate-fadeIn">
              <div className="flex flex-col gap-1.5 text-center sm:text-left">
                <h2 className="text-lg font-black text-white">Unlock Senior Intelligence</h2>
                <p className="text-zinc-400 text-xs mt-0.5">Democratizing unadvertised student referrals and faculty tips.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Google / University SSO</label>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailInput('arjun.mehta@university.edu');
                      setAuthStep('onboarding');
                    }}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs transition-all hover:bg-zinc-200 active:scale-98"
                  >
                    {/* Google SVG logo */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>SSO Google Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition-all hover:scale-101 active:scale-99 border border-indigo-500/30 shadow-md shadow-indigo-950/20 mt-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>One-Click Demo/Judge Portal Login</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-[1px] bg-white/5"></div>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider shrink-0">or use credentials</span>
                  <div className="flex-1 h-[1px] bg-white/5"></div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Institutional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                    <input 
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
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-white/3 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white glass-input placeholder-zinc-600"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="glow-btn w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-101 transition-all"
              >
                <span>Access Network Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
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
                  <input 
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
                    <input 
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
                    <input 
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
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests tags onboarding list */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Primary Interests</label>
                  <div className="flex gap-2">
                    <input 
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
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-purple-950/40 text-purple-400 border border-purple-500/20 font-bold">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              <button
                type="submit"
                className="glow-btn w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 hover:scale-101 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Initialize AI Operating System</span>
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // ACTIVE DASHBOARD LAYOUT
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 flex font-sans">
      
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
      <main className="flex-1 min-w-0 flex flex-col p-6 overflow-y-auto">
        {renderTabContent()}
      </main>

    </div>
  );
}
