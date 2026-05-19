import React, { useState, useMemo } from 'react';
import { Network, Sparkles, ChevronRight, HelpCircle, Layers, Link, MessageSquare, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

interface Node {
  id: string;
  label: string;
  type: 'student' | 'mentor' | 'professor' | 'club' | 'pipeline';
  x: number;
  y: number;
  details: string;
  connections: string[];
  rawPostId?: string;
}

export default function NetworkVisualization() {
  const router = useRouter();
  const { posts, userProfile, setSelectedFeedPost } = useApp();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  // Dynamically map actual Postgres database data to the Graph Nodes
  const nodes: Node[] = useMemo(() => {
    const generated: Node[] = [];
    if (!userProfile) return generated;

    // 1. Center Node: The active user
    generated.push({
      id: `user-${userProfile.id}`,
      label: `${userProfile.name.split(' ')[0]} (You)`,
      type: 'student',
      x: 375,
      y: 300,
      details: `Campus OS Identity:\n${userProfile.year} Student in ${userProfile.branch}.\nRegistered Skills: ${userProfile.skills.join(', ')}.\nCredibility Score: ${userProfile.credibilityScore} pts`,
      connections: []
    });

    // 2. Extract unique mentors from live posts
    const uniqueAuthors = new Map<string, any>();
    posts.forEach(post => {
      if (!uniqueAuthors.has(post.author.id) && post.author.id !== userProfile.id) {
        uniqueAuthors.set(post.author.id, post.author);
      }
    });

    // 3. Render Mentors in an inner circle (scaled radius)
    const authorArray = Array.from(uniqueAuthors.values());
    authorArray.forEach((author, i) => {
      const angle = (i / authorArray.length) * Math.PI * 2;
      const r = 140; 
      const x = 375 + r * Math.cos(angle);
      const y = 300 + r * Math.sin(angle);
      
      generated.push({
        id: `author-${author.id}`,
        label: `${author.name.split(' ')[0]} (${author.badge})`,
        type: 'mentor',
        x,
        y,
        details: `Senior Mentor Profile\nRole: ${author.role}\nHelpfulness Score: ${author.credibilityScore} pts\nBadge Level: ${author.badge}`,
        connections: [`user-${userProfile.id}`]
      });
    });

    // 4. Render Pipelines (Posts) in an outer circle, connected to their respective authors
    posts.forEach((post, i) => {
      let authorAngle = 0;
      if (post.author.id !== userProfile.id) {
        const authorIndex = authorArray.findIndex(a => a.id === post.author.id);
        if (authorIndex !== -1) {
          authorAngle = (authorIndex / authorArray.length) * Math.PI * 2;
        }
      } else {
        // Post authored by user
        authorAngle = (i / posts.length) * Math.PI * 2;
      }

      // Add angular spread so posts from same author fan out instead of overlapping
      const spread = ((i % 5) - 2) * 0.25; 
      const finalAngle = authorAngle + spread;
      const r = 220 + (i % 2) * 45; // Staggered radii for depth (larger bounds)
      
      const x = 375 + r * Math.cos(finalAngle);
      const y = 300 + r * Math.sin(finalAngle);
      
      generated.push({
        id: `post-${post.id}`,
        label: post.title.length > 15 ? post.title.substring(0, 15) + '...' : post.title,
        type: 'pipeline',
        x,
        y,
        details: `Opportunity Intelligence\nTitle: ${post.title}\nCategory: ${post.category} (${post.urgency})\nReplies: ${post.commentsCount} • Net Upvotes: ${post.upvotes - post.downvotes}\n\n${post.description}`,
        connections: post.author.id === userProfile.id ? [`user-${userProfile.id}`] : [`author-${post.author.id}`],
        rawPostId: post.id
      });
    });

    return generated;
  }, [posts, userProfile]);

  const activeNode = hoveredNode || selectedNode || nodes[0];

  const getNodeColor = (type: string, isActive: boolean) => {
    if (!isActive) return 'fill-zinc-800 stroke-zinc-700';
    switch (type) {
      case 'student': return 'fill-indigo-600 stroke-indigo-400 shadow-indigo-500/50';
      case 'mentor': return 'fill-purple-600 stroke-purple-400 shadow-purple-500/50';
      case 'professor': return 'fill-amber-600 stroke-amber-400 shadow-amber-500/50';
      case 'club': return 'fill-cyan-600 stroke-cyan-400 shadow-cyan-500/50';
      default: return 'fill-rose-600 stroke-rose-400 shadow-rose-500/50';
    }
  };

  const getNodeGlow = (type: string) => {
    switch (type) {
      case 'student': return 'rgba(99, 102, 241, 0.4)';
      case 'mentor': return 'rgba(168, 85, 247, 0.4)';
      case 'professor': return 'rgba(245, 158, 11, 0.4)';
      case 'club': return 'rgba(6, 182, 212, 0.4)';
      default: return 'rgba(239, 68, 68, 0.4)';
    }
  };

  // Find connections to render lines
  const renderLines = () => {
    const rendered: React.ReactNode[] = [];
    const seen = new Set<string>();

    nodes.forEach(node => {
      node.connections.forEach(connId => {
        const target = nodes.find(n => n.id === connId);
        if (target) {
          const key = [node.id, connId].sort().join('-');
          if (!seen.has(key)) {
            seen.add(key);
            
            // Check if line should be highlighted
            const isHighlighted = 
              activeNode.id === node.id || 
              activeNode.id === connId ||
              (hoveredNode && (hoveredNode.id === node.id || hoveredNode.id === connId));

            rendered.push(
              <line
                key={key}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke={isHighlighted ? 'url(#glowingLine)' : 'rgba(255, 255, 255, 0.05)'}
                strokeWidth={isHighlighted ? 2 : 1}
                className="transition-all duration-300"
              />
            );
          }
        }
      });
    });

    return rendered;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Institutional Intelligence Map
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Visualizing hidden referral channels, mentoring structures, and faculty opportunities across our campus network.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Futuristic Map Canvas */}
        <div className="lg:col-span-2 glass-panel border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative min-h-[600px] bg-black overflow-hidden select-none">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
              Dynamic SVG rendering
            </span>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03),transparent)] pointer-events-none"></div>

          {/* Graph Render Container */}
          <div className="flex-grow w-full h-full flex items-center justify-center relative min-h-[500px]">
            <svg 
              viewBox="0 0 750 600" 
              className="w-full h-full max-h-[600px]"
            >
              <defs>
                <linearGradient id="glowingLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Connections Lines */}
              {renderLines()}

              {/* Nodes */}
              {nodes.map(node => {
                const isActive = activeNode.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g 
                    key={node.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Glowing outer boundary circle */}
                    {(isActive || isHovered || isSelected) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={16}
                        fill={getNodeGlow(node.type)}
                        filter="url(#glowEffect)"
                        className="transition-all duration-300 animate-pulse"
                      />
                    )}

                    {/* Central Core Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={8}
                      className={`${getNodeColor(node.type, isActive || isHovered)} transition-all duration-300`}
                      strokeWidth={isActive || isHovered ? 2 : 1}
                    />

                    {/* Text Label */}
                    <text
                      x={node.x}
                      y={node.y + 24}
                      textAnchor="middle"
                      className={`text-[9.5px] font-black tracking-tight transition-colors duration-300 ${
                        isActive || isHovered ? 'fill-white' : 'fill-zinc-500'
                      }`}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="border-t border-white/5 pt-3.5 flex flex-wrap gap-4 justify-center items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>Student Profile</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Senior Mentor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Faculty Profs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span>Clubs / Labs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Opportunity Hubs</span>
            </div>
          </div>
        </div>

        {/* Selected Node Details side-card */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none"></div>

            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Intelligence Details</h3>
            </div>

            <div className="flex flex-col gap-4 flex-grow z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Selected Node</span>
                <span className="text-sm font-black text-white">{activeNode.label}</span>
                <span className="text-[10px] text-zinc-400 capitalize font-bold">{activeNode.type} Node Category</span>
              </div>

              <div className="bg-white/2 border border-white/5 p-4 rounded-xl text-xs text-zinc-300 leading-relaxed font-semibold whitespace-pre-line max-h-[220px] overflow-y-auto custom-scrollbar">
                {activeNode?.details || 'Hover over or click a node in the map to view its strategic intelligence data.'}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Target Connections</span>
                <div className="flex flex-wrap gap-2">
                  {activeNode.connections.map(connId => {
                    const match = nodes.find(n => n.id === connId);
                    return (
                      <span 
                        key={connId} 
                        className="text-[9.5px] px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 font-bold flex items-center gap-1.5 cursor-pointer hover:border-indigo-500/30 hover:text-white transition-all"
                        onClick={() => {
                          const node = nodes.find(n => n.id === connId);
                          if (node) setSelectedNode(node);
                        }}
                      >
                        <Link className="w-3 h-3 text-zinc-500" />
                        {match ? match.label.split(' ')[0] : connId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 mt-auto">
              <button 
                onClick={() => {
                  if (activeNode?.type === 'pipeline' && activeNode.rawPostId) {
                    const postMatch = posts.find(p => p.id === activeNode.rawPostId);
                    if (postMatch) {
                      setSelectedFeedPost(postMatch);
                      router.push('/feed');
                    }
                  } else {
                    setShowChatModal(true);
                  }
                }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-semibold text-xs text-white transition-all hover:scale-[1.02] active:scale-95 ${
                  activeNode?.type === 'pipeline' 
                    ? 'bg-indigo-600/20 border-indigo-500/30 hover:bg-indigo-600/30 text-indigo-100' 
                    : 'bg-white/3 border-white/5 hover:bg-white/5'
                }`}
              >
                {activeNode?.type === 'pipeline' ? (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Intel in Feed</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Node contact</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Coming Soon Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-sm w-full bg-black/40 border border-indigo-500/30 p-6 rounded-2xl glass-panel text-center flex flex-col items-center gap-4 relative overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            
            <h3 className="text-lg font-black text-white">Encrypted Chat Locked</h3>
            
            <p className="text-sm text-zinc-300 font-medium">
              Direct node messaging will be enabled in the upcoming Realtime Chat integration phase!
            </p>
            
            <button 
              onClick={() => setShowChatModal(false)}
              className="mt-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Acknowledged
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
