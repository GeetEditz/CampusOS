export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'student' | 'senior' | 'admin';
  branch: string;
  year: number;
  skills: string[];
  interests: string[];
  credibilityScore: number;
  badge?: 'Guru' | 'Mentor' | 'Pioneer' | 'Rookie' | 'Contributor';
  ssoLinked?: boolean;
  ssoProvider?: 'google' | 'microsoft';
  aiRecommendations?: string;
}

export type OpportunityCategory = 
  | 'Internships'
  | 'Placements'
  | 'Scholarships'
  | 'Faculty Tips'
  | 'Club Recruitment'
  | 'Hackathons'
  | 'Exams';

export interface Post {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
  branch: string;
  year: number;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    role: string;
    credibilityScore: number;
    badge?: string;
  };
  upvotes: number;
  downvotes: number;
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
  commentsCount: number;
  createdAt: string;
  deadline?: string;
  matchScore?: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    role: string;
    credibilityScore: number;
  };
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'trending' | 'alert' | 'placement';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  timeRemaining?: string; // e.g. "closes in 6 hours"
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  createdAt: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  branch: string;
  credibilityScore: number;
  badge: string;
  helpfulPostsCount: number;
  rank: number;
}

export interface TickerAnnouncement {
  id: string;
  icon: string;
  message: string;
  highlight_text?: string;
  highlight_color?: string;
}
