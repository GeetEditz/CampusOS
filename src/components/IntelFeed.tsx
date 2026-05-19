import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Share2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  CornerDownRight, 
  ArrowLeft,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Post, Comment, OpportunityCategory, UserProfile } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface IntelFeedProps {
  posts: Post[];
  user: UserProfile;
  onAddPost: (post: Omit<Post, 'id' | 'createdAt' | 'author' | 'upvotes' | 'downvotes' | 'commentsCount'>) => void;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onAddComment: (postId: string, content: string) => void;
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
}

export default function IntelFeed({ 
  posts, 
  user, 
  onAddPost, 
  onVote, 
  onAddComment,
  selectedPost,
  setSelectedPost
}: IntelFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<OpportunityCategory | 'All'>('All');
  const [isAddingPost, setIsAddingPost] = useState(false);

  // Dynamic Match Score calculation
  const getMatchScore = (post: Post) => {
    if (post.matchScore) return post.matchScore;
    if (!post.tags || post.tags.length === 0) return 72;
    
    const matchedSkills = post.tags.filter(tag => 
      user.skills.some(skill => 
        skill.toLowerCase().includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    const branchBonus = post.branch.toLowerCase().includes(user.branch.toLowerCase()) || post.branch === 'All Branches' ? 10 : 0;
    const yearBonus = post.year === user.year ? 5 : 0;

    const baseScore = 65;
    const ratio = matchedSkills.length / post.tags.length;
    const calculated = Math.round(baseScore + (ratio * 20) + branchBonus + yearBonus);
    return Math.min(calculated, 98);
  };
  
  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<OpportunityCategory>('Internships');
  const [newUrgency, setNewUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [newTags, setNewTags] = useState('');
  const [newBranch, setNewBranch] = useState(user.branch);
  const [newYear, setNewYear] = useState(3);
  const [newDeadline, setNewDeadline] = useState('');

  // Comment State
  const [commentText, setCommentText] = useState('');
  
  // Comments database simulation
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({});

  // Fetch comments dynamically when a post is expanded
  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedPost || !supabase) return;
      
      try {
        console.log(`[CampusOS Intel] 🔍 Fetching comments for post: ${selectedPost.id}`);
        const { data, error } = await supabase
          .from('comments')
          .select('*, author:profiles(id, name, role, credibility_score)')
          .eq('post_id', selectedPost.id)
          .order('created_at', { ascending: true });
          
        if (error) {
          console.error('[CampusOS Intel] ❌ Error loading comments:', error.message);
          return;
        }
        
        console.log(`[CampusOS Intel] 🔍 Raw comments data received:`, data);

        if (data) {
          const loadedComments: Comment[] = data.map((row: any) => ({
            id: row.id,
            postId: row.post_id,
            content: row.content,
            author: {
              id: row.author?.id,
              name: row.author?.name || 'Unknown',
              role: row.author?.role === 'senior' ? 'Senior' : 'Student',
              credibilityScore: row.author?.credibility_score || 0
            },
            createdAt: row.created_at
          }));
          
          console.log(`[CampusOS Intel] ✅ Mapped comments:`, loadedComments);
          setCommentsMap(prev => ({
            ...prev,
            [selectedPost.id]: loadedComments
          }));
        }
      } catch (e) {
        console.error('[CampusOS Intel] ❌ Failed to fetch comments:', e);
      }
    };
    
    fetchComments();
  }, [selectedPost?.id]);

  const categories: (OpportunityCategory | 'All')[] = [
    'All',
    'Internships',
    'Placements',
    'Scholarships',
    'Faculty Tips',
    'Club Recruitment',
    'Hackathons',
    'Exams'
  ];

  // Filtering Logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    onAddPost({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      urgency: newUrgency,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      branch: newBranch,
      year: Number(newYear),
      deadline: newDeadline || undefined
    });

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewCategory('Internships');
    setNewUrgency('Medium');
    setNewTags('');
    setNewDeadline('');
    setIsAddingPost(false);
  };

  const handleSubmitComment = (postId: string) => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      content: commentText,
      author: {
        id: user.id,
        name: user.name,
        role: user.role === 'senior' ? 'Senior' : 'Student',
        credibilityScore: user.credibilityScore
      },
      createdAt: new Date().toISOString()
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    onAddComment(postId, commentText);
    setCommentText('');
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'text-red-400 bg-red-950/40 border border-red-500/20';
      case 'High': return 'text-amber-400 bg-amber-950/40 border border-amber-500/20';
      case 'Medium': return 'text-indigo-400 bg-indigo-950/40 border border-indigo-500/20';
      default: return 'text-zinc-400 bg-zinc-800/40 border border-zinc-700/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Internships': return 'text-emerald-400 bg-emerald-950/30 border border-emerald-500/20';
      case 'Placements': return 'text-blue-400 bg-blue-950/30 border border-blue-500/20';
      case 'Scholarships': return 'text-pink-400 bg-pink-950/30 border border-pink-500/20';
      case 'Faculty Tips': return 'text-purple-400 bg-purple-950/30 border border-purple-500/20';
      case 'Hackathons': return 'text-amber-400 bg-amber-950/30 border border-amber-500/20';
      default: return 'text-cyan-400 bg-cyan-950/30 border border-cyan-500/20';
    }
  };

  // If viewing details of a post
  if (selectedPost) {
    const postComments = commentsMap[selectedPost.id] || [];
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 p-1 animate-fadeIn">
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-xs font-semibold self-start bg-white/3 border border-white/5 px-3 py-1.5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Feed</span>
        </button>

        {/* Main Post Card */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getCategoryColor(selectedPost.category)}`}>
                  {selectedPost.category}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getUrgencyBadge(selectedPost.urgency)}`}>
                  {selectedPost.urgency}
                </span>
                {selectedPost.deadline && (
                  <span className="text-[9px] text-pink-400 font-bold bg-pink-950/20 px-2 py-0.5 rounded border border-pink-500/10 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 animate-pulse" />
                    Due: {selectedPost.deadline}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-white leading-tight">
                {selectedPost.title}
              </h3>
            </div>

            <div className="flex flex-col items-center gap-1 bg-white/3 border border-white/5 rounded-xl p-2 shrink-0">
              <button 
                onClick={() => onVote(selectedPost.id, 'up')}
                className={`p-1.5 rounded-lg transition-colors ${selectedPost.hasUpvoted ? 'text-emerald-400 bg-emerald-950/25' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <span className="text-xs font-extrabold text-zinc-300">{selectedPost.upvotes - selectedPost.downvotes}</span>
              <button 
                onClick={() => onVote(selectedPost.id, 'down')}
                className={`p-1.5 rounded-lg transition-colors ${selectedPost.hasDownvoted ? 'text-rose-400 bg-rose-950/25' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed border-t border-white/5 pt-4">
            {selectedPost.description}
          </p>

          <div className="flex flex-wrap gap-1.5 py-1">
            {selectedPost.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-white/5 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedPost.author.avatarUrl} alt={selectedPost.author.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-zinc-200">{selectedPost.author.name}</p>
                <p className="text-[9px] text-zinc-500">Credibility: {selectedPost.author.credibilityScore} • {selectedPost.author.badge}</p>
              </div>
            </div>

            <div className="flex gap-4 text-zinc-500 font-semibold">
              <span>Branch: {selectedPost.branch}</span>
              <span>Year: {selectedPost.year} B.Tech</span>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 px-1">
            Replies ({postComments.length})
          </h4>

          {/* Add Comment Input */}
          <div className="glass-panel p-4 rounded-xl flex gap-3 border border-white/5">
            <div className="flex-1">
              <textarea 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Share your experience or ask a question..."
                className="w-full bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input placeholder-zinc-500 min-h-[70px] resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleSubmitComment(selectedPost.id)}
                  className="glow-btn px-4 py-2 rounded-lg text-xs font-semibold text-white hover:scale-105 active:scale-95 transition-all"
                >
                  Submit Reply
                </button>
              </div>
            </div>
          </div>

          {/* Comment List */}
          <div className="flex flex-col gap-3">
            {postComments.map((comment) => (
              <div 
                key={comment.id}
                className="p-4 rounded-xl bg-white/3 border border-white/5 flex gap-3 items-start animate-slideUp"
              >
                <CornerDownRight className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200">{comment.author.name}</span>
                      <span className="text-[9px] px-1.5 py-0.25 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold">
                        Credibility: {comment.author.credibilityScore}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed leading-normal whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Senior Intelligence Feed
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Democratizing hidden institutional knowledge and peer-verified referrals.
          </p>
        </div>

        <button 
          onClick={() => setIsAddingPost(true)}
          className="glow-btn px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Contribute Intel</span>
        </button>
      </div>

      {/* Categories Horizontal Scroller */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0 border-b border-white/5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all border ${
              activeCategory === cat 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-950/20' 
                : 'bg-white/3 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Search */}
      <div className="flex gap-3 relative max-w-md w-full">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by keywords, tags, or companies..." 
          className="w-full bg-white/3 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs glass-input placeholder-zinc-500"
        />
      </div>

      {/* New Post Creator Modal */}
      {isAddingPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel border border-white/10 rounded-2xl p-6 flex flex-col gap-4 animate-scaleIn shadow-2xl relative">
            <h3 className="text-lg font-black text-white border-b border-white/5 pb-2.5">
              Contribute College Opportunity Intel
            </h3>

            <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Opportunity Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Google STEP Internship 2026 Referral" 
                    className="bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input"
                    required
                  />
                </div>

                <div className="flex grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as OpportunityCategory)}
                      className="bg-zinc-950 border border-white/5 rounded-lg p-2.5 text-xs text-zinc-300"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Urgency</label>
                    <select
                      value={newUrgency}
                      onChange={e => setNewUrgency(e.target.value as any)}
                      className="bg-zinc-950 border border-white/5 rounded-lg p-2.5 text-xs text-zinc-300"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Intelligence Description</label>
                <textarea 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Provide precise details, steps to apply, unadvertised criteria, best tips for preparation..."
                  className="bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input min-h-[100px] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Branch Limit</label>
                  <input 
                    type="text" 
                    value={newBranch}
                    onChange={e => setNewBranch(e.target.value)}
                    placeholder="e.g. All Branches, CSE" 
                    className="bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Eligible Year</label>
                  <input 
                    type="number" 
                    value={newYear}
                    onChange={e => setNewYear(Number(e.target.value))}
                    min={1}
                    max={4}
                    className="bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Deadline (Optional)</label>
                  <input 
                    type="date" 
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    className="bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input text-zinc-300"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="Referral, Python, Google, Placement" 
                  className="bg-white/3 border border-white/5 rounded-lg p-2.5 text-xs text-white glass-input"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingPost(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glow-btn px-5 py-2 rounded-lg text-xs font-semibold text-white hover:scale-105 active:scale-95 transition-all"
                >
                  Publish Intelligence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Feed List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.length === 0 ? (
          <div className="col-span-2 text-center py-16 text-zinc-500 font-medium text-xs">
            No opportunities matched your search filters. Be the first to add one!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id}
              className="p-5 rounded-2xl glass-panel border border-white/5 hover:border-indigo-500/20 transition-all duration-200 flex flex-col justify-between gap-3 relative overflow-hidden group"
            >
              <div>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider ${getUrgencyBadge(post.urgency)}`}>
                        {post.urgency}
                      </span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 shadow-sm flex items-center gap-0.5">
                        ⚡ {getMatchScore(post)}% Match
                      </span>
                      {post.deadline && (
                        <span className="text-[8px] text-pink-400 font-bold bg-pink-950/20 px-1.5 py-0.5 rounded border border-pink-500/10 flex items-center gap-0.5">
                          <Clock className="w-2 h-2" />
                          Due: {post.deadline}
                        </span>
                      )}
                    </div>
                    <h3 
                      onClick={() => setSelectedPost(post)}
                      className="text-sm font-extrabold text-zinc-100 hover:text-indigo-400 transition-colors cursor-pointer leading-tight line-clamp-1"
                    >
                      {post.title}
                    </h3>
                  </div>

                  <div className="flex flex-col items-center bg-white/3 border border-white/5 rounded-lg py-1 px-1.5 shrink-0">
                    <button 
                      onClick={() => onVote(post.id, 'up')}
                      className={`p-0.5 rounded transition-colors ${post.hasUpvoted ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-black text-zinc-300">{post.upvotes - post.downvotes}</span>
                    <button 
                      onClick={() => onVote(post.id, 'down')}
                      className={`p-0.5 rounded transition-colors ${post.hasDownvoted ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mt-2.5">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-3.5">
                  {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.25 rounded bg-zinc-950 border border-zinc-800/80 text-zinc-500 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-3.5 mt-2.5 text-[10px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-white/10 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-300">{post.author.name}</span>
                    <span className="text-[8px] text-zinc-500 ml-1 bg-zinc-900 px-1 py-0.25 rounded border border-zinc-800">
                      {post.author.badge}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPost(post)}
                  className="font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.commentsCount} Replies</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
