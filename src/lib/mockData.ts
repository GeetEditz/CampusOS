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

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'sen-1',
    name: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    branch: 'Computer Science & Engineering',
    credibilityScore: 890,
    badge: 'Guru',
    helpfulPostsCount: 47,
    rank: 1
  },
  {
    id: 'sen-2',
    name: 'Rohan Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    branch: 'Electronics & Communication',
    credibilityScore: 745,
    badge: 'Mentor',
    helpfulPostsCount: 32,
    rank: 2
  },
  {
    id: 'sen-3',
    name: 'Aditi Rao',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    branch: 'Information Technology',
    credibilityScore: 620,
    badge: 'Mentor',
    helpfulPostsCount: 26,
    rank: 3
  },
  {
    id: 'sen-4',
    name: 'Karan Malhotra',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    branch: 'Computer Science & Engineering',
    credibilityScore: 512,
    badge: 'Pioneer',
    helpfulPostsCount: 19,
    rank: 4
  },
  {
    id: 'sen-5',
    name: 'Sneha Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    branch: 'Electrical Engineering',
    credibilityScore: 430,
    badge: 'Pioneer',
    helpfulPostsCount: 15,
    rank: 5
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Secret Faculty Tip: Dr. Verma\'s Research Assistant Positions (Summer 2026)',
    description: 'Dr. Verma from the AI Lab is quietly opening 3 student research assistant positions for the summer. He never publishes these on the college website. The selection is based purely on a programming challenge in PyTorch. Drop by his office between 3 PM and 5 PM on Thursdays, show him your github profile, and ask for the "Optimization challenge". It\'s a direct entry point without CGPA filters.',
    category: 'Faculty Tips',
    urgency: 'High',
    tags: ['Machine Learning', 'AI Lab', 'Research', 'PyTorch'],
    branch: 'Computer Science & Engineering',
    year: 3,
    author: {
      id: 'sen-1',
      name: 'Priya Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      role: 'Senior (4th Year)',
      credibilityScore: 890,
      badge: 'Guru'
    },
    upvotes: 142,
    downvotes: 2,
    hasUpvoted: false,
    hasDownvoted: false,
    commentsCount: 28,
    createdAt: '2026-05-18T14:30:00Z',
    deadline: '2026-05-25'
  },
  {
    id: 'post-2',
    title: 'Google STEP Internship 2026 Referral Portal Open',
    description: 'The internal Google employee portal for referral for STEP Internship (2nd year B.Tech) is active. The deadline is very strict and candidates with referrals are processed within 10 days. I can refer up to 5 students from our campus. Please upload your single-page resume formatted with Deedy-Resume layout and link your top 2 hackathon projects. Fill the form below before the internal slot closes.',
    category: 'Internships',
    urgency: 'Critical',
    tags: ['Google', 'STEP', 'Internship', 'Referral'],
    branch: 'All Branches',
    year: 2,
    author: {
      id: 'sen-2',
      name: 'Rohan Deshmukh',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      role: 'Senior (4th Year)',
      credibilityScore: 745,
      badge: 'Mentor'
    },
    upvotes: 215,
    downvotes: 1,
    hasUpvoted: false,
    hasDownvoted: false,
    commentsCount: 45,
    createdAt: '2026-05-19T06:00:00Z',
    deadline: '2026-05-22'
  },
  {
    id: 'post-3',
    title: 'NVIDIA Inception Incubator Scholarship: $10,000 Support',
    description: 'NVIDIA is supporting top collegiate tech projects in Southeast Asia with $10,000 cash grants and $25,000 NIM/GPU credits. Only 2 teams per college can apply, but they must be endorsed by the Dean. Most students don\'t apply because the application requires a working prototype. If you have an AI-driven project ready, ping me. We can polish the pitch deck and submit under the Entrepreneurship Cell.',
    category: 'Scholarships',
    urgency: 'Medium',
    tags: ['NVIDIA', 'Scholarship', 'GPU Credits', 'Startup'],
    branch: 'All Branches',
    year: 3,
    author: {
      id: 'sen-4',
      name: 'Karan Malhotra',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
      role: 'Senior (4th Year)',
      credibilityScore: 512,
      badge: 'Pioneer'
    },
    upvotes: 98,
    downvotes: 0,
    hasUpvoted: false,
    hasDownvoted: false,
    commentsCount: 12,
    createdAt: '2026-05-17T11:20:00Z',
    deadline: '2026-06-10'
  },
  {
    id: 'post-4',
    title: 'Microsoft placement prep list: Hidden repository with past 3 years questions',
    description: 'Microsoft campus hiring starts next month. Over the last 3 years, they have been focusing heavily on System Design and specific dynamic programming paradigms (like Multidimensional DP). I have compiled a GitHub repository with all the exact questions asked in the coding rounds and interviews at our university. The folder includes optimized solutions in Java and C++, plus system design diagrams. Check the linked repository and start with the "Top 50" list.',
    category: 'Placements',
    urgency: 'High',
    tags: ['Microsoft', 'Placements', 'System Design', 'Interview Prep'],
    branch: 'Computer Science & Engineering',
    year: 4,
    author: {
      id: 'sen-1',
      name: 'Priya Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      role: 'Senior (4th Year)',
      credibilityScore: 890,
      badge: 'Guru'
    },
    upvotes: 310,
    downvotes: 4,
    hasUpvoted: false,
    hasDownvoted: false,
    commentsCount: 64,
    createdAt: '2026-05-18T09:15:00Z'
  },
  {
    id: 'post-5',
    title: 'Robotics Club Core Committee Recruitment & Project Showoff',
    description: 'The Robotics Club is hiring core team members for autonomous UAV and rover development. We are looking for people who can write C++ (ROS) or design PCBs in Altium. Do not worry if you do not know ROS yet; we will train you as long as you have basic programming/physics concepts solid. Recruiting process starts with a 24-hour mini-hackathon in the main lab this Saturday. Registrations are in-person only.',
    category: 'Club Recruitment',
    urgency: 'Medium',
    tags: ['Robotics', 'ROS', 'Hardware', 'Recruitment'],
    branch: 'Electronics & Communication',
    year: 2,
    author: {
      id: 'sen-3',
      name: 'Aditi Rao',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
      role: 'Senior (4th Year)',
      credibilityScore: 620,
      badge: 'Mentor'
    },
    upvotes: 75,
    downvotes: 1,
    hasUpvoted: false,
    hasDownvoted: false,
    commentsCount: 9,
    createdAt: '2026-05-19T02:45:00Z',
    deadline: '2026-05-23'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Critical Deadline approaching!',
    message: 'Google STEP Referral registration closes in 6 hours.',
    type: 'deadline',
    createdAt: '2026-05-19T03:30:00Z',
    read: false,
    timeRemaining: 'closes in 6 hours'
  },
  {
    id: 'notif-2',
    title: 'High Engagement in your Branch',
    message: '42 CSE students are preparing using "Microsoft placement prep list".',
    type: 'trending',
    createdAt: '2026-05-19T01:15:00Z',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Faculty tip matching your skills',
    message: 'Dr. Verma\'s PyTorch assistant position matches your "Python" and "React" skillset.',
    type: 'alert',
    createdAt: '2026-05-18T14:35:00Z',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Placement Session tomorrow',
    message: 'Atlassian placement pre-talk starts tomorrow at 10:00 AM, Seminar Hall 2.',
    type: 'placement',
    createdAt: '2026-05-18T10:00:00Z',
    read: true,
    timeRemaining: 'starts in 24 hours'
  }
];
