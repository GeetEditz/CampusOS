import { Post, Notification, LeaderboardUser } from './types';

export const INITIAL_USER = {
  id: 'user-1',
  name: 'Arjun Mehta',
  email: 'arjun.mehta@university.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
  role: 'student' as const,
  branch: 'Computer Science & Engineering',
  year: 3,
  skills: ['React', 'Next.js', 'Node.js', 'Python', 'TailwindCSS'],
  interests: ['Artificial Intelligence', 'Full Stack Development', 'Open Source', 'Hackathons'],
  credibilityScore: 42,
  badge: 'Rookie' as const
};

// All mock/dummy data arrays cleared out. Kept purely as schema reference placeholders or loaded dynamically.
// Complete seeds and tables can be loaded directly from the database using 'sql/schema.sql'.
export const MOCK_LEADERBOARD: LeaderboardUser[] = [];

export const MOCK_POSTS: Post[] = [];

export const MOCK_NOTIFICATIONS: Notification[] = [];
