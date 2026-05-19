-- CampusOS Database Schema & Seed Data
-- Target Database: Supabase / PostgreSQL

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Custom Category Type
CREATE TYPE opportunity_category AS ENUM (
  'Internships',
  'Placements',
  'Scholarships',
  'Faculty Tips',
  'Club Recruitment',
  'Hackathons',
  'Exams'
);

-- 3. Profiles Table (Linked to Supabase Auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY, -- Soft reference to auth.users(id) to allow seamless seeding in Supabase SQL editor
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'senior', 'admin')),
  branch TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4),
  skills TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  credibility_score INTEGER DEFAULT 0 CHECK (credibility_score >= 0),
  badge TEXT DEFAULT 'Rookie' CHECK (badge IN ('Rookie', 'Pioneer', 'Mentor', 'Guru')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS) on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow individual update to own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Posts Table (Senior Intelligence Feed)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category opportunity_category NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'Medium' CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')),
  tags TEXT[] DEFAULT '{}',
  branch TEXT NOT NULL DEFAULT 'All Branches',
  year INTEGER NOT NULL DEFAULT 1 CHECK (year BETWEEN 1 AND 4),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to posts" 
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert of posts" 
  ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow author update of own posts" 
  ON public.posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Allow author delete of own posts" 
  ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- 5. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on Comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to comments" 
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert of comments" 
  ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow author delete or update of comments" 
  ON public.comments FOR ALL USING (auth.uid() = author_id);

-- 6. Upvotes Table (Prevents double upvoting)
CREATE TABLE IF NOT EXISTS public.upvotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Enable RLS on Upvotes
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to upvotes" 
  ON public.upvotes FOR SELECT USING (true);

CREATE POLICY "Allow authenticated vote management" 
  ON public.upvotes FOR ALL USING (auth.uid() = user_id);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deadline', 'trending', 'alert', 'placement')),
  action_url TEXT,
  time_remaining TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow personal read access to notifications" 
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow personal update to read notifications" 
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- 8. Chat History Table
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on Chat History
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow personal manage of chat history" 
  ON public.chat_history FOR ALL USING (auth.uid() = user_id);


--------------------------------------------------------------------------------
-- SEED DATA (MOCK HACKATHON STATE FOR INGESTION)
--------------------------------------------------------------------------------

-- Seed profiles (For testing references, generate static UUIDs)
-- Priya Sharma (Senior 4th Year - Guru)
INSERT INTO public.profiles (id, name, email, avatar_url, role, branch, year, skills, interests, credibility_score, badge)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Priya Sharma', 
  'priya.sharma@university.edu', 
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120', 
  'senior', 
  'Computer Science & Engineering', 
  4, 
  ARRAY['React', 'Next.js', 'System Design', 'Algorithms'], 
  ARRAY['Placements', 'Software Architecture'], 
  890, 
  'Guru'
) ON CONFLICT (id) DO NOTHING;

-- Rohan Deshmukh (Senior 4th Year - Mentor)
INSERT INTO public.profiles (id, name, email, avatar_url, role, branch, year, skills, interests, credibility_score, badge)
VALUES (
  '22222222-2222-2222-2222-222222222222', 
  'Rohan Deshmukh', 
  'rohan.deshmukh@university.edu', 
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', 
  'senior', 
  'Electronics & Communication', 
  4, 
  ARRAY['Python', 'C++', 'Embedded Systems'], 
  ARRAY['Internships', 'Hardware Engineering'], 
  745, 
  'Mentor'
) ON CONFLICT (id) DO NOTHING;

-- Aditi Rao (Senior 4th Year - Mentor)
INSERT INTO public.profiles (id, name, email, avatar_url, role, branch, year, skills, interests, credibility_score, badge)
VALUES (
  '33333333-3333-3333-3333-333333333333', 
  'Aditi Rao', 
  'aditi.rao@university.edu', 
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120', 
  'senior', 
  'Information Technology', 
  4, 
  ARRAY['Docker', 'Kubernetes', 'Go'], 
  ARRAY['DevOps', 'Club Recruitment'], 
  620, 
  'Mentor'
) ON CONFLICT (id) DO NOTHING;

