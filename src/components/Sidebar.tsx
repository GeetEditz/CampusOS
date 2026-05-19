import React from 'react';
import { 
  LayoutDashboard, 
  Rss, 
  Cpu, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  User, 
  LogOut,
  Bell,
  Sparkles,
  BookOpen,
  Network
} from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-indigo-400' },
    { id: 'feed', label: 'Senior Intel Feed', icon: Rss, color: 'text-emerald-400' },
    { id: 'network', label: 'Institutional Network', icon: Network, color: 'text-cyan-400' },
    { id: 'ai-rec', label: 'AI Roadmap Engine', icon: Cpu, color: 'text-purple-400' },
    { id: 'chat', label: 'AI Mentor Chat', icon: MessageSquare, color: 'text-cyan-400' },
    { id: 'leaderboard', label: 'Senior Credibility', icon: Award, color: 'text-amber-400' },
    { id: 'heatmap', label: 'Opportunity Analytics', icon: TrendingUp, color: 'text-pink-400' },
    { id: 'profile', label: 'Profile & Interests', icon: User, color: 'text-blue-400' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/5 h-screen sticky top-0 flex flex-col justify-between p-4 z-20">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-white/5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-4 h-4 text-white" />
            <div className="absolute -inset-1 rounded-lg bg-indigo-500/30 blur opacity-40 animate-pulse"></div>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent flex items-center gap-1.5">
              CampusOS <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400 px-1 py-0.5 rounded bg-indigo-950/50 border border-indigo-500/20">v1</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-medium tracking-tight">Institutional Intelligence</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center gap-3 relative overflow-hidden group">
          <div className="absolute -inset-10 bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-all"></div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-indigo-500/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 z-10">
            <p className="text-xs font-semibold text-zinc-200 truncate">{user.name}</p>
            <p className="text-[10px] text-zinc-400 truncate">{user.branch}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5 font-bold">
                <Sparkles className="w-2.5 h-2.5" />
                Score: {user.credibilityScore}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white border-l-2 border-indigo-500 shadow-md shadow-indigo-900/10' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color} ${isActive ? 'scale-110' : ''}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'ai-rec' && (
                  <span className="text-[9px] font-bold text-purple-400 bg-purple-950/40 border border-purple-500/20 px-1.5 py-0.5 rounded-full">
                    NIM
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout / Footer */}
      <div className="flex flex-col gap-3">
        <div className="border-t border-white/5 my-2"></div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/10 transition-all border-l-2 border-transparent"
        >
          <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
