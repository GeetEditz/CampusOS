'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import AIRecommendations from '@/components/AIRecommendations';

export default function AIRecPage() {
  const { userProfile } = useApp();

  return <AIRecommendations user={userProfile} />;
}
