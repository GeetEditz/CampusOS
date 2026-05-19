'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import ProfileSettings from '@/components/ProfileSettings';

export default function ProfilePage() {
  const { userProfile, saveProfileState } = useApp();

  return <ProfileSettings user={userProfile} onUpdateProfile={saveProfileState} />;
}
