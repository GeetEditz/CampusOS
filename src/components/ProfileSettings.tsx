import React, { useState } from 'react';
import { User, Cpu, Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface ProfileSettingsProps {
  user: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export default function ProfileSettings({ user, onUpdateProfile }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [branch, setBranch] = useState(user.branch);
  const [year, setYear] = useState(user.year);
  
  // Skills list state
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Interests list state
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keep local state synced if the context profile updates asynchronously
  React.useEffect(() => {
    setName(user.name || '');
    setBranch(user.branch || 'General');
    setYear(user.year || 1);
    setSkills(user.skills || []);
    setInterests(user.interests || []);
  }, [user]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...user,
      name,
      branch,
      year: Number(year),
      skills,
      interests
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const branchesList = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Information Technology',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering'
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-1 animate-fadeIn">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Profile & Intelligence Settings
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Tailor your skills, branches, and interests to immediately recalibrate neural recommendations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core Profile Parameters */}
        <div className="md:col-span-2 glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 border-b border-white/5 pb-2.5 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Academic Identity
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 group">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input font-medium outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 group">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">Department / Branch</label>
                <div className="relative">
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className="w-full bg-white/3 border border-white/5 rounded-lg p-2.5 pr-8 text-xs text-white glass-input font-medium appearance-none outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
                  >
                    {branchesList.map(b => (
                      <option key={b} value={b} className="bg-zinc-900 text-white font-medium py-1">{b}</option>
                    ))}
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-indigo-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 group">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">Eligible Year</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    min={1}
                    max={4}
                    className="w-full bg-white/3 border border-white/5 rounded-lg p-2.5 pr-8 text-xs text-white glass-input font-medium appearance-none outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                    style={{ WebkitAppearance: 'none', margin: 0 }}
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mb-[1px]"><path d="m18 15-6-6-6 6"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-2 flex justify-between items-center">
              {saveSuccess ? (
                <div className="text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="w-4 h-4" />
                  Roadmap Scanned successfully!
                </div>
              ) : (
                <div className="text-zinc-500 text-[10px] max-w-[250px] leading-relaxed">
                  Saving updates your identity and rebuilds your AI opportunity engine index.
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveProfile}
                className="glow-btn px-5 py-2.5 rounded-lg text-xs font-bold text-white hover:scale-105 active:scale-95 transition-all"
              >
                Sync Roadmap Settings
              </button>
            </div>
          </div>
        </div>

        {/* Gamified details */}
        <div className="md:col-span-1 glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 border-b border-white/5 pb-2.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            E-Cell Analytics
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white/2 border border-white/5 p-3 rounded-xl">
              <span className="text-xs text-zinc-400 font-semibold">Credibility Score</span>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/10">
                {user.credibilityScore} pts
              </span>
            </div>

            <div className="flex justify-between items-center bg-white/2 border border-white/5 p-3 rounded-xl">
              <span className="text-xs text-zinc-400 font-semibold">Verified Badge</span>
              <span className="text-xs font-black text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-500/10">
                {user.badge || 'Rookie'}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 bg-white/2 border border-white/5 p-3 rounded-xl">
              <span className="text-xs text-zinc-400 font-semibold truncate">SSO Verification</span>
              <span className={`shrink-0 whitespace-nowrap text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                user.ssoLinked 
                  ? 'text-emerald-400 bg-emerald-950/20 border-emerald-500/20' 
                  : 'text-zinc-500 bg-zinc-900 border-zinc-800'
              }`}>
                {user.ssoLinked ? `✓ Linked (${user.ssoProvider})` : 'Unlinked'}
              </span>
            </div>

            <div className="text-[10px] leading-relaxed text-zinc-500 bg-white/3 border border-white/5 p-3 rounded-xl flex items-start gap-2">
              <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
              <p>Upvote rankings and contributing useful comments in the Senior Intel Feed boosts your institutional helpfulness points.</p>
            </div>
          </div>
        </div>

        {/* Skills Onboarding Form */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 border-b border-white/5 pb-2.5">
            Onboarding Skills
          </h3>

          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input 
              type="text" 
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              placeholder="e.g. PyTorch"
              className="flex-grow bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2.5 transition-all text-xs font-bold"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-2">
            {skills.length === 0 ? (
              <span className="text-zinc-600 text-xs">No skills loaded.</span>
            ) : (
              skills.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 font-bold flex items-center gap-1.5 animate-fadeIn">
                  {s}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(s)} 
                    className="text-indigo-500 hover:text-indigo-300 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Interests Onboarding Form */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 border-b border-white/5 pb-2.5">
            Onboarding Interests
          </h3>

          <form onSubmit={handleAddInterest} className="flex gap-2">
            <input 
              type="text" 
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              placeholder="e.g. AI Research"
              className="flex-grow bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg p-2.5 transition-all text-xs font-bold"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-2">
            {interests.length === 0 ? (
              <span className="text-zinc-600 text-xs">No targets loaded.</span>
            ) : (
              interests.map(i => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/30 border border-purple-500/20 text-purple-300 font-bold flex items-center gap-1.5 animate-fadeIn">
                  {i}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveInterest(i)} 
                    className="text-purple-500 hover:text-purple-300 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
