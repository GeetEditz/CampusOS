'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import AIMentor from '@/components/AIMentor';

export default function ChatPage() {
  const { userProfile } = useApp();

  return <AIMentor user={userProfile} />;
}
