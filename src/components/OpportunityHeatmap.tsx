import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, BarChart3, Users, Flame, PieChart as PieChartIcon } from 'lucide-react';

export default function OpportunityHeatmap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const branchData = [
    { name: 'CSE', opportunities: 47, engagement: 88, placementPrep: 95 },
    { name: 'ECE', opportunities: 32, engagement: 65, placementPrep: 72 },
    { name: 'IT', opportunities: 38, engagement: 74, placementPrep: 84 },
    { name: 'EE', opportunities: 22, engagement: 50, placementPrep: 58 },
    { name: 'ME', opportunities: 15, engagement: 35, placementPrep: 42 }
  ];

  const domainData = [
    { name: 'Machine Learning / AI', value: 35, color: '#6366f1' },
    { name: 'Full-Stack Web', value: 25, color: '#3b82f6' },
    { name: 'Embedded Systems / ROS', value: 15, color: '#10b981' },
    { name: 'Scholarships / Grants', value: 15, color: '#ec4899' },
    { name: 'Competitive Coding', value: 10, color: '#f59e0b' }
  ];

  const engagementTrend = [
    { month: 'Jan', activeStudents: 120, applications: 85 },
    { month: 'Feb', activeStudents: 180, applications: 130 },
    { month: 'Mar', activeStudents: 320, applications: 240 },
    { month: 'Apr', activeStudents: 450, applications: 380 },
    { month: 'May', activeStudents: 590, applications: 510 }
  ];

  if (!isMounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-zinc-500 text-xs">
        Loading interactive heatmap engine...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Opportunity Heatmap & Analytics
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Analyzing student engagement, branch engagement profiles, and active hiring domains in real-time.
          </p>
        </div>

        <span className="text-[9px] font-bold text-pink-400 bg-pink-950/40 border border-pink-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
          <Flame className="w-3.5 h-3.5" />
          Live Metrics Engine
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Branch metrics Bar Chart */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Branch-Wise Opportunity Engagements</h3>
          </div>
          
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={branchData}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c0a09', borderColor: '#292524', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="opportunities" name="Opportunities Posted" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" name="Student Applications" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain distribution Pie Chart */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <PieChartIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Trending Opportunity Domains</h3>
          </div>
          
          <div className="h-72 w-full flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="h-60 w-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={domainData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {domainData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0c0a09', borderColor: '#292524', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col gap-2.5 text-xs text-zinc-400 font-semibold self-start md:self-center">
              {domainData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
                  <span className="truncate">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Placement Activity Line Chart */}
        <div className="lg:col-span-2 glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Engagement & Application Run-Rate Trend</h3>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={engagementTrend}
                margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0c0a09', borderColor: '#292524', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="activeStudents" name="Monthly Active Students" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="applications" name="Direct Referrals Filled" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
