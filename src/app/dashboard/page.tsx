'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import DashboardHome from '@/components/DashboardHome';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    posts, 
    notifications, 
    userProfile, 
    setSelectedFeedPost 
  } = useApp();

  return (
    <DashboardHome 
      posts={posts} 
      notifications={notifications} 
      user={userProfile} 
      setActiveTab={(tab) => {
        setSelectedFeedPost(null);
        router.push(`/${tab}`);
      }} 
      onSelectPost={(post) => {
        setSelectedFeedPost(post);
        router.push('/feed');
      }}
      onAddPostClick={() => {
        setSelectedFeedPost(null);
        router.push('/feed');
      }}
    />
  );
}
