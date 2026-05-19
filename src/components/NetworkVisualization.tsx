import React, { useState } from 'react';
import { Network, Sparkles, Map, ChevronRight, HelpCircle, Layers, Link, MessageSquare } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'student' | 'mentor' | 'professor' | 'club' | 'pipeline';
  x: number;
  y: number;
  details: string;
  connections: string[];
}

export default function NetworkVisualization() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  // High-fidelity preloaded network nodes
  const nodes: Node[] = [
    {
      id: 'n-arjun',
      label: 'Arjun Mehta (You)',
      type: 'student',
      x: 350,
      y: 280,
      details: '3rd Year B.Tech Student in Computer Science. Calibrating skills in PyTorch, React, and Node.js. Linked to Priya Sharma for internship referrals.',
      connections: ['n-priya', 'n-verma', 'n-club']
    },
    {
      id: 'n-priya',
      label: 'Priya Sharma (Guru)',
      type: 'mentor',
      x: 200,
      y: 180,
      details: '4th Year B.Tech Senior with 890 Helpful Points. Secured placement at Microsoft. Connects Arjun with internal Google/Microsoft pipelines.',
      connections: ['n-arjun', 'n-google', 'n-microsoft']
    },
    {
      id: 'n-rohan',
      label: 'Rohan Deshmukh (Mentor)',
      type: 'mentor',
      x: 500,
      y: 180,
      details: '4th Year ECE Senior. Secured embedded software internship. Mentors sophomore students for hardware and PCB designs.',
      connections: ['n-club', 'n-embedded']
    },
    {
      id: 'n-verma',
      label: 'Dr. Verma (AI Lab)',
      type: 'professor',
      x: 350,
      y: 100,
      details: 'Dean of AI Lab and Deep Learning researcher. Offers secret PyTorch RA roles to students who solve the optimization challenge.',
      connections: ['n-arjun', 'n-priya', 'n-nvidia']
    },
    {
      id: 'n-club',
      label: 'Robotics & Coding Club',
      type: 'club',
      x: 500,
      y: 350,
      details: 'Elite college club focusing on ROS autonomous rovers and Hackathons. Host of weekly internal placement preparation drives.',
      connections: ['n-arjun', 'n-rohan']
    },
    {
      id: 'n-google',
      label: 'Google STEP Referral Portal',
      type: 'pipeline',
      x: 100,
      y: 120,
      details: 'Active referral pipeline for sophomore and junior internships. 78 students from your branch applied. High priority target.',
      connections: ['n-priya']
    },
    {
      id: 'n-microsoft',
      label: 'Microsoft Placement prep List',
      type: 'pipeline',
      x: 120,
      y: 320,
      details: 'Active preparation vault sharing the past 3 years questions. Tracked by 42 students from the CSE branch.',
      connections: ['n-priya']
    },
    {
      id: 'n-nvidia',
      label: 'NVIDIA Inception incubator',
      type: 'pipeline',
      x: 480,
      y: 70,
      details: '$10,000 collegiate incubator grants and $25,000 GPU NIM credits. Direct target from the E-cell.',
      connections: ['n-verma']
    },
    {
      id: 'n-embedded',
      label: 'Embedded Software Pipeline',
      type: 'pipeline',
      x: 650,
      y: 240,
      details: 'Direct referral channel for ECE core departments. Facilitates hardware roles in top micro-controller firms.',
      connections: ['n-rohan']
    }
  ];

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
        <div className="lg:col-span-2 glass-panel border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative min-h-[480px] bg-black overflow-hidden select-none">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />
              Dynamic SVG rendering
            </span>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03),transparent)] pointer-events-none"></div>

          {/* Graph Render Container */}
          <div className="flex-grow w-full h-full flex items-center justify-center relative min-h-[400px]">
            <svg 
              viewBox="0 0 750 420" 
              className="w-full h-full max-h-[420px]"
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
                      className={`text-[9.5px] font-black tracking-tight transition-all duration-300 ${
                        isActive || isHovered ? 'fill-white scale-105' : 'fill-zinc-500'
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

              <div className="bg-white/2 border border-white/5 p-4 rounded-xl text-xs text-zinc-300 leading-relaxed font-semibold">
                {activeNode.details}
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
                  if (activeNode.type === 'pipeline') {
                    // Navigate directly
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 font-semibold text-xs text-white transition-all hover:scale-101 active:scale-99"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Node contact</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
