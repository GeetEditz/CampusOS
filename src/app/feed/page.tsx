'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import IntelFeed from '@/components/IntelFeed';

export default function FeedPage() {
  const { 
    posts, 
    userProfile, 
    handleAddPost, 
    handleVote, 
    handleAddComment, 
    selectedFeedPost, 
    setSelectedFeedPost 
  } = useApp();

  return (
    <IntelFeed 
      posts={posts} 
      user={userProfile} 
      onAddPost={handleAddPost} 
      onVote={handleVote} 
      onAddComment={handleAddComment}
      selectedPost={selectedFeedPost}
      setSelectedPost={setSelectedFeedPost}
    />
  );
}
