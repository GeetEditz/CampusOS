import { Post, Notification, LeaderboardUser, ChatMessage } from './types';

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

// All mock/dummy data arrays cleared out on startup as requested
export const MOCK_LEADERBOARD: LeaderboardUser[] = [];
export const MOCK_POSTS: Post[] = [];
export const MOCK_NOTIFICATIONS: Notification[] = [];

// 🚀 HIGH-IMPACT DEMO PRELOAD STATE FOR FLUID HACKATHON JUDGING PRESENTATIONS
export const DEMO_PRELOAD_STATE = {
  user: {
    id: 'demo-user-1',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@university.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    role: 'student' as const,
    branch: 'Computer Science & Engineering',
    year: 3,
    skills: ['React', 'Next.js', 'Python', 'PyTorch', 'Data Structures'],
    interests: ['Artificial Intelligence', 'Full Stack Development', 'Hackathons', 'Research'],
    credibilityScore: 125,
    badge: 'Pioneer' as const
  },
  
  posts: [
    {
      id: 'post-1',
      title: 'Secret Faculty Tip: Dr. Verma\'s Research Assistant Positions (Summer 2026)',
      description: 'Dr. Verma from the AI Lab is quietly opening 3 student research assistant positions for the summer. He never publishes these on the college website. The selection is based purely on a programming challenge in PyTorch. Drop by his office between 3 PM and 5 PM on Thursdays, show him your github profile, and ask for the "Optimization challenge". It\'s a direct entry point without CGPA filters.',
      category: 'Faculty Tips' as const,
      urgency: 'High' as const,
      tags: ['Machine Learning', 'AI Lab', 'Research', 'PyTorch'],
      branch: 'Computer Science & Engineering',
      year: 3,
      author: {
        id: 'sen-1',
        name: 'Priya Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
        role: 'Senior (4th Year)',
        credibilityScore: 890,
        badge: 'Guru'
      },
      upvotes: 184,
      downvotes: 1,
      hasUpvoted: false,
      hasDownvoted: false,
      commentsCount: 28,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
      deadline: '2026-05-25'
    },
    {
      id: 'post-2',
      title: 'Google STEP Internship 2026 Referral Portal Open',
      description: 'The internal Google employee portal for referral for STEP Internship (2nd year B.Tech) is active. The deadline is very strict and candidates with referrals are processed within 10 days. I can refer up to 5 students from our campus. Please upload your resume formatted with standard Single-Page layouts and link your top 2 hackathon projects. Fill the form before internal slot closes.',
      category: 'Internships' as const,
      urgency: 'Critical' as const,
      tags: ['Google', 'STEP', 'Internship', 'Referral'],
      branch: 'All Branches',
      year: 2,
      author: {
        id: 'sen-2',
        name: 'Rohan Deshmukh',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
        role: 'Senior (4th Year)',
        credibilityScore: 745,
        badge: 'Mentor'
      },
      upvotes: 256,
      downvotes: 2,
      hasUpvoted: false,
      hasDownvoted: false,
      commentsCount: 45,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      deadline: '2026-05-22'
    },
    {
      id: 'post-3',
      title: 'Microsoft placement prep list: Hidden repository with past 3 years questions',
      description: 'Microsoft campus hiring starts next month. Over the last 3 years, they have been focusing heavily on System Design and specific dynamic programming paradigms (like Multidimensional DP). I have compiled a GitHub repository with all the exact questions asked in the coding rounds and interviews at our university. The folder includes optimized solutions in Java and C++, plus system design diagrams. Check the linked repository and start with the "Top 50" list.',
      category: 'Placements' as const,
      urgency: 'High' as const,
      tags: ['Microsoft', 'Placements', 'System Design', 'Interview Prep'],
      branch: 'Computer Science & Engineering',
      year: 4,
      author: {
        id: 'sen-1',
        name: 'Priya Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
        role: 'Senior (4th Year)',
        credibilityScore: 890,
        badge: 'Guru'
      },
      upvotes: 342,
      downvotes: 4,
      hasUpvoted: false,
      hasDownvoted: false,
      commentsCount: 64,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
    },
    {
      id: 'post-4',
      title: 'NVIDIA Inception Incubator Scholarship: $10,000 Support',
      description: 'NVIDIA is supporting top collegiate tech projects in Southeast Asia with $10,000 cash grants and $25,000 NIM/GPU credits. Only 2 teams per college can apply, but they must be endorsed by the Dean. Most students don\'t apply because the application requires a working prototype. If you have an AI-driven project ready, ping me. We can polish the pitch deck and submit under the Entrepreneurship Cell.',
      category: 'Scholarships' as const,
      urgency: 'Medium' as const,
      tags: ['NVIDIA', 'Scholarship', 'GPU Credits', 'Startup'],
      branch: 'All Branches',
      year: 3,
      author: {
        id: 'sen-4',
        name: 'Karan Malhotra',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
        role: 'Senior (4th Year)',
        credibilityScore: 512,
        badge: 'Pioneer'
      },
      upvotes: 112,
      downvotes: 0,
      hasUpvoted: false,
      hasDownvoted: false,
      commentsCount: 12,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 24 hours ago
      deadline: '2026-06-10'
    },
    {
      id: 'post-5',
      title: 'Robotics Club Core Committee Recruitment & ROS BootCamp',
      description: 'The Robotics Club is hiring core team members for autonomous UAV and rover development. We are looking for people who can write C++ (ROS) or design PCBs in Altium. Do not worry if you do not know ROS yet; we will train you as long as you have basic programming/physics concepts solid. Recruiting process starts with a 24-hour mini-hackathon in the main lab this Saturday. Registrations are in-person only.',
      category: 'Club Recruitment' as const,
      urgency: 'Medium' as const,
      tags: ['Robotics', 'ROS', 'Hardware', 'Recruitment'],
      branch: 'Electronics & Communication',
      year: 2,
      author: {
        id: 'sen-3',
        name: 'Aditi Rao',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120',
        role: 'Senior (4th Year)',
        credibilityScore: 620,
        badge: 'Mentor'
      },
      upvotes: 82,
      downvotes: 1,
      hasUpvoted: false,
      hasDownvoted: false,
      commentsCount: 9,
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString(), // 36 hours ago
      deadline: '2026-05-23'
    }
  ],

  notifications: [
    {
      id: 'notif-1',
      title: '⚠️ Missed Opportunity AI Scan Alert',
      message: '78 CSE/AIML students from your class already applied for Google STEP referrals. Your profile compatibility is 92%. Apply before referrals close!',
      type: 'deadline' as const,
      createdAt: new Date().toISOString(),
      read: false,
      timeRemaining: 'closes in 5 hours'
    },
    {
      id: 'notif-2',
      title: '🔥 Trending in your branch',
      message: 'Students from your branch who joined Dr. Verma\'s AI lab research cohort secured direct summer internships at top tier firms. Optimization challenge closing soon.',
      type: 'trending' as const,
      createdAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
      read: false
    },
    {
      id: 'notif-3',
      title: '🧠 AI Skill Alignment Trigger',
      message: 'Dr. Verma\'s unadvertised assistant role requires "PyTorch" and "Python" which perfectly match your active skill index.',
      type: 'alert' as const,
      createdAt: new Date(Date.now() - 1200000).toISOString(), // 20 mins ago
      read: false
    },
    {
      id: 'notif-4',
      title: '🎯 Placement Drive Tomorrow',
      message: 'Atlassian placement prep session opens tomorrow. 12 seniors shared dynamic questions in the Placements Feed.',
      type: 'placement' as const,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      read: true,
      timeRemaining: 'starts in 18 hours'
    }
  ],

  leaderboard: [
    {
      id: 'sen-1',
      name: 'Priya Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      branch: 'Computer Science & Engineering',
      credibilityScore: 920,
      badge: 'Guru',
      helpfulPostsCount: 49,
      rank: 1
    },
    {
      id: 'sen-2',
      name: 'Rohan Deshmukh',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      branch: 'Electronics & Communication',
      credibilityScore: 785,
      badge: 'Mentor',
      helpfulPostsCount: 34,
      rank: 2
    },
    {
      id: 'sen-3',
      name: 'Aditi Rao',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120',
      branch: 'Information Technology',
      credibilityScore: 660,
      badge: 'Mentor',
      helpfulPostsCount: 28,
      rank: 3
    },
    {
      id: 'sen-4',
      name: 'Karan Malhotra',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
      branch: 'Computer Science & Engineering',
      credibilityScore: 540,
      badge: 'Pioneer',
      helpfulPostsCount: 21,
      rank: 4
    },
    {
      id: 'sen-5',
      name: 'Sneha Patel',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
      branch: 'Electrical Engineering',
      credibilityScore: 430,
      badge: 'Pioneer',
      helpfulPostsCount: 15,
      rank: 5
    }
  ],

  chatHistory: [
    {
      id: 'chat-1',
      sender: 'user' as const,
      content: 'How do I apply for Dr. Verma\'s PyTorch challenge?',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'chat-2',
      sender: 'ai' as const,
      content: `### 🔬 How to Secure Dr. Verma's Summer Research Assistant Role

Dr. Verma bypasses standard HR/GPA filters because he is looking for students who can write deep learning models from day one. Here is your targeted action plan:

1. **GitHub Pitch**: Before you go to his lab, make sure your GitHub has at least one repository showing a working PyTorch model (like a CNN for image classification or an LSTM for text).
2. **Office Hours Walk-in**: He resides in the AI Research Wing (Room 304). Visit him between 3 PM and 5 PM on Thursdays.
3. **Ask for the Challenge**: Do not ask "Can I work with you?". Instead, say: **"I saw the optimization challenge mentioned by seniors in the network, and I have prepared a GitHub prototype. I would love to solve the challenge script."**
4. **PyTorch Focus**: The programming challenge typically requires writing custom custom loss functions or tensor manipulations without relying on high-level loops.

This is a direct referral channel. Let me know if you would like me to draft a quick email pitch to Dr. Verma first!`,
      createdAt: new Date(Date.now() - 3600000 + 30000).toISOString()
    }
  ]
};
