import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Users,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Brain,
  AlertTriangle,
  Zap,
  Award
} from 'lucide-react';
import { Post, Notification, UserProfile } from '@/lib/types';
import { useApp } from '@/context/AppContext';

interface DashboardHomeProps {
  posts: Post[];
  notifications: Notification[];
  user: UserProfile;
  setActiveTab: (tab: string) => void;
  onSelectPost: (post: Post) => void;
  onAddPostClick: () => void;
}

export default function DashboardHome({ 
  posts, 
  notifications, 
  user, 
  setActiveTab, 
  onSelectPost,
  onAddPostClick
}: DashboardHomeProps) {
  const { handleLinkSSO } = useApp();

  const handleLinkSSOClick = (provider: 'google' | 'microsoft') => {
    handleLinkSSO(provider);
  };

  // Get trending senior intel (posts with high net upvotes)
  const trendingIntel = [...posts].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)).slice(0, 3);
  
  // Get upcoming deadlines (posts that have deadline property)
  const upcomingDeadlines = posts.filter(p => p.deadline).slice(0, 3);

  // Unread notifications
  const unreadNotifs = notifications.filter(n => !n.read).slice(0, 3);

  // Calculate dynamic Match Score based on profile skills
  const getMatchScore = (post: Post) => {
    if (post.matchScore) return post.matchScore;
    if (!post.tags || post.tags.length === 0) return 72;
    
    const matchedSkills = post.tags.filter(tag => 
      user.skills.some(skill => 
        skill.toLowerCase().includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    // Add branch compatibility bonus
    const branchBonus = post.branch.toLowerCase().includes(user.branch.toLowerCase()) || post.branch === 'All Branches' ? 10 : 0;
    const yearBonus = post.year === user.year ? 5 : 0;

    const baseScore = 65;
    const ratio = matchedSkills.length / post.tags.length;
    const calculated = Math.round(baseScore + (ratio * 20) + branchBonus + yearBonus);
    return Math.min(calculated, 98);
  };

  // Dynamic Campus Visibility Score calculation
  const getVisibilityScore = () => {
    const upvotedBonus = posts.filter(p => p.hasUpvoted).length * 8;
    const postsBonus = posts.length * 4;
    const profileProgress = Math.min((user.skills.length + user.interests.length) * 4, 30);
    const score = 38 + upvotedBonus + postsBonus + profileProgress;
    return Math.min(score, 100);
  };

  const visibilityScore = getVisibilityScore();

  const getVisibilityLevel = (score: number) => {
    if (score >= 85) return { label: 'Elite Connection', color: 'text-primary bg-primary/10 border border-primary/20' };
    if (score >= 65) return { label: 'Active Explorer', color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30' };
    return { label: 'Stealth Mode', color: 'text-zinc-500 bg-zinc-900 border-zinc-800' };
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-950/40 text-red-400 border border-red-500/30';
      case 'High': return 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
      case 'Medium': return 'bg-primary/10 text-primary border border-primary/20';
      default: return 'bg-zinc-800/40 text-zinc-400 border border-zinc-700/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Internships': return 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/20';
      case 'Placements': return 'text-blue-400 bg-blue-950/30 border border-blue-500/20';
      case 'Scholarships': return 'text-pink-400 bg-pink-950/30 border border-pink-500/20';
      case 'Faculty Tips': return 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/20';
      default: return 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn">
      
      {/* Dynamic Welcome Hero Banner */}
      <div className="relative p-6 md:p-8 rounded-2xl overflow-hidden glass-panel border border-white/5 bg-gradient-to-r from-primary/10 via-primary/5 to-black flex flex-col md:flex-row justify-between items-stretch gap-6 relative group transition-all duration-300">
        <div className="absolute -right-20 -top-20 w-56 h-56 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all duration-500"></div>
        <div className="absolute -left-20 -bottom-20 w-56 h-56 bg-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-all duration-500"></div>
        
        {/* Core Profile Copy */}
        <div className="flex-1 flex flex-col justify-between z-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] uppercase font-black tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-primary animate-spin" />
                {user.role === 'admin' ? 'Administration Node Active' : 'Active Institutional scanning'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Welcome back, {user.name} 👋
            </h2>
            <p className="text-zinc-400 text-xs mt-1.5 max-w-xl leading-relaxed">
              {user.role === 'admin' ? (
                <>
                  CampusOS directory databases online. There are <span className="text-primary font-semibold">{posts.length || 5} active intel bulletins</span> and multiple unverified student credentials awaiting verification audits.
                </>
              ) : (
                <>
                  CampusOS scanned <span className="text-primary font-semibold">{posts.length || 5} hidden Senior Channels</span>. 
                  Your active branch profile has <span className="text-emerald-400 font-semibold">{posts.filter(p => p.urgency === 'Critical' || p.urgency === 'High').length || 2} critical referral opportunities</span> active today.
                </>
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5 mt-2">
            {user.role === 'admin' ? (
              <>
                <button 
                  onClick={() => setActiveTab('admin-panel')}
                  className="glow-btn px-4.5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:scale-103 active:scale-97 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Launch Verification Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setActiveTab('feed')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-white/3 border border-white/5 hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Intel Moderation</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('ai-rec')}
                  className="glow-btn px-4.5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:scale-103 active:scale-97 transition-all"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Scan Neural Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-white/3 border border-white/5 hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <span>Consult AI Mentor</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Futuristic circular Visibility Score HUD */}
        <div className="shrink-0 flex items-center gap-4 bg-white/2 border border-white/5 p-4 rounded-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
          
          {/* Radial circular indicator */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                fill="transparent" 
                stroke="url(#primaryGrad)" 
                strokeWidth="4" 
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - (user.role === 'admin' ? 100 : visibilityScore) / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-sm font-black text-white">{user.role === 'admin' ? 100 : visibilityScore}%</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 z-10">
            <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">
              {user.role === 'admin' ? 'System Integrity' : 'Campus Visibility'}
            </span>
            {user.role === 'admin' ? (
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
                Node Secured
              </span>
            ) : (
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getVisibilityLevel(visibilityScore).color}`}>
                {getVisibilityLevel(visibilityScore).label}
              </span>
            )}
            <span className="text-[10px] text-zinc-400 mt-0.5 font-semibold">
              {user.role === 'admin' ? 'Clearance Level 4' : 'Active awareness score'}
            </span>
          </div>
        </div>

      </div>

      {/* 🔐 Post-Login SSO Prompt Banner */}
      {user.role !== 'admin' && !user.ssoLinked && (
        <div className="relative p-5 rounded-2xl overflow-hidden glass-panel border border-primary/20 bg-gradient-to-r from-emerald-950/20 via-black to-black flex flex-col md:flex-row justify-between items-center gap-4 relative group transition-all duration-300 animate-fadeIn">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 relative">
              <ShieldCheck className="w-5 h-5 text-primary animate-pulse" />
              <div className="absolute -inset-1 rounded-xl bg-primary/20 blur opacity-40"></div>
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                Portal Security Verification
                <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-widest font-extrabold animate-pulse">Pending</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-xl leading-relaxed">
                Unlock official placement compatibility indices and faculty tips by linking your institutional student profile with your verified **University SSO Identity**.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
            <button
              onClick={() => handleLinkSSOClick('google')}
              className="flex-1 md:flex-none py-2 px-4 rounded-xl text-[10px] uppercase font-black tracking-wider bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Link Google SSO</span>
            </button>
            <button
              onClick={() => handleLinkSSOClick('microsoft')}
              className="flex-1 md:flex-none py-2 px-4 rounded-xl text-[10px] uppercase font-black tracking-wider bg-white/[0.03] text-zinc-300 hover:text-white border border-white/5 hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-3 h-3" viewBox="0 0 23 23">
                <path fill="#f35325" d="M0 0h11v11H0z"/>
                <path fill="#80bb0a" d="M12 0h11v11H12z"/>
                <path fill="#00a1f1" d="M0 12h11v11H0z"/>
                <path fill="#ffb900" d="M12 12h11v11H12z"/>
              </svg>
              <span>Microsoft SSO</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Feed & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Quick Shortcuts */}
          <div className="grid grid-cols-3 gap-4">
            {user.role === 'admin' ? (
              <>
                <button 
                  onClick={() => setActiveTab('admin-panel')}
                  className="p-4 rounded-xl glass-panel border border-primary/20 bg-primary/5 text-left flex flex-col justify-between h-28 relative overflow-hidden group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                    <ShieldCheck className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-200 font-black">Verification Hub</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Manage credentials</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('feed')}
                  className="p-4 rounded-xl glass-panel text-left flex flex-col justify-between h-28 relative overflow-hidden group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-all">
                    <Flame className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-300 font-bold">Intel Moderation</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{posts.length || 0} active bulletins</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('heatmap')}
                  className="p-4 rounded-xl glass-panel text-left flex flex-col justify-between h-28 relative overflow-hidden group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-all">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-300 font-bold">Campus Analytics</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Placement heatmaps</p>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('feed')}
                  className="p-4 rounded-xl glass-panel text-left flex flex-col justify-between h-28 relative overflow-hidden group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-all">
                    <Flame className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-300 font-bold">Senior Feed</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Explore {posts.length || 5} active leads</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveTab('chat')}
                  className="p-4 rounded-xl glass-panel text-left flex flex-col justify-between h-28 relative overflow-hidden group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-all">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-300 font-bold">AI Mentor Chat</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Custom placement prep</p>
                  </div>
                </button>

                <button 
                  onClick={onAddPostClick}
                  className="p-4 rounded-xl glass-panel border border-primary/20 bg-primary/5 text-left flex flex-col justify-between h-28 relative overflow-hidden group transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-200 font-black">Post Intel</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Contribute & earn badges</p>
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Trending Intelligence Feed */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">Verified Intel Streams</h3>
              </div>
              <button 
                onClick={() => setActiveTab('feed')} 
                className="text-xs text-primary hover:text-primary-foreground flex items-center gap-0.5 transition-all font-semibold"
              >
                <span>View all feed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {trendingIntel.length === 0 ? (
                <div className="text-center py-10 rounded-2xl glass-panel border border-white/5 text-zinc-500 text-xs">
                  Feed currently empty. Preload demo or load database seeds.
                </div>
              ) : (
                trendingIntel.map((post) => {
                  const match = getMatchScore(post);
                  return (
                    <div 
                      key={post.id}
                      onClick={() => onSelectPost(post)}
                      className="p-4 rounded-xl glass-panel transition-all duration-200 cursor-pointer flex flex-col gap-3 border border-white/5 relative overflow-hidden group hover:translate-x-1"
                    >
                      <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                      
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider ${getUrgencyColor(post.urgency)}`}>
                              {post.urgency}
                            </span>
                            
                            {/* Glowing compatibility indicator */}
                            <span className="text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 shadow-sm flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                              {match}% Match
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-100 group-hover:text-primary transition-colors leading-tight">
                            {post.title}
                          </h4>
                        </div>
                        
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                            ▲ {post.upvotes - post.downvotes}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>

                      <div className="flex justify-between items-center border-t border-white/5 pt-2.5 mt-1 text-[10px] text-zinc-500">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-zinc-300">{post.author.name}</span>
                          <span className="text-[8px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1 py-0.25 rounded">
                            {post.author.badge}
                          </span>
                        </div>

                        <span className="text-zinc-500 font-semibold group-hover:text-zinc-300 transition-colors">
                          {post.commentsCount} replies • Click to view →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines & Dynamic AI Alerts */}
        <div className="flex flex-col gap-6">
          
          {/* Upcoming Deadlines */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Calendar className="w-4 h-4 text-pink-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Critical Deadlines</h3>
            </div>

            <div className="flex flex-col gap-3">
              {upcomingDeadlines.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  No upcoming deadlines detected.
                </div>
              ) : (
                upcomingDeadlines.map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="p-3 rounded-xl bg-white/3 border border-white/5 hover:border-pink-500/30 transition-all cursor-pointer flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-pink-400 bg-pink-950/30 border border-pink-500/20">
                        {post.category}
                      </span>
                      <span className="text-[9px] text-rose-400 font-bold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 animate-pulse" />
                        Due: {post.deadline}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-200 line-clamp-1">{post.title}</h4>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 🚨 Dynamic Emotional AI Alerts Center */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">AI Engagement Scanner</h3>
              </div>
              {unreadNotifs.length > 0 && (
                <span className="text-[8px] font-extrabold text-red-400 bg-red-950/40 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">
                  Urgent alerts
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  No scan triggers. Enable Demo mode to review.
                </div>
              ) : (
                notifications.slice(0, 3).map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition-all hover:-translate-y-0.25 duration-200 ${
                      notif.type === 'deadline' 
                        ? 'bg-red-950/15 border-red-500/25 text-zinc-200 shadow-md shadow-red-950/10' 
                        : 'bg-white/3 border-white/5 text-zinc-400'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-200 flex items-center gap-1.5">
                        {notif.type === 'deadline' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>}
                        {notif.type === 'trending' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                        {notif.type === 'alert' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>}
                        {notif.title}
                      </span>
                      {notif.timeRemaining && (
                        <span className="text-[9px] text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.25 rounded border border-amber-500/20 animate-pulse">{notif.timeRemaining}</span>
                      )}
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-zinc-400 font-medium">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