-- Karan Malhotra (Senior 4th Year - Pioneer)
INSERT INTO public.profiles (id, name, email, avatar_url, role, branch, year, skills, interests, credibility_score, badge)
VALUES (
  '44444444-4444-4444-4444-444444444444', 
  'Karan Malhotra', 
  'karan.malhotra@university.edu', 
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', 
  'senior', 
  'Computer Science & Engineering', 
  4, 
  ARRAY['ROS', 'Altium', 'PCB Design'], 
  ARRAY['Robotics', 'Hackathons'], 
  512, 
  'Pioneer'
) ON CONFLICT (id) DO NOTHING;


-- Seed Posts (Opportunities)
-- Post 1: Dr. Verma Research assistant
INSERT INTO public.posts (id, title, description, category, urgency, tags, branch, year, author_id, upvotes, downvotes, deadline)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'Secret Faculty Tip: Dr. Verma''s Research Assistant Positions (Summer 2026)',
  'Dr. Verma from the AI Lab is quietly opening 3 student research assistant positions for the summer. He never publishes these on the college website. The selection is based purely on a programming challenge in PyTorch. Drop by his office between 3 PM and 5 PM on Thursdays, show him your github profile, and ask for the "Optimization challenge". It''s a direct entry point without CGPA filters.',
  'Faculty Tips',
  'High',
  ARRAY['Machine Learning', 'AI Lab', 'Research', 'PyTorch'],
  'Computer Science & Engineering',
  3,
  '11111111-1111-1111-1111-111111111111',
  142,
  2,
  '2026-05-25'
) ON CONFLICT (id) DO NOTHING;

-- Post 2: Google STEP Referral
INSERT INTO public.posts (id, title, description, category, urgency, tags, branch, year, author_id, upvotes, downvotes, deadline)
VALUES (
  'a2222222-2222-2222-2222-222222222222',
  'Google STEP Internship 2026 Referral Portal Open',
  'The internal Google employee portal for referral for STEP Internship (2nd year B.Tech) is active. The deadline is very strict and candidates with referrals are processed within 10 days. I can refer up to 5 students from our campus. Please upload your single-page resume formatted with Deedy-Resume layout and link your top 2 hackathon projects. Fill the form below before the internal slot closes.',
  'Internships',
  'Critical',
  ARRAY['Google', 'STEP', 'Internship', 'Referral'],
  'All Branches',
  2,
  '22222222-2222-2222-2222-222222222222',
  215,
  1,
  '2026-05-22'
) ON CONFLICT (id) DO NOTHING;

-- Post 3: NVIDIA Inception incubator
INSERT INTO public.posts (id, title, description, category, urgency, tags, branch, year, author_id, upvotes, downvotes, deadline)
VALUES (
  'a3333333-3333-3333-3333-333333333333',
  'NVIDIA Inception Incubator Scholarship: $10,000 Support',
  'NVIDIA is supporting top collegiate tech projects in Southeast Asia with $10,000 cash grants and $25,000 NIM/GPU credits. Only 2 teams per college can apply, but they must be endorsed by the Dean. Most students don''t apply because the application requires a working prototype. If you have an AI-driven project ready, ping me. We can polish the pitch deck and submit under the Entrepreneurship Cell.',
  'Scholarships',
  'Medium',
  ARRAY['NVIDIA', 'Scholarship', 'GPU Credits', 'Startup'],
  'All Branches',
  3,
  '44444444-4444-4444-4444-444444444444',
  98,
  0,
  '2026-06-10'
) ON CONFLICT (id) DO NOTHING;


-- Seed Comments
INSERT INTO public.comments (post_id, author_id, content)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'I went to his office last Thursday. He gave me the link to a private repo with the coding challenge. It is basically writing a custom loss function in PyTorch for sequence prediction!'
) ON CONFLICT DO NOTHING;

--------------------------------------------------------------------------------
-- SCHEMA MIGRATION: ADD SSO COLUMNS (RUN THIS ON YOUR EXISTING POSTGRES DATABASE)
--------------------------------------------------------------------------------
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS sso_linked BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sso_provider TEXT CHECK (sso_provider IN ('google', 'microsoft'));
