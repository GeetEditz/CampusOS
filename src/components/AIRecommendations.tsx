import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, RefreshCw, Layers, Compass, CheckCircle2, ChevronRight } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { getAINimRecommendations } from '@/lib/nvidia';

interface AIRecommendationsProps {
  user: UserProfile;
}

export default function AIRecommendations({ user }: AIRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState('');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const recs = await getAINimRecommendations({
        branch: user.branch,
        year: user.year,
        skills: user.skills,
        interests: user.interests
      });
      setRecommendations(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    // eslint-disable-next-line react-hooks-exhaustive-deps
  }, [user.branch, user.year, user.skills, user.interests]);

  // Small custom markdown helper to render recommendations beautifully
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('###')) {
        return <h3 key={idx} className="text-sm font-extrabold text-zinc-100 uppercase tracking-widest mt-4 mb-2 first:mt-0 glow-text-primary">{line.replace('###', '').trim()}</h3>;
      }
      if (line.startsWith('####')) {
        return <h4 key={idx} className="text-xs font-black text-indigo-400 mt-3 mb-1.5 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-indigo-400" />{line.replace('####', '').trim()}</h4>;
      }
      if (line.startsWith('* **') || line.startsWith('- **')) {
        const cleaned = line.replace(/^\* \*\*/, '').replace(/^- \*\*/, '');
        const splitIndex = cleaned.indexOf('**');
        const boldPart = splitIndex !== -1 ? cleaned.substring(0, splitIndex) : '';
        const restPart = splitIndex !== -1 ? cleaned.substring(splitIndex + 2) : cleaned;
        
        return (
          <div key={idx} className="ml-2 flex items-start gap-2.5 my-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-zinc-300">
              <strong className="text-zinc-100">{boldPart}</strong>
              {restPart}
            </p>
          </div>
        );
      }
      if (line.startsWith('*') || line.startsWith('-')) {
        return (
          <div key={idx} className="ml-4 flex items-start gap-2 my-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"></div>
            <p className="text-xs text-zinc-400 leading-relaxed">{line.replace(/^[\*-]/, '').trim()}</p>
          </div>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-2"></div>;
      
      return <p key={idx} className="text-xs text-zinc-400 leading-relaxed my-1.5">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn">
      
      {/* Engine Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            AI Opportunity Engine
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            NVIDIA NIM-powered neural scanning engine designed specifically for first-generation student roadmaps.
          </p>
        </div>

        <button 
          onClick={fetchRecommendations}
          disabled={loading}
          className="glow-btn px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Force Scan Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Profile overview & status */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="p-5 rounded-2xl glass-panel flex flex-col gap-4 border border-white/5 relative overflow-hidden">
            <div className="absolute -inset-10 bg-indigo-500/5 blur-3xl"></div>
            
            <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Active Profile Parameters</h3>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-white/3 p-2.5 rounded-lg border border-white/5 text-xs">
                <span className="text-zinc-500">Degree & Year</span>
                <span className="font-bold text-zinc-200">{user.branch} (Year {user.year})</span>
              </div>

              <div className="flex flex-col gap-1.5 bg-white/3 p-2.5 rounded-lg border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Detected Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.skills.map(skill => (
                    <span key={skill} className="text-[9px] px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-white/3 p-2.5 rounded-lg border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Career Targets</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.interests.map(interest => (
                    <span key={interest} className="text-[9px] px-2 py-0.5 rounded bg-purple-950/40 text-purple-400 border border-purple-500/20 font-semibold">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 text-[10px] leading-relaxed text-zinc-500 bg-white/3 border border-white/5 p-3 rounded-lg flex items-start gap-2">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <p>CampusOS dynamically maps your profile against the Senior Feed context and unadvertised placement lists to compile real-time referral roadmaps.</p>
            </div>
          </div>
        </div>

        {/* Right Side: recommendations display */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel border border-white/5 min-h-[350px] relative flex flex-col justify-start">
            
            {loading ? (
              <div className="flex-1 flex flex-col gap-4 justify-center items-center py-20">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-zinc-200 tracking-wide uppercase">AI Neural Scanner Active...</p>
                  <p className="text-[10px] text-zinc-500 mt-1 max-w-[280px]">Synthesizing NVIDIA NIM models with Senior referral databases...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-zinc-300">Neural Recommendation output</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Model: Meta Llama 3.1
                  </span>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {renderMarkdown(recommendations)}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
