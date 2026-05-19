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
  Sparkles,
  BookOpen,
  Network,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const isAdmin = user.role === 'admin';
  const menuItems = isAdmin ? [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'feed', label: 'Intel Moderation', icon: Rss },
    { id: 'network', label: 'Institutional Map', icon: Network },
    { id: 'admin-panel', label: 'Verification Hub', icon: ShieldCheck, badge: 'Admin' },
    { id: 'heatmap', label: 'Campus Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Portal Settings', icon: User },
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'feed', label: 'Senior Intel Feed', icon: Rss },
    { id: 'network', label: 'Institutional Network', icon: Network },
    { id: 'ai-rec', label: 'AI Opportunities Map', icon: Cpu, badge: 'NIM' },
    { id: 'chat', label: 'AI Mentor Chat', icon: MessageSquare },
    { id: 'leaderboard', label: 'Senior Credibility', icon: Award },
    { id: 'heatmap', label: 'Opportunity Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/5 h-screen sticky top-0 flex flex-col justify-between p-4 z-20">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-white/5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <BookOpen className="w-4 h-4 text-primary" />
            <div className="absolute -inset-1 rounded-lg bg-primary/20 blur opacity-40 animate-pulse"></div>
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center gap-1.5">
              CampusOS <span className="text-[8px] uppercase font-black tracking-widest bg-primary/10 text-primary border border-primary/20 px-1 py-0.5 rounded">v1</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-tight">Institutional Intelligence</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3 rounded-xl bg-white/[0.015] border border-white/5 flex items-center gap-3 relative overflow-hidden group">
          <div className="absolute -inset-10 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all duration-300"></div>
          <Avatar className="w-9 h-9 border border-primary/20">
            <AvatarImage src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={user.name} />
            <AvatarFallback className="bg-zinc-900 text-zinc-200 text-xs font-bold">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 z-10">
            <p className="text-xs font-bold text-zinc-200 truncate">{user.name}</p>
            <p className="text-[10px] text-zinc-500 font-medium truncate">{user.branch}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge variant="secondary" className="text-[8px] bg-primary/10 text-primary border border-primary/20 font-black px-1.5 py-0.25 rounded-md flex items-center gap-0.5">
                <Sparkles className="w-2 h-2 animate-pulse" />
                Score: {user.credibilityScore}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary shadow-sm shadow-primary/5' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border-l-2 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary scale-105 animate-pulse' : 'text-zinc-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-[8px] font-black text-primary bg-primary/10 border border-primary/20 px-1 py-0.25 rounded">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout / Footer */}
      <div className="flex flex-col gap-1.5">
        <div className="border-t border-white/5 my-1.5"></div>
        <button
          onClick={() => setActiveTab('help')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all border-l-2 cursor-pointer ${
            activeTab === 'help'
              ? 'text-primary bg-primary/5 border-primary shadow-[inset_0_0_12px_rgba(99,102,241,0.05)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] border-transparent'
          }`}
        >
          <HelpCircle className={`w-4 h-4 ${activeTab === 'help' ? 'text-primary' : 'text-zinc-500'}`} />
          <span>Help & Credibility</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-950/10 transition-all border-l-2 border-transparent cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-zinc-500 group-hover:text-red-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
