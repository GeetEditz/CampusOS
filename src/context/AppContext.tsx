'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserProfile, Post, Notification } from '@/lib/types';
import { MOCK_POSTS, MOCK_NOTIFICATIONS, INITIAL_USER, DEMO_PRELOAD_STATE } from '@/lib/mockData';

interface AppContextType {
  // Auth & Onboarding
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  authStep: 'login' | 'onboarding';
  setAuthStep: (step: 'login' | 'onboarding') => void;
  loginPath: 'student' | 'judge' | 'institutional';
  setLoginPath: (path: 'student' | 'judge' | 'institutional') => void;
  
  // Login Inputs
  emailInput: string;
  setEmailInput: (val: string) => void;
  passwordInput: string;
  setPasswordInput: (val: string) => void;

  // Onboarding Inputs
  onboardName: string;
  setOnboardName: (val: string) => void;
  onboardBranch: string;
  setOnboardBranch: (val: string) => void;
  onboardYear: number;
  setOnboardYear: (val: number) => void;
  onboardSkills: string[];
  setOnboardSkills: (val: string[]) => void;
  newSkillInput: string;
  setNewSkillInput: (val: string) => void;
  onboardInterests: string[];
  setOnboardInterests: (val: string[]) => void;
  newInterestInput: string;
  setNewInterestInput: (val: string) => void;

  // Global Workspace Data
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  selectedFeedPost: Post | null;
  setSelectedFeedPost: (post: Post | null) => void;

  // Command & Modal Modifiers
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (val: boolean) => void;
  commandSearchQuery: string;
  setCommandSearchQuery: (val: string) => void;
  showShortcutHelper: boolean;
  setShowShortcutHelper: (val: boolean) => void;

