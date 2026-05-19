'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserProfile, Post, Notification } from '@/lib/types';
import { MOCK_POSTS, MOCK_NOTIFICATIONS, INITIAL_USER, DEMO_PRELOAD_STATE } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

interface AccountInfo {
  password?: string;
  profile: UserProfile;
}

interface AppContextType {
  // Auth & Onboarding
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  authStep: 'login' | 'onboarding';
  setAuthStep: (step: 'login' | 'onboarding') => void;
  loginPath: 'student' | 'judge' | 'institutional';
  setLoginPath: (path: 'student' | 'judge' | 'institutional') => void;
  
  // Dynamic Authentication Mode
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  authError: string;
  setAuthError: (err: string) => void;
  
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
  handleLinkSSO: (provider: 'google' | 'microsoft') => void;
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
  
  // Custom Registration / accounts state database
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState('');
  const [accountsRegistry, setAccountsRegistry] = useState<Record<string, AccountInfo>>({});
  
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

  // Load from local storage and check active Supabase session
  useEffect(() => {
    const cachedProfile = localStorage.getItem('campusos_profile');
    const cachedPosts = localStorage.getItem('campusos_posts');
    const cachedAuth = localStorage.getItem('campusos_auth');
    const cachedRegistry = localStorage.getItem('campusos_accounts_v2');

    if (cachedProfile) {
      setUserProfile(JSON.parse(cachedProfile));
    }
    if (cachedPosts) {
      setPosts(JSON.parse(cachedPosts));
    }
    if (cachedAuth === 'true') {
      setIsAuthenticated(true);
    }

    if (cachedRegistry) {
      setAccountsRegistry(JSON.parse(cachedRegistry));
    } else {
      const initialRegistry: Record<string, AccountInfo> = {};
      setAccountsRegistry(initialRegistry);
      localStorage.setItem('campusos_accounts_v2', JSON.stringify(initialRegistry));
    }

    // Connect and verify active Supabase session in the background
    const checkSupabaseSession = async () => {
      if (!supabase) {
        console.log('[Supabase Auth] ℹ️ Supabase not configured in .env.local, falling back to Local Storage database emulation.');
        return;
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('[Supabase Auth] 🚀 Active cloud session found for user:', session.user.email);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            console.error('[Supabase Auth] ❌ Error fetching session user profile from database:', error.message);
          } else if (profile) {
            console.log('[Supabase Auth] 💎 Loaded session profile details from database:', profile);
            const mappedProfile: UserProfile = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              avatarUrl: profile.avatar_url,
              role: profile.role as 'student' | 'senior' | 'admin',
              branch: profile.branch,
              year: profile.year,
              skills: profile.skills || [],
              interests: profile.interests || [],
              credibilityScore: profile.credibility_score || 0,
              badge: profile.badge as 'Guru' | 'Mentor' | 'Pioneer' | 'Rookie',
              ssoLinked: profile.sso_linked || false,
              ssoProvider: profile.sso_provider as 'google' | 'microsoft'
            };
            setUserProfile(mappedProfile);
            setIsAuthenticated(true);
            localStorage.setItem('campusos_auth', 'true');
            localStorage.setItem('campusos_profile', JSON.stringify(mappedProfile));
          }
        }
      } catch (err) {
        console.error('[Supabase Auth] ❌ Unexpected session check error:', err);
      }
    };

    checkSupabaseSession();
  }, []);

  // Sync state helpers
  const saveProfileState = async (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('campusos_profile', JSON.stringify(profile));

    if (supabase) {
      console.log(`[CampusOS Auth] 💾 Syncing updated profile details to Supabase for: ${profile.id}`);
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: profile.name,
            branch: profile.branch,
            year: profile.year,
            skills: profile.skills,
            interests: profile.interests,
            sso_linked: profile.ssoLinked || false,
            sso_provider: profile.ssoProvider || null
          })
          .eq('id', profile.id);

        if (error) {
          console.error('[Supabase Sync] ❌ Error syncing profile details updates:', error.message);
        } else {
          console.log('[Supabase Sync] ✅ Profile details successfully updated in Supabase database!');
        }
      } catch (err) {
        console.error('[Supabase Sync] ❌ Unexpected profile sync error:', err);
      }
    }
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

  // Sleek Sign-In vs Sign-Up Authentication Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    console.log(`[CampusOS Auth] 🔑 Authentication triggered. Mode: ${authMode}, Email: ${emailInput}`);

    if (!emailInput.trim()) {
      setAuthError('Email is required.');
      console.warn('[CampusOS Auth] ⚠️ Authentication failed: Missing email address.');
      return;
    }

    const emailKey = emailInput.toLowerCase().trim();

    if (authMode === 'signin') {
      if (!supabase) {
        setAuthError('Supabase config is missing from your environment variables.');
        return;
      }

      console.log(`[CampusOS Auth] 🔍 Signing in user via Supabase Auth: ${emailInput}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput
      });

      if (error) {
        console.warn('[CampusOS Auth] ⚠️ Supabase Sign-In failed:', error.message);
        setAuthError(error.message);
        return;
      }

      console.log('[CampusOS Auth] ✅ Supabase Auth sign-in successful. Fetching user profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        console.warn('[CampusOS Auth] ⚠️ Error loading profile details from database:', profileError.message);
        setAuthError(profileError.message);
        return;
      }

      if (!profile) {
        console.warn('[CampusOS Auth] ⚠️ Profile record missing in profiles table. Transitioning to onboarding.');
        setAuthStep('onboarding');
        return;
      }

      const mappedProfile: UserProfile = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatar_url,
        role: profile.role as 'student' | 'senior' | 'admin',
        branch: profile.branch,
        year: profile.year,
        skills: profile.skills || [],
        interests: profile.interests || [],
        credibilityScore: profile.credibility_score || 0,
        badge: profile.badge as 'Guru' | 'Mentor' | 'Pioneer' | 'Rookie',
        ssoLinked: profile.sso_linked || false,
        ssoProvider: profile.sso_provider as 'google' | 'microsoft'
      };

      console.log(`[CampusOS Auth] ✅ Profiles successfully loaded for user: ${mappedProfile.name}. Loading workspace dashboard...`);
      saveProfileState(mappedProfile);
      setIsAuthenticated(true);
      localStorage.setItem('campusos_auth', 'true');
      router.push('/dashboard');
      
      // Post notification
      const newAlert: Notification = {
        id: `notif-${Date.now()}`,
        title: 'Logged in successfully!',
        message: `Welcome back to CampusOS, ${mappedProfile.name}! Your network index is active.`,
        type: 'alert',
        createdAt: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newAlert, ...prev]);
    } else {
      console.log(`[CampusOS Auth] 🚀 Initiating registration flow. Redirecting to onboarding questionnaire for: ${emailKey}`);
      // Transition to onboarding fields to create the profile details
      setAuthStep('onboarding');
    }
  };

  // Complete profile onboarding and register inside local accounts DB and remote Supabase
  const handleOnboardingComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim()) {
      console.warn('[CampusOS Auth] Onboarding failed: Profile name is empty.');
      return;
    }

    const emailKey = (emailInput || 'student@university.edu').toLowerCase().trim();
    console.log(`[CampusOS Auth] 📝 Submitting profile onboarding forms. Email Key: ${emailKey}, Name: ${onboardName}`);

    let userId = `u-${Date.now()}`;

    if (supabase) {
      console.log(`[CampusOS Auth] 🌐 Registering new user via Supabase Auth: ${emailInput}`);
      const { data, error } = await supabase.auth.signUp({
        email: emailInput.trim(),
        password: passwordInput || 'password'
      });

      if (error) {
        console.warn('[CampusOS Auth] ⚠️ Supabase Sign-Up failed:', error.message);
        setAuthError(error.message);
        return;
      }

      if (data.user?.id) {
        userId = data.user.id;
        console.log(`[CampusOS Auth] ✅ Supabase Auth signup successful. Generated cloud user ID: ${userId}`);
      }
    }

    const newProfile: UserProfile = {
      id: userId,
      name: onboardName,
      email: emailInput || 'student@university.edu',
      role: loginPath === 'institutional' ? 'admin' : 'student',
      branch: onboardBranch,
      year: onboardYear,
      skills: onboardSkills,
      interests: onboardInterests,
      credibilityScore: 42,
      badge: 'Rookie',
      ssoLinked: false
    };

    console.log('[CampusOS Auth] 💎 Generating newly registered profile object:', newProfile);
    
    // Save to remote Supabase Database Profiles Table!
    if (supabase) {
      console.log(`[CampusOS Auth] 🗄️ Saving public.profiles record inside remote Supabase database...`);
      const { error: profileError } = await supabase.from('profiles').insert({
        id: newProfile.id,
        name: newProfile.name,
        email: newProfile.email,
        role: newProfile.role,
        branch: newProfile.branch,
        year: newProfile.year,
        skills: newProfile.skills,
        interests: newProfile.interests,
        credibility_score: newProfile.credibilityScore,
        badge: newProfile.badge,
        sso_linked: false
      });

      if (profileError) {
        console.error('[CampusOS Auth] ❌ Error inserting profile row in Supabase profiles table:', profileError.message);
        setAuthError(profileError.message);
        return;
      }
      console.log('[CampusOS Auth] 🚀 Successfully synced new profile record inside remote Supabase table!');
    }

    // Update active profile state
    saveProfileState(newProfile);

    // Save details to the accounts registry in local storage (fallback check)
    const updatedRegistry = {
      ...accountsRegistry,
      [emailKey]: {
        password: passwordInput || 'password',
        profile: newProfile
      }
    };
    setAccountsRegistry(updatedRegistry);
    localStorage.setItem('campusos_accounts_v2', JSON.stringify(updatedRegistry));
    console.log(`[CampusOS Auth] 💾 Saved fallback credentials database registry under "campusos_accounts_v2".`);

    setIsAuthenticated(true);
    localStorage.setItem('campusos_auth', 'true');
    console.log('[CampusOS Auth] 🌟 Registration pipeline completed. Welcome aboard!');
    router.push('/dashboard');
  };

  // Sign out handler
  const handleLogout = async () => {
    console.log(`[CampusOS Auth] 🚪 Sign-Out triggered. Cleared active session user: ${userProfile.name}`);
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setAuthStep('login');
    setAuthError('');
    localStorage.removeItem('campusos_auth');
    localStorage.removeItem('campusos_profile');
    router.push('/dashboard');
  };

  // Link University SSO Identity after authenticating
  const handleLinkSSO = async (provider: 'google' | 'microsoft') => {
    console.log(`[CampusOS Auth] 🔐 SSO Linking action triggered. Provider: ${provider}, Current User: ${userProfile.name}`);
    const updatedProfile: UserProfile = {
      ...userProfile,
      ssoLinked: true,
      ssoProvider: provider
    };
    saveProfileState(updatedProfile);

    if (supabase) {
      console.log(`[CampusOS Auth] 💾 Syncing SSO status to Supabase profiles for user: ${userProfile.id}`);
      const { error } = await supabase
        .from('profiles')
        .update({
          sso_linked: true,
          sso_provider: provider
        })
        .eq('id', userProfile.id);

      if (error) {
        console.error('[CampusOS Auth] ❌ Error syncing SSO status to Supabase:', error.message);
      } else {
        console.log('[CampusOS Auth] ✅ SSO status successfully synced in remote database!');
      }
    }

    // Save updated profile back to registry if email key exists
    const emailKey = userProfile.email.toLowerCase().trim();
    if (emailKey && accountsRegistry[emailKey]) {
      const updatedRegistry = {
        ...accountsRegistry,
        [emailKey]: {
          ...accountsRegistry[emailKey],
          profile: updatedProfile
        }
      };
      setAccountsRegistry(updatedRegistry);
      localStorage.setItem('campusos_accounts_v2', JSON.stringify(updatedRegistry));
      console.log(`[CampusOS Auth] 💾 Synced SSO connected status back into fallback accounts database registry for: ${emailKey}`);
    }

    // Trigger toast notification
    const newAlert: Notification = {
      id: `notif-${Date.now()}`,
      title: 'SSO Identity Linked!',
      message: `Your CampusOS profile is now verified and connected via university ${provider === 'google' ? 'Google' : 'Microsoft'} SSO portal.`,
      type: 'alert',
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
    console.log(`[CampusOS Auth] 🔔 Pushed alert notification: "${newAlert.title}"`);
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
      authMode,
      setAuthMode,
      authError,
      setAuthError,
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
      handleLinkSSO,
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
