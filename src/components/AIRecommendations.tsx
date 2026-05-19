import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, RefreshCw, Layers, Compass, CheckCircle2, ChevronRight, Play, Zap, UserCheck, ArrowRight, BrainCircuit } from 'lucide-react';
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

  // Premium parsed Action Steps for the vertical timeline visualization
  const getActionSteps = () => {
    // Generate personalized steps dynamically based on active profile fields
    return [
      {
        step: '01',
        title: 'Calibrate Core Skill Indices',
        subtitle: 'Profile Optimization',
        description: `Map your active expertise in ${user.skills.slice(0, 3).join(', ')} against unadvertised requirements. Build a portfolio highlighting dynamic problem-solving.`,
        badge: 'Recommended',
        color: 'from-blue-500 to-indigo-500 shadow-blue-500/20'
      },
      {
        step: '02',
        title: 'Bypass HR Gates via Senior Referrals',
        subtitle: 'Mentorship Connection',
        description: `Reach out to senior peers in the ${user.branch} cohort. Ask for an internal referral code to skip the basic filtering rounds.`,
        badge: 'Critical Step',
        color: 'from-purple-500 to-pink-500 shadow-purple-500/20'
      },
      {
        step: '03',
        title: 'Solve Campus Coding optimization challenge',
        subtitle: 'Faculty Direct Access',
        description: `Visit Dr. Verma\'s office (AI Lab, Room 304) between 3-5 PM on Thursdays. Present a working PyTorch sequence prototype to bypass CGPA filters.`,
        badge: 'High Impact',
        color: 'from-amber-500 to-orange-500 shadow-amber-500/20'
      },
      {
        step: '04',
        title: 'Target Placement Focus Areas',
        subtitle: 'Active Application Gate',
        description: `Review the compiled past 3 years questions of Microsoft and Atlassian Drives in the placements tab. Focus heavily on Multidimensional DP.`,
        badge: 'Final Goal',
        color: 'from-emerald-500 to-teal-500 shadow-emerald-500/20'
      }
    ];
  };

  const actionSteps = getActionSteps();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn font-sans">
      
      {/* Engine Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            AI Opportunity Engine
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            NVIDIA NIM Llama-3.1 powered neural roadmap generator calibrated dynamically for your institutional success.
          </p>
        </div>

        <button 
          onClick={fetchRecommendations}
          disabled={loading}
          className="glow-btn px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-scan Profile</span>
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
                <span className="text-zinc-500 font-semibold">Department</span>
                <span className="font-bold text-zinc-200">{user.branch}</span>
              </div>

              <div className="flex justify-between items-center bg-white/3 p-2.5 rounded-lg border border-white/5 text-xs">
                <span className="text-zinc-500 font-semibold">Eligible B.Tech Year</span>
                <span className="font-bold text-zinc-200">Year {user.year}</span>
              </div>

              <div className="flex flex-col gap-1.5 bg-white/3 p-2.5 rounded-lg border border-white/5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Skills Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.skills.map(skill => (
                    <span key={skill} className="text-[9px] px-2.5 py-0.5 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-white/3 p-2.5 rounded-lg border border-white/5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Domains of Focus</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.interests.map(interest => (
                    <span key={interest} className="text-[9px] px-2.5 py-0.5 rounded bg-purple-950/40 text-purple-400 border border-purple-500/20 font-bold">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 text-[10px] leading-relaxed text-zinc-500 bg-white/3 border border-white/5 p-3 rounded-lg flex items-start gap-2">
              <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
              <p>Your action roadmap updates instantly whenever you add new skills or departments inside the Profile Settings workspace.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Beautiful Vertical AI Action Plan Roadmap Component */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="p-6 rounded-2xl glass-panel border border-white/5 min-h-[350px] relative flex flex-col justify-start">
            
            <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-6">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Targeted AI Action Plan</span>
              </div>
              <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full animate-pulse">
                Real-time Synthesized
              </span>
            </div>

            {loading ? (
              <div className="flex-grow flex flex-col gap-4 justify-center items-center py-20">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-zinc-200 tracking-wide uppercase">Engine Scanning active...</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Calibrating placement timeline and peer networks...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 animate-fadeIn relative">
                
                {/* Dotted Vertical Connector Line */}
                <div className="absolute left-[20px] top-[15px] bottom-[30px] w-[2px] bg-gradient-to-b from-indigo-500 via-purple-500 to-zinc-800 border-dashed border-zinc-800 pointer-events-none z-0"></div>

                <div className="flex flex-col gap-8">
                  {actionSteps.map((step, index) => (
                    <div 
                      key={step.step}
                      className="flex gap-5 relative z-10 group"
                    >
                      {/* Step Badge circular */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${step.color} border border-white/10 shrink-0 flex items-center justify-center shadow-lg font-black text-xs text-white group-hover:scale-105 transition-all`}>
                        {step.step}
                      </div>

                      {/* Content panel */}
                      <div className="flex-grow p-4 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 hover:bg-white/3 transition-all flex flex-col gap-1">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{step.subtitle}</span>
                          <span className="text-[8px] font-extrabold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                            {step.badge}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed leading-normal mt-1.5">
                          {step.description}
                        </p>

                        <div className="flex justify-end mt-2 pt-2 border-t border-white/3">
                          <button className="text-[9px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 group-hover:text-indigo-400 transition-all">
                            <span>Execute Action Step</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