  // Handlers
  saveProfileState: (profile: UserProfile) => void;
  savePostsState: (updatedPosts: Post[]) => void;
  handleDemoLogin: () => void;
  handleLogin: (e: React.FormEvent) => void;
  handleOnboardingComplete: (e: React.FormEvent) => void;
  handleLogout: () => void;
  handleAddPost: (newPostData: Omit<Post, 'id' | 'createdAt' | 'author' | 'upvotes' | 'downvotes' | 'commentsCount'>) => void;
  handleVote: (postId: string, voteType: 'up' | 'down') => void;
  handleAddComment: (postId: string, content: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Authentication & Onboarding States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'login' | 'onboarding'>('login');
  const [loginPath, setLoginPath] = useState<'student' | 'judge' | 'institutional'>('judge');
  
  // Login Form States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Onboarding Form States
  const [onboardName, setOnboardName] = useState('');
  const [onboardBranch, setOnboardBranch] = useState('Computer Science & Engineering');
  const [onboardYear, setOnboardYear] = useState<number>(3);
  const [onboardSkills, setOnboardSkills] = useState<string[]>(['React', 'Next.js', 'Python']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [onboardInterests, setOnboardInterests] = useState<string[]>(['Artificial Intelligence', 'Full Stack Development']);
  const [newInterestInput, setNewInterestInput] = useState('');

  // Active Workspace State
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedFeedPost, setSelectedFeedPost] = useState<Post | null>(null);

  // Command Palette & Keyboard Shortcuts States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearchQuery, setCommandSearchQuery] = useState('');
  const [showShortcutHelper, setShowShortcutHelper] = useState(false);

  // Load from local storage
  useEffect(() => {
    const cachedProfile = localStorage.getItem('campusos_profile');
    const cachedPosts = localStorage.getItem('campusos_posts');
    const cachedAuth = localStorage.getItem('campusos_auth');

    if (cachedProfile) {
      setUserProfile(JSON.parse(cachedProfile));
    }
    if (cachedPosts) {
      setPosts(JSON.parse(cachedPosts));
    }
    if (cachedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state helpers
  const saveProfileState = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('campusos_profile', JSON.stringify(profile));
  };

  const savePostsState = (updatedPosts: Post[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('campusos_posts', JSON.stringify(updatedPosts));
  };

  const handleDemoLogin = () => {
    saveProfileState(DEMO_PRELOAD_STATE.user);
    savePostsState(DEMO_PRELOAD_STATE.posts);
    setNotifications(DEMO_PRELOAD_STATE.notifications);
    setIsAuthenticated(true);
    localStorage.setItem('campusos_auth', 'true');
    router.push('/dashboard');
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setAuthStep('onboarding');
  };

  // Onboarding handler
  const handleOnboardingComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim()) return;

    const newProfile: UserProfile = {
      id: `u-${Date.now()}`,
      name: onboardName,
      email: emailInput || 'demo@university.edu',
      role: 'student',
      branch: onboardBranch,
      year: onboardYear,
      skills: onboardSkills,
      interests: onboardInterests,
      credibilityScore: 42,
      badge: 'Rookie'
    };

    saveProfileState(newProfile);
    setIsAuthenticated(true);
    localStorage.setItem('campusos_auth', 'true');
    router.push('/dashboard');
  };

  // Sign out handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthStep('login');
    localStorage.removeItem('campusos_auth');
    router.push('/dashboard');
  };

  // Feed handlers
  const handleAddPost = (newPostData: Omit<Post, 'id' | 'createdAt' | 'author' | 'upvotes' | 'downvotes' | 'commentsCount'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      commentsCount: 0,
      author: {
        id: userProfile.id,
        name: userProfile.name,
        avatarUrl: userProfile.avatarUrl,
        role: userProfile.role === 'senior' ? 'Senior (4th Year)' : 'Student',
        credibilityScore: userProfile.credibilityScore,
        badge: userProfile.badge
      }
    };

    const updated = [newPost, ...posts];
    savePostsState(updated);

    // Trigger notification
    const newAlert: Notification = {
      id: `notif-${Date.now()}`,
      title: 'Intel Shared successfully!',
      message: `Your post "${newPostData.title}" has been published to the Senior Feed.`,
      type: 'alert',
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications([newAlert, ...notifications]);
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    const updated = posts.map(post => {
      if (post.id !== postId) return post;
      
      let upvoteDiff = 0;
      let downvoteDiff = 0;
      let hasUpvoted = post.hasUpvoted;
      let hasDownvoted = post.hasDownvoted;

      if (voteType === 'up') {
        if (hasUpvoted) {
          upvoteDiff = -1;
          hasUpvoted = false;
        } else {
          upvoteDiff = 1;
          hasUpvoted = true;
          if (hasDownvoted) {
            downvoteDiff = -1;
            hasDownvoted = false;
          }
        }
      } else {
        if (hasDownvoted) {
          downvoteDiff = -1;
          hasDownvoted = false;
        } else {
          downvoteDiff = 1;
          hasDownvoted = true;
          if (hasUpvoted) {
            upvoteDiff = -1;
            hasUpvoted = false;
          }
        }
      }

      return {
        ...post,
        upvotes: post.upvotes + upvoteDiff,
        downvotes: post.downvotes + downvoteDiff,
        hasUpvoted,
        hasDownvoted
      };
    });

    savePostsState(updated);
    
    // Update selectedPost state if open
    if (selectedFeedPost && selectedFeedPost.id === postId) {
      const match = updated.find(p => p.id === postId);
      if (match) setSelectedFeedPost(match);
    }
  };

  const handleAddComment = (postId: string, content: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1
        };
      }
      return post;
    });
    savePostsState(updated);

    if (selectedFeedPost && selectedFeedPost.id === postId) {
      setSelectedFeedPost(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
    }
  };

  // Keyboard shortcut listener hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut sequences inside input elements
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true');

      if (isInputFocused) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsCommandPaletteOpen(false);
          setShowShortcutHelper(false);
          (activeEl as HTMLElement).blur();
        }
        return;
      }

      // 1. Focus Search Palette on "/" or Ctrl+K / Cmd+K
      if (e.key === '/') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      // 2. Escape closes all modals
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsCommandPaletteOpen(false);
        setShowShortcutHelper(false);
      }

      // 3. Shortcut Helper on "?"
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcutHelper(prev => !prev);
      }

      // 4. Sequence hotkeys: "g" -> target
      if (e.key === 'g' || e.key === 'G') {
        const handleSequence = (nextEvent: KeyboardEvent) => {
          const k = nextEvent.key.toLowerCase();
          if (k === 'd') { router.push('/dashboard'); setSelectedFeedPost(null); }
          else if (k === 'f') { router.push('/feed'); setSelectedFeedPost(null); }
          else if (k === 'n') { router.push('/network'); }
          else if (k === 'a') { router.push('/ai-rec'); }
          else if (k === 'c') { router.push('/chat'); }
          else if (k === 'l') { router.push('/leaderboard'); }
          else if (k === 'h') { router.push('/heatmap'); }
          else if (k === 'p') { router.push('/profile'); }
          
          window.removeEventListener('keydown', handleSequence);
        };
        window.addEventListener('keydown', handleSequence);
        setTimeout(() => {
          window.removeEventListener('keydown', handleSequence);
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, selectedFeedPost]);

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      authStep,
      setAuthStep,
      loginPath,
      setLoginPath,
      emailInput,
      setEmailInput,
      passwordInput,
      setPasswordInput,
      onboardName,
      setOnboardName,
      onboardBranch,
      setOnboardBranch,
      onboardYear,
      setOnboardYear,
      onboardSkills,
      setOnboardSkills,
      newSkillInput,
      setNewSkillInput,
      onboardInterests,
      setOnboardInterests,
      newInterestInput,
      setNewInterestInput,
      userProfile,
      setUserProfile,
      posts,
      setPosts,
      notifications,
      setNotifications,
      selectedFeedPost,
      setSelectedFeedPost,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      commandSearchQuery,
      setCommandSearchQuery,
      showShortcutHelper,
      setShowShortcutHelper,
      saveProfileState,
      savePostsState,
      handleDemoLogin,
      handleLogin,
      handleOnboardingComplete,
      handleLogout,
      handleAddPost,
      handleVote,
      handleAddComment
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
