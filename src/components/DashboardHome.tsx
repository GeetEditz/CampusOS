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
  FileCheck
} from 'lucide-react';
import { Post, Notification, UserProfile } from '@/lib/types';

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
  // Get trending senior intel (posts with high upvotes)
  const trendingIntel = [...posts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
  
  // Get upcoming deadlines (posts that have deadline property)
  const upcomingDeadlines = posts.filter(p => p.deadline).slice(0, 3);

  // Unread notifications
  const unreadNotifs = notifications.filter(n => !n.read).slice(0, 3);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-950/40 text-red-400 border border-red-500/30';
      case 'High': return 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
      case 'Medium': return 'bg-indigo-950/40 text-indigo-400 border border-indigo-500/20';
      default: return 'bg-zinc-800/40 text-zinc-400 border border-zinc-700/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Internships': return 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/20';
      case 'Placements': return 'text-blue-400 bg-blue-950/30 border border-blue-500/20';
      case 'Scholarships': return 'text-pink-400 bg-pink-950/30 border border-pink-500/20';
      case 'Faculty Tips': return 'text-purple-400 bg-purple-950/30 border border-purple-500/20';
      default: return 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative p-6 rounded-2xl overflow-hidden glass-panel border border-white/5 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-black">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
                Next-Gen Opportunity Intelligence
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, {user.name} 👋
            </h2>
            <p className="text-zinc-400 text-xs mt-1.5 max-w-xl leading-relaxed">
              We\'ve scanned <span className="text-indigo-400 font-semibold">{posts.length} hidden institutional channels</span>. 
              There are <span className="text-emerald-400 font-semibold">{posts.filter(p => p.urgency === 'Critical' || p.urgency === 'High').length} critical referrals</span> waiting for your branch!
            </p>
          </div>
          
          <button 
            onClick={() => setActiveTab('ai-rec')}
            className="glow-btn px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Scan AI Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Feed & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Quick Shortcuts */}
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setActiveTab('feed')}
              className="p-4 rounded-xl glass-panel text-left flex flex-col justify-between h-28 relative overflow-hidden group transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-all">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-semibold">Senior Feed</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Explore {posts.length} leads</p>
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
                <p className="text-xs text-zinc-400 font-semibold">AI Mentor Chat</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Instant faculty prep</p>
              </div>
            </button>

            <button 
              onClick={onAddPostClick}
              className="p-4 rounded-xl glass-panel border border-indigo-500/20 bg-indigo-950/10 text-left flex flex-col justify-between h-28 relative overflow-hidden group transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-all">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-zinc-300 font-bold">Post Intel</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">Contribute & earn badges</p>
              </div>
            </button>
          </div>

          {/* Trending Intelligence Feed */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold tracking-wider text-zinc-200 uppercase">Trending Senior Intelligence</h3>
              </div>
              <button 
                onClick={() => setActiveTab('feed')} 
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 transition-all"
              >
                <span>View all feed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {trendingIntel.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="p-4 rounded-xl glass-panel transition-all duration-200 cursor-pointer flex flex-col gap-3 border border-white/5 relative overflow-hidden group hover:translate-x-1"
                >
                  <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getUrgencyColor(post.urgency)}`}>
                          {post.urgency}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(post.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors leading-tight">
                        {post.title}
                      </h4>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                        ▲ {post.upvotes}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>

                  <div className="flex justify-between items-center border-t border-white/5 pt-2.5 mt-1 text-[11px] text-zinc-500">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-zinc-300">{post.author.name}</span>
                      <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.25 rounded-md">
                        {post.author.badge}
                      </span>
                    </div>

                    <span className="text-zinc-500 font-semibold group-hover:text-zinc-300 transition-colors">
                      {post.commentsCount} replies • Click to view →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines & Notifications */}
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

          {/* Quick Notifications */}
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Recent Alerts</h3>
              </div>
              {unreadNotifs.length > 0 && (
                <span className="text-[9px] font-bold text-rose-400 bg-rose-950/40 border border-rose-500/20 px-2 py-0.5 rounded-full animate-pulse">
                  {unreadNotifs.length} new
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {notifications.slice(0, 4).map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                    notif.read 
                      ? 'bg-zinc-950/30 border-white/5 text-zinc-400' 
                      : 'bg-indigo-950/10 border-indigo-500/20 text-zinc-200 shadow-md shadow-indigo-950/10'
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-300 flex items-center gap-1.5">
                      {notif.type === 'deadline' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>}
                      {notif.type === 'trending' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                      {notif.type === 'alert' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>}
                      {notif.title}
                    </span>
                    {notif.timeRemaining && (
                      <span className="text-[9px] text-amber-400 font-semibold">{notif.timeRemaining}</span>
                    )}
                  </div>
                  <p className="text-[11px] leading-normal text-zinc-400">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
