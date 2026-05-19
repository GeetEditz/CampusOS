import React from 'react';
import { Award, ShieldAlert, Sparkles, Trophy, Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { LeaderboardUser } from '@/lib/types';
import { MOCK_LEADERBOARD } from '@/lib/mockData';

interface LeaderboardProps {
  leaderboard?: LeaderboardUser[];
}

export default function Leaderboard({ leaderboard = MOCK_LEADERBOARD }: LeaderboardProps) {
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Guru': return 'bg-amber-950/40 text-amber-400 border border-amber-500/30';
      case 'Mentor': return 'bg-purple-950/40 text-purple-400 border border-purple-500/20';
      case 'Pioneer': return 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/20';
      default: return 'bg-zinc-800/40 text-zinc-400 border border-zinc-700/30';
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'text-amber-400 bg-amber-950/40 border border-amber-500/40 shadow-lg shadow-amber-500/5';
      case 2: return 'text-zinc-300 bg-zinc-950/40 border border-zinc-500/20';
      case 3: return 'text-amber-600 bg-amber-950/20 border border-amber-800/20';
      default: return 'text-zinc-500 bg-zinc-950/10 border-white/5';
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn">
      
      {/* Leaderboard Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Senior Credibility Leaderboard
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Celebrating verified senior mentors democratizing institutional intelligence inside our campus.
          </p>
        </div>

        <span className="text-[9px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          Intel Score Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top 3 Podium Displays */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaderboard.slice(0, 3).map((senior) => (
            <div 
              key={senior.id}
              className="p-5 rounded-2xl glass-panel border border-white/5 flex flex-col items-center text-center relative overflow-hidden group hover:-translate-y-0.5 transition-all"
            >
              {/* Top glow */}
              <div className="absolute -inset-10 bg-gradient-to-b from-indigo-500/5 to-transparent blur-2xl group-hover:from-indigo-500/10 transition-all"></div>
              
              {/* Medal/Rank indicator */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${getRankStyle(senior.rank)}`}>
                {senior.rank}
              </div>

              {/* Avatar picture */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/30 mb-3 group-hover:border-indigo-400 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={senior.avatarUrl} alt={senior.name} className="w-full h-full object-cover" />
              </div>

              <h4 className="text-sm font-bold text-zinc-100">{senior.name}</h4>
              <p className="text-[10px] text-zinc-400 mt-0.5">{senior.branch}</p>
              
              <div className="flex gap-2 mt-3">
                <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider ${getBadgeStyle(senior.badge)}`}>
                  {senior.badge}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950/20 border border-emerald-500/15 text-emerald-400 font-bold">
                  Score: {senior.credibilityScore}
                </span>
              </div>

              <div className="flex items-center gap-4 border-t border-white/5 w-full mt-4 pt-3.5 text-[11px] text-zinc-500">
                <div className="flex-1 flex justify-center items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{senior.helpfulPostsCount} contributions</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Complete Table List */}
        <div className="lg:col-span-3 glass-panel border border-white/5 rounded-2xl overflow-hidden p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 border-b border-white/5 pb-2.5">
            Leaderboard Rankings
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 font-bold">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Senior</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Level badge</th>
                  <th className="py-2.5 px-3">Helpful Posts</th>
                  <th className="py-2.5 px-3 text-right">Credibility Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((senior) => (
                  <tr 
                    key={senior.id}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors text-zinc-300 font-medium"
                  >
                    <td className="py-3.5 px-3 font-bold">{senior.rank}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={senior.avatarUrl} alt={senior.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-zinc-200">{senior.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-zinc-400">{senior.branch}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[8px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider ${getBadgeStyle(senior.badge)}`}>
                        {senior.badge}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-zinc-400">{senior.helpfulPostsCount} intel shares</td>
                    <td className="py-3.5 px-3 text-right font-black text-emerald-400">
                      {senior.credibilityScore} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
