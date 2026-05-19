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
import { useApp } from '@/context/AppContext';

export default function OpportunityHeatmap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { posts } = useApp();

  // 1. Dynamic Branch Data Calculation
  const branchMap = new Map();
  posts.forEach(post => {
    const branch = post.branch || 'General';
    if (!branchMap.has(branch)) {
      branchMap.set(branch, { name: branch, opportunities: 0, engagement: 0, placementPrep: 0 });
    }
    const b = branchMap.get(branch);
    b.opportunities += 1;
    b.engagement += ((post.upvotes || 0) + (post.commentsCount || 0));
    if (post.category === 'Placements' || post.category === 'Internships') {
      b.placementPrep += 1;
    }
  });
  // Sort branches by opportunities and take top 5
  const branchData = Array.from(branchMap.values())
    .sort((a, b) => b.opportunities - a.opportunities)
    .slice(0, 5);

  // 2. Dynamic Domain (Category) Distribution
  const categoryMap = new Map();
  let totalPosts = 0;
  posts.forEach(post => {
    categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
    totalPosts += 1;
  });
  const colors = ['#6366f1', '#3b82f6', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#ef4444'];
  const domainData = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1]) // Sort categories by count
    .map(([name, count], index) => ({
      name,
      value: totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0, // Convert to percentage
      color: colors[index % colors.length]
    }))
    .slice(0, 5); // Take top 5 categories for the pie chart

  // 3. Dynamic Engagement Trend over Time
  const monthMap = new Map();
  const sortedPosts = [...posts].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  sortedPosts.forEach(post => {
    const date = new Date(post.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    if (!monthMap.has(month)) {
      monthMap.set(month, { month, activeStudents: 0, applications: 0 });
    }
    const m = monthMap.get(month);
    m.activeStudents += (post.upvotes || 0) * 2; // Approximated active views
    m.applications += (post.commentsCount || 0); // Approximated replies/applications
  });
  
  // Get chronological sequence
  const engagementTrend = Array.from(monthMap.values()).slice(-6); // Last 6 months

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
