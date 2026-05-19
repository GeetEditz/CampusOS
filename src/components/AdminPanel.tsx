'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Trash2, 
  Brain, 
  TrendingUp, 
  RefreshCw,
  Mail,
  UserCheck,
  AlertTriangle,
  Send,
  Loader2,
  Bell,
  Megaphone,
  Crown,
  Power,
  Plus,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import { UserProfile, Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function AdminPanel() {
  const { userProfile, posts, setPosts } = useApp();
  const { toast } = useToast();
  
  // States
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [auditRunning, setAuditRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'students' | 'posts' | 'ai-placement' | 'notifications' | 'ticker' | 'roles'>('students');

  // AI Placement campaign form state
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering');
  const [minCredibility, setMinCredibility] = useState(150);
  const [driveUrgency, setDriveUrgency] = useState<'High' | 'Critical'>('High');
  const [aiDrafting, setAiDrafting] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [placementCategory, setPlacementCategory] = useState<'Placements' | 'Internships'>('Placements');

  // Notification broadcaster state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'alert' | 'deadline' | 'trending' | 'placement'>('alert');
  const [notifTimeRemaining, setNotifTimeRemaining] = useState('');
  const [sendingNotif, setSendingNotif] = useState(false);

  // Ticker management state
  interface TickerItem { id: string; icon: string; message: string; highlight_text: string; highlight_color: string; is_active: boolean; }
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [loadingTicker, setLoadingTicker] = useState(true);
  const [newTickerIcon, setNewTickerIcon] = useState('📢');
  const [newTickerMsg, setNewTickerMsg] = useState('');
  const [newTickerHighlight, setNewTickerHighlight] = useState('');

  // Fetch profiles and ticker on mount
  useEffect(() => {
    fetchProfiles();
    fetchTicker();
  }, []);

  async function fetchProfiles() {
    if (!supabase) return;
    setLoadingProfiles(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('credibility_score', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const mapped: UserProfile[] = data.map(p => ({
          id: p.id,
          name: p.name,
          email: p.email,
          avatarUrl: p.avatar_url,
          role: p.role as any,
          branch: p.branch,
          year: p.year,
          skills: p.skills || [],
          interests: p.interests || [],
          credibilityScore: p.credibility_score || 0,
          badge: p.badge as any,
          ssoLinked: p.sso_linked || false,
          ssoProvider: p.sso_provider as any
        }));
        setProfiles(mapped);
      }
    } catch (err: any) {
      console.error('Error fetching profiles:', err.message);
    } finally {
      setLoadingProfiles(false);
    }
  }

  // Fetch ticker announcements
  async function fetchTicker() {
    if (!supabase) return;
    setLoadingTicker(true);
    try {
      const { data, error } = await supabase.from('ticker_announcements').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setTickerItems(data as TickerItem[]);
    } catch (err: any) {
      console.error('Error fetching ticker:', err.message);
    } finally {
      setLoadingTicker(false);
    }
  }

  // Broadcast notification to all students
  async function broadcastNotification() {
    if (!supabase || !notifTitle.trim() || !notifMessage.trim()) {
      toast({ title: 'Fields Required', description: 'Title and message are required.', variant: 'destructive' });
      return;
    }
    setSendingNotif(true);
    try {
      const studentProfiles = profiles.filter(p => p.role !== 'admin');
      const notifRows = studentProfiles.map(p => ({
        user_id: p.id,
        title: notifTitle,
        message: notifMessage,
        type: notifType,
        time_remaining: notifTimeRemaining || null,
        read: false
      }));
      if (notifRows.length > 0) {
        const { error } = await supabase.from('notifications').insert(notifRows);
        if (error) throw error;
      }
      toast({ title: 'Notification Broadcasted!', description: `Sent to ${studentProfiles.length} student(s).`, variant: 'success' });
      setNotifTitle(''); setNotifMessage(''); setNotifTimeRemaining('');
    } catch (err: any) {
      toast({ title: 'Broadcast Failed', description: err.message, variant: 'destructive' });
    } finally {
      setSendingNotif(false);
    }
  }

  // Add new ticker announcement
  async function addTickerItem() {
    if (!supabase || !newTickerMsg.trim()) {
      toast({ title: 'Message Required', description: 'Enter a ticker message.', variant: 'destructive' });
      return;
    }
    try {
      const { data, error } = await supabase.from('ticker_announcements').insert({
        icon: newTickerIcon, message: newTickerMsg, highlight_text: newTickerHighlight, highlight_color: 'text-zinc-200', is_active: true
      }).select().single();
      if (error) throw error;
      if (data) setTickerItems(prev => [data as TickerItem, ...prev]);
      toast({ title: 'Ticker Added!', description: 'New announcement is now live on the ticker bar.', variant: 'success' });
      setNewTickerMsg(''); setNewTickerHighlight('');
    } catch (err: any) {
      toast({ title: 'Add Failed', description: err.message, variant: 'destructive' });
    }
  }

  // Delete ticker
  async function deleteTickerItem(id: string) {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('ticker_announcements').delete().eq('id', id);
      if (error) throw error;
      setTickerItems(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Ticker Removed', variant: 'success' });
    } catch (err: any) {
      toast({ title: 'Delete Failed', description: err.message, variant: 'destructive' });
    }
  }

  // Toggle ticker active state
  async function toggleTickerItem(id: string, current: boolean) {
    if (!supabase) return;
    setTickerItems(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t));
    try {
      const { error } = await supabase.from('ticker_announcements').update({ is_active: !current }).eq('id', id);
      if (error) throw error;
    } catch { fetchTicker(); }
  }

  // Promote user role
  async function promoteRole(userId: string, newRole: 'student' | 'senior' | 'admin') {
    if (!supabase) return;
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole as any } : p));
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      toast({ title: 'Role Updated', description: `User promoted to ${newRole}.`, variant: 'success' });
      fetchProfiles();
    } catch (err: any) {
      toast({ title: 'Promotion Failed', description: err.message, variant: 'destructive' });
      fetchProfiles();
    }
  }

  // Handle Credibility Adjustments
  async function adjustCredibility(userId: string, currentScore: number, amount: number) {
    if (!supabase) return;
    const newScore = Math.max(0, currentScore + amount);
    
    // Optimistic Update
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, credibilityScore: newScore } : p));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ credibility_score: newScore })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Score Adjusted Successfully',
        description: `Successfully modified user credibility score to ${newScore} points.`,
        variant: 'success'
      });
      
      // Refresh to update badge calculated by the trigger
      fetchProfiles();
    } catch (err: any) {
      toast({
        title: 'Adjustment Failed',
        description: err.message,
        variant: 'destructive'
      });
      fetchProfiles(); // Revert
    }
  }

  // Toggle SSO Verification Status manually
  async function toggleSSOStatus(userId: string, currentStatus: boolean) {
    if (!supabase) return;
    const newStatus = !currentStatus;
    
    // Optimistic Update
    setProfiles(prev => prev.map(p => p.id === userId ? { ...p, ssoLinked: newStatus, ssoProvider: newStatus ? 'google' : undefined } : p));
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          sso_linked: newStatus,
          sso_provider: newStatus ? 'google' : null
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'SSO Link Toggled',
        description: `User SSO verification is now ${newStatus ? 'Verified' : 'Unlinked'}.`,
        variant: 'success'
      });
    } catch (err: any) {
      toast({
        title: 'SSO Toggle Failed',
        description: err.message,
        variant: 'destructive'
      });
      fetchProfiles(); // Revert
    }
  }

  // Delete Post
  async function handleModerationDeletePost(postId: string) {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(p => p.id !== postId));
      
      toast({
        title: 'Post Moderated',
        description: 'Selected post was permanently deleted from the CampusOS database.',
        variant: 'success'
      });
    } catch (err: any) {
      toast({
        title: 'Moderation Failed',
        description: err.message,
        variant: 'destructive'
      });
    }
  }

  // Certify Official Tip / Post
  async function handleCertifyPost(postId: string) {
    if (!supabase) return;
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newTags = [...post.tags];
      if (!newTags.includes('OFFICIAL TIP')) {
        newTags.push('OFFICIAL TIP');
      }
      
      // Give the post author a credibility bonus of 25 points
      const authorId = post.author.id;
      
      const { error } = await supabase
        .from('posts')
        .update({ tags: newTags, urgency: 'Critical' })
        .eq('id', postId);

      if (error) throw error;

      // Update author score in remote database
      const { data: profileData } = await supabase.from('profiles').select('credibility_score').eq('id', authorId).single();
      if (profileData) {
        await supabase.from('profiles').update({ credibility_score: profileData.credibility_score + 25 }).eq('id', authorId);
      }

      // Update local state
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, tags: newTags, urgency: 'Critical' } : p));
      
      toast({
        title: 'Post Certified!',
        description: 'Post marked as OFFICIAL TIP. Author awarded +25 Credibility points.',
        variant: 'success'
      });
      
      fetchProfiles();
    } catch (err: any) {
      toast({
        title: 'Certification Failed',
        description: err.message,
        variant: 'destructive'
      });
    }
  }

  // Trigger SSO Audit Simulation
  function runSSOAudit() {
    setAuditRunning(true);
    setTimeout(() => {
      setAuditRunning(false);
      toast({
        title: 'SSO Sync Audit Complete',
        description: `Verified ${profiles.filter(p => p.ssoLinked).length} active institutional connections.`,
        variant: 'success'
      });
    }, 2500);
  }

  // Draft Administrative Bulletin using NVIDIA NIM Llama 3.1
  async function handleDraftPlacementDrive() {
    if (!companyName.trim() || !roleTitle.trim()) {
      toast({
        title: 'Fields Required',
        description: 'Please input the company name and role title to begin.',
        variant: 'destructive'
      });
      return;
    }

    setAiDrafting(true);
    setGeneratedDraft('');

    try {
      const response = await fetch('/api/nvidia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a highly professional and enticing university placement bulletin for a recruitment drive at "${companyName}" for the role of "${roleTitle}". This drive is targeting students from "${selectedBranch}". The minimum credibility rating required is ${minCredibility}. Emphasize the critical placement schedule, compatibility index alignment, and explain that only students with verified SSO accounts can submit applications. Keep it highly detailed, professional, structured with bullet points, and written in a supportive but authoritative tone.`
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setGeneratedDraft(data.text);
      } else {
        throw new Error(data.error || 'NVIDIA NIM failed to generate the bulletin draft.');
      }
    } catch (err: any) {
      toast({
        title: 'NVIDIA NIM Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setAiDrafting(false);
    }
  }

  // Insert generated placement drive post to feed
  async function handlePublishPlacementDrive() {
    if (!supabase || !generatedDraft) return;

    try {
      const newPostObj = {
        title: `🔴 Off-Campus Drive: ${companyName} - ${roleTitle}`,
        description: generatedDraft,
        category: placementCategory,
        urgency: driveUrgency,
        tags: ['PLACEMENT DRIVE', 'SSO REQUIRED', 'VERIFIED'],
        branch: selectedBranch,
        year: 4, // Final year target
        author_id: userProfile.id,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(newPostObj)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const fullPost: Post = {
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category as any,
          urgency: data.urgency as any,
          tags: data.tags || [],
          branch: data.branch,
          year: data.year,
          author: {
            id: userProfile.id,
            name: userProfile.name,
            avatarUrl: userProfile.avatarUrl,
            role: 'Placement Office',
            credibilityScore: 9999,
            badge: 'Admin'
          },
          upvotes: 0,
          downvotes: 0,
          commentsCount: 0,
          createdAt: data.created_at,
          deadline: data.deadline
        };

        setPosts(prev => [fullPost, ...prev]);
        toast({
          title: 'Administrative Bulletin Live!',
          description: `Placement bulletin successfully broadcasted to ${selectedBranch} channels.`,
          variant: 'success'
        });

        // Reset Form
        setCompanyName('');
        setRoleTitle('');
        setGeneratedDraft('');
        setActiveTab('posts');
      }
    } catch (err: any) {
      toast({
        title: 'Publishing Failed',
        description: err.message,
        variant: 'destructive'
      });
    }
  }

  // Filter profiles based on search
  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-1 animate-fadeIn">
      
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-primary animate-pulse" />
            Verification Hub & Admin Cockpit
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            College directory manager, SSO linkage oversight, credential moderation, and NVIDIA NIM campaign scheduler.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runSSOAudit}
            disabled={auditRunning}
            className="px-3.5 py-1.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 text-[10px] text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {auditRunning ? <Loader2 className="w-3 h-3 animate-spin text-primary" /> : <RefreshCw className="w-3 h-3" />}
            <span>{auditRunning ? 'Auditing Nodes...' : 'Audit SSO Nodes'}</span>
          </button>
        </div>
      </div>

      {/* Admin Metrics HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="p-4 rounded-xl bg-white/[0.015] border border-white/5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Active Students</p>
            <h3 className="text-lg font-black text-white mt-0.5">{profiles.length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.015] border border-white/5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none"></div>
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl text-cyan-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Verified SSOs</p>
            <h3 className="text-lg font-black text-white mt-0.5">{profiles.filter(p => p.ssoLinked).length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.015] border border-white/5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Intel Posts</p>
            <h3 className="text-lg font-black text-white mt-0.5">{posts.length}</h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.015] border border-white/5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none"></div>
          <div className="p-3 bg-amber-950/40 border border-amber-500/20 rounded-xl text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Avg Credibility</p>
            <h3 className="text-lg font-black text-white mt-0.5">
              {profiles.length ? Math.round(profiles.reduce((acc, curr) => acc + curr.credibilityScore, 0) / profiles.length) : 0} PTS
            </h3>
          </div>
        </div>
      </div>

      {/* Admin Operations Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Operations Panel Selector */}
        <div className="lg:col-span-3 flex flex-col gap-2 p-1.5 bg-white/[0.015] border border-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'students'
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Verification Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'posts'
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Intel Feed Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-placement')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'ai-placement'
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
            }`}
          >
            <Brain className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="flex-grow">NIM Placement Bulletin</span>
            <Badge className="bg-emerald-950/40 text-emerald-400 border-emerald-500/20 text-[7px] font-black tracking-widest px-1 py-0.5">NIM</Badge>
          </button>

          <div className="border-t border-white/5 my-1"></div>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'notifications'
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Broadcaster</span>
          </button>

          <button
            onClick={() => setActiveTab('ticker')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'ticker'
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Live Ticker Control</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
              activeTab === 'roles'
                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Role & Promotion Manager</span>
          </button>
        </div>

        {/* Right Side Content Display area */}
        <div className="lg:col-span-9 glass-panel border border-white/5 rounded-2xl p-6 min-h-[450px]">
          
          {/* TAB 1: Student Verification Directory */}
          {activeTab === 'students' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-black text-white">Student Verification Directory</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">Verify university email links, reset credibility scores, or grant bonus contributions.</p>
                </div>

                <div className="relative w-full sm:max-w-xs shrink-0">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, branch..."
                    className="pl-8 bg-white/3 border border-white/5 rounded-xl text-xs"
                  />
                </div>
              </div>

              {loadingProfiles ? (
                <div className="h-48 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs">
                  <AlertTriangle className="w-6 h-6 text-zinc-600" />
                  <span>No student profiles match your search criteria.</span>
                </div>
              ) : (
                <div className="overflow-x-auto w-full border border-white/5 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/[0.015] border-b border-white/5 text-[9px] uppercase font-black text-zinc-500 tracking-wider">
                        <th className="p-3.5">Student Details</th>
                        <th className="p-3.5">Division & Year</th>
                        <th className="p-3.5">SSO State</th>
                        <th className="p-3.5">Score / Badge</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProfiles.map(profile => (
                        <tr key={profile.id} className="hover:bg-white/[0.01] transition-all">
                          <td className="p-3.5">
                            <div className="font-bold text-zinc-200">{profile.name}</div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-zinc-600" />
                              {profile.email}
                            </div>
                          </td>
                          <td className="p-3.5 text-zinc-300">
                            <div>{profile.branch}</div>
                            <div className="text-[10px] text-zinc-500 font-semibold mt-0.5">Year: {profile.year}</div>
                          </td>
                          <td className="p-3.5">
                            {profile.ssoLinked ? (
                              <Badge className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                                {profile.ssoProvider || 'google'}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-zinc-900 text-zinc-500 border border-zinc-800 text-[9px] font-bold">
                                Unlinked
                              </Badge>
                            )}
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-white">{profile.credibilityScore} PTS</div>
                            <Badge className="text-[8px] bg-primary/10 text-primary border border-primary/20 font-black mt-1 px-1.5 py-0.25">
                              {profile.badge || 'Rookie'}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => toggleSSOStatus(profile.id, !!profile.ssoLinked)}
                              className="px-2 py-1 rounded bg-white/3 border border-white/5 hover:bg-white/5 text-[9px] font-bold text-zinc-300 cursor-pointer"
                            >
                              SSO Link
                            </button>
                            <button
                              onClick={() => adjustCredibility(profile.id, profile.credibilityScore, 25)}
                              className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/20 hover:bg-emerald-950/60 text-[9px] font-bold text-emerald-400 cursor-pointer"
                            >
                              +25 PTS
                            </button>
                            <button
                              onClick={() => adjustCredibility(profile.id, profile.credibilityScore, -50)}
                              className="px-2 py-1 rounded bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-[9px] font-bold text-red-400 cursor-pointer"
                            >
                              -50 PTS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Intel Feed Moderation */}
          {activeTab === 'posts' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-black text-white">Intel Feed Moderation</h3>
                <p className="text-[10px] text-zinc-500 font-medium">Verify official placement tips and delete/flag spammed student comments or drive notifications.</p>
              </div>

              {posts.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs">
                  <AlertTriangle className="w-6 h-6 text-zinc-600" />
                  <span>No student intel is currently active in the database.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {posts.map(post => (
                    <div key={post.id} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex justify-between gap-4 group">
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                            {post.category}
                          </span>
                          <span className="text-[9.5px] font-bold text-zinc-400">
                            By {post.author.name} ({post.author.role})
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{post.title}</h4>
                        <p className="text-[10px] text-zinc-500 line-clamp-2 max-w-xl">{post.description}</p>
                        
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {post.tags.map(t => (
                            <Badge key={t} variant="secondary" className="bg-emerald-950/20 text-emerald-400 border border-emerald-500/10 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.25">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col sm:flex-row items-center justify-center gap-2">
                        {!post.tags.includes('OFFICIAL TIP') && (
                          <Button
                            onClick={() => handleCertifyPost(post.id)}
                            size="sm"
                            className="bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60 border border-emerald-500/30 text-[9px] font-bold h-7 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Certify Tip</span>
                          </Button>
                        )}
                        <Button
                          onClick={() => handleModerationDeletePost(post.id)}
                          size="sm"
                          variant="destructive"
                          className="text-[9px] font-bold h-7 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NVIDIA NIM Placement Campaign Bulletin */}
          {activeTab === 'ai-placement' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-emerald-400" />
                  NVIDIA NIM Placement Drive Bulletin Generator
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">Use the Llama 3.1 LLM engine to synthesize and broadcast official campus drives directly into the student opportunity feeds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/5 pt-4">
                
                {/* Form fields */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Recruiting Company</label>
                    <Input
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. JPMorgan Chase, NVIDIA"
                      className="bg-white/3 border border-white/5 rounded-xl text-xs py-2 h-9"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Job Role / Designation</label>
                    <Input
                      value={roleTitle}
                      onChange={e => setRoleTitle(e.target.value)}
                      placeholder="e.g. Full Stack Developer, DevOps Engineer"
                      className="bg-white/3 border border-white/5 rounded-xl text-xs py-2 h-9"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Campaign Category</label>
                      <select
                        value={placementCategory}
                        onChange={e => setPlacementCategory(e.target.value as any)}
                        className="bg-zinc-950 border border-white/5 rounded-xl p-2 text-xs text-zinc-300 font-semibold"
                      >
                        <option value="Placements">Placements</option>
                        <option value="Internships">Internships</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Managing Branch</label>
                      <select
                        value={selectedBranch}
                        onChange={e => setSelectedBranch(e.target.value)}
                        className="bg-zinc-950 border border-white/5 rounded-xl p-2 text-xs text-zinc-300 font-semibold"
                      >
                        <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                        <option value="Electronics & Communication">Electronics (ECE)</option>
                        <option value="Information Technology">Information Tech (IT)</option>
                        <option value="All Branches">All Branches</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Min Credibility score Required</label>
                      <Input
                        type="number"
                        value={minCredibility}
                        onChange={e => setMinCredibility(Number(e.target.value))}
                        className="bg-white/3 border border-white/5 rounded-xl text-xs py-2 h-9"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Drive Urgency Level</label>
                      <select
                        value={driveUrgency}
                        onChange={e => setDriveUrgency(e.target.value as any)}
                        className="bg-zinc-950 border border-white/5 rounded-xl p-2 text-xs text-zinc-300 font-semibold"
                      >
                        <option value="High">High Urgency</option>
                        <option value="Critical">Critical Urgency</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleDraftPlacementDrive}
                    disabled={aiDrafting}
                    className="glow-btn text-xs font-bold text-white w-full h-10 flex items-center justify-center gap-2 mt-2"
                  >
                    {aiDrafting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Synthesizing Draft...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Synthesize AI Bulletin Draft</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* AI Draft Display Section */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.01] border border-white/5 relative overflow-hidden min-h-[300px]">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-950/40 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-bl-lg border-l border-b border-emerald-500/20">
                    Live Draft Sandbox
                  </div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">NIM Generated Content</label>
                  
                  {generatedDraft ? (
                    <div className="flex-grow flex flex-col justify-between gap-4 mt-2">
                      <textarea
                        value={generatedDraft}
                        onChange={e => setGeneratedDraft(e.target.value)}
                        className="w-full flex-grow bg-zinc-950 border border-white/5 rounded-xl p-3 text-xs text-zinc-300 leading-relaxed resize-none overflow-y-auto outline-none focus:border-primary/25 min-h-[220px]"
                      />
                      <Button
                        onClick={handlePublishPlacementDrive}
                        className="w-full h-9 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center gap-1.5 hover:scale-101 active:scale-99"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Broadcast Live to Opportunities Feed</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col items-center justify-center gap-2.5 text-center px-4">
                      {aiDrafting ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-6 h-6 rounded-full border border-emerald-400 border-t-transparent animate-spin"></div>
                          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest animate-pulse">Running Llama 3.1 NIM Agent...</span>
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-7 h-7 text-zinc-600 animate-pulse" />
                          <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                            Formulate placement parameters and click Synthesize. The AI Mentor will scan parameters and structure a high-fidelity campaign bulletin.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Notification Broadcaster */}
          {activeTab === 'notifications' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  Campus-Wide Notification Broadcaster
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">Push urgent alerts, deadline warnings, and placement announcements directly to every student&apos;s AI Engagement Scanner.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-white/5 pt-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Notification Title</label>
                    <Input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="e.g. Placement Drive Alert" className="bg-white/3 border border-white/5 rounded-xl text-xs h-9" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Message Body</label>
                    <textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="Write the notification message..." className="w-full bg-zinc-950 border border-white/5 rounded-xl p-3 text-xs text-zinc-300 resize-none outline-none focus:border-primary/25 min-h-[100px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Alert Type</label>
                      <select value={notifType} onChange={e => setNotifType(e.target.value as any)} className="bg-zinc-950 border border-white/5 rounded-xl p-2 text-xs text-zinc-300 font-semibold">
                        <option value="alert">General Alert</option>
                        <option value="deadline">Deadline Warning</option>
                        <option value="trending">Trending Notice</option>
                        <option value="placement">Placement Update</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Time Remaining (opt.)</label>
                      <Input value={notifTimeRemaining} onChange={e => setNotifTimeRemaining(e.target.value)} placeholder="e.g. 2 days left" className="bg-white/3 border border-white/5 rounded-xl text-xs h-9" />
                    </div>
                  </div>
                  <Button onClick={broadcastNotification} disabled={sendingNotif} className="glow-btn text-xs font-bold text-white w-full h-10 flex items-center justify-center gap-2 mt-2">
                    {sendingNotif ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Broadcasting...</span></> : <><Send className="w-3.5 h-3.5" /><span>Broadcast to All Students</span></>}
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-950/40 text-amber-400 text-[8px] font-black uppercase tracking-widest rounded-bl-lg border-l border-b border-amber-500/20">Preview</div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Live Preview</label>
                  <div className={`p-3.5 rounded-xl border flex flex-col gap-1.5 mt-2 ${notifType === 'deadline' ? 'bg-red-950/15 border-red-500/25' : 'bg-white/3 border-white/5'}`}>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-200 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${notifType === 'deadline' ? 'bg-red-500 animate-ping' : notifType === 'trending' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
                        {notifTitle || 'Notification Title'}
                      </span>
                      {notifTimeRemaining && <span className="text-[9px] text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.25 rounded border border-amber-500/20 animate-pulse">{notifTimeRemaining}</span>}
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-zinc-400 font-medium">{notifMessage || 'Message body will appear here...'}</p>
                  </div>
                  <p className="text-[9px] text-zinc-600 mt-2">This notification will be pushed to <span className="text-primary font-bold">{profiles.filter(p => p.role !== 'admin').length}</span> student profiles.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Live Ticker Control */}
          {activeTab === 'ticker' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-cyan-400" />
                  Live Ticker Announcement Control
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">Manage the scrolling ticker bar visible at the top of every student&apos;s dashboard. Add, toggle, or remove announcements in real-time.</p>
              </div>

              {/* Add new ticker form */}
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col gap-3">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Add New Ticker Announcement</label>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-1">
                    <Input value={newTickerIcon} onChange={e => setNewTickerIcon(e.target.value)} className="bg-white/3 border border-white/5 rounded-xl text-xs h-9 text-center" maxLength={2} />
                  </div>
                  <div className="col-span-5">
                    <Input value={newTickerMsg} onChange={e => setNewTickerMsg(e.target.value)} placeholder="Ticker message text..." className="bg-white/3 border border-white/5 rounded-xl text-xs h-9" />
                  </div>
                  <div className="col-span-3">
                    <Input value={newTickerHighlight} onChange={e => setNewTickerHighlight(e.target.value)} placeholder="Highlight text (opt.)" className="bg-white/3 border border-white/5 rounded-xl text-xs h-9" />
                  </div>
                  <div className="col-span-3">
                    <Button onClick={addTickerItem} className="w-full h-9 bg-cyan-950/40 text-cyan-400 hover:bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-bold flex items-center justify-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /><span>Add Ticker</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Ticker items list */}
              <div className="border-t border-white/5 pt-4">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-3 block">Active Announcements ({tickerItems.length})</label>
                {loadingTicker ? (
                  <div className="h-32 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : tickerItems.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs"><Megaphone className="w-6 h-6 text-zinc-600" /><span>No ticker announcements found.</span></div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {tickerItems.map(item => (
                      <div key={item.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${item.is_active ? 'bg-white/[0.01] border-white/5' : 'bg-zinc-950/50 border-zinc-900 opacity-50'}`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg shrink-0">{item.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs text-zinc-300 truncate">{item.highlight_text && <span className="text-primary font-bold">{item.highlight_text} </span>}{item.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => toggleTickerItem(item.id, item.is_active)} className={`px-2 py-1 rounded text-[9px] font-bold cursor-pointer ${item.is_active ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                            <Power className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteTickerItem(item.id)} className="px-2 py-1 rounded bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-[9px] font-bold text-red-400 cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Role & Promotion Manager */}
          {activeTab === 'roles' && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Role & Promotion Manager
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">Promote students to Senior Mentors or grant Admin access. Role changes update badge calculations and feed permissions instantly.</p>
              </div>

              <div className="overflow-x-auto w-full border border-white/5 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/[0.015] border-b border-white/5 text-[9px] uppercase font-black text-zinc-500 tracking-wider">
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Current Role</th>
                      <th className="p-3.5">Badge</th>
                      <th className="p-3.5">Score</th>
                      <th className="p-3.5 text-right">Promote</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {profiles.filter(p => p.id !== userProfile.id).map(profile => (
                      <tr key={profile.id} className="hover:bg-white/[0.01] transition-all">
                        <td className="p-3.5">
                          <div className="font-bold text-zinc-200">{profile.name}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{profile.email}</div>
                        </td>
                        <td className="p-3.5">
                          <Badge className={`text-[9px] font-bold ${profile.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : profile.role === 'senior' ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}>
                            {profile.role}
                          </Badge>
                        </td>
                        <td className="p-3.5"><Badge className="text-[8px] bg-primary/10 text-primary border border-primary/20 font-black px-1.5 py-0.25">{profile.badge || 'Rookie'}</Badge></td>
                        <td className="p-3.5 text-zinc-300 font-bold">{profile.credibilityScore} PTS</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {profile.role !== 'student' && (
                              <button onClick={() => promoteRole(profile.id, 'student')} className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-[9px] font-bold text-zinc-400 cursor-pointer">Student</button>
                            )}
                            {profile.role !== 'senior' && (
                              <button onClick={() => promoteRole(profile.id, 'senior')} className="px-2 py-1 rounded bg-amber-950/40 border border-amber-500/20 hover:bg-amber-950/60 text-[9px] font-bold text-amber-400 cursor-pointer">Senior</button>
                            )}
                            {profile.role !== 'admin' && (
                              <button onClick={() => promoteRole(profile.id, 'admin')} className="px-2 py-1 rounded bg-primary/10 border border-primary/20 hover:bg-primary/20 text-[9px] font-bold text-primary cursor-pointer">Admin</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
