# 🌌 CampusOS: AI-Powered Institutional Intelligence Platform
> **An AI-powered operating system for college opportunities.** Built for the **Commit Happens** Hackathon.

CampusOS solves a critical, systemic barrier: **the "Senior Network Privilege Gap."** 
First-generation and underprivileged college students frequently miss career-defining sophomore internships, elite scholarships, research positions, and high-impact faculty projects because this knowledge is passed down only through exclusive, informal senior circles. 

CampusOS democratizes this institutional intelligence, packaging unadvertised opportunities into a unified, high-fidelity SaaS experience.

---

## ✨ Features at a Glance

*   **🔒 Immersive Auth & Onboarding Gate**: Beautiful glassmorphic SSO login simulated panel that onboard students with custom branches, skills, and target parameters.
*   **📋 Sleek SaaS Dashboard**: Beautiful Linear/Vercel-style main dashboard hosting personalized opportunity lists, quick shortcuts, recent alerts, and critical deadline meters.
*   **📡 Senior Intelligence Feed**: Allows verified senior mentors to post high-urgency referral links, faculty tips, recruitment notices, and placement guides. Supports custom tagging and comments.
*   **🧠 NVIDIA NIM AI Recommendation Engine**: Instantly scans the student's profile parameters against active campus opportunities using custom Llama 3.1 pipelines, outputting real-time roadmaps.
*   **💬 Interactive AI Mentor Chat**: Conversational helper simulating immediate interview prep, faculty review, and early internship navigation in a sleek, Discord-styled assistant bubble.
*   **📊 Opportunity Heatmap Analytics**: Immersive dashboards featuring interactive Recharts displaying branch engagements, domain allocations, and application run-rate trends.
*   **🏆 Gamified Intel Score System**: Celebrates verified senior contributions with rankings, badges (*Guru, Mentor, Pioneer*), and helpfulness scores.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | **Next.js 16 (App Router)** | Hyper-optimized server components with React 19 canary. |
| **Language** | **TypeScript** | Absolute type-safety across all data streams and profiles. |
| **Styling** | **Tailwind CSS v4** | Next-generation post-css framework supporting premium dark gradients. |
| **Visual Library** | **Lucide React** | Consistent, sleek iconography. |
| **Data Visualization** | **Recharts** | Smooth, animated charts for live student analytics. |
| **Backend & DB** | **Supabase & PostgreSQL** | Secure relational schema with UUID generation and RLS triggers. |
| **Intelligence** | **NVIDIA NIM API** | Meta Llama 3.1 405B neural orchestration. |

---

## 📂 Repository Architecture

```bash
campusos/
├── sql/
│   └── schema.sql         # Postgres Table definitions, RLS policies & mock seeds
├── src/
│   ├── app/
│   │   ├── globals.css    # Premium CSS design tokens & glassmorphic classes
│   │   ├── layout.tsx     # Global Shell and typography configurations
│   │   └── page.tsx       # Unified platform routing & onboarding state controller
│   ├── components/
│   │   ├── Sidebar.tsx             # Responsive collapsible navigation
│   │   ├── DashboardHome.tsx       # Live metric dashboard summary
│   │   ├── IntelFeed.tsx           # Discord-styled senior intel sharing channel
│   │   ├── AIRecommendations.tsx   # Personalized NVIDIA NIM scanned roadmaps
│   │   ├── AIMentor.tsx            # Conversational chat assistant
│   │   ├── Leaderboard.tsx         # Gamified credibility ranking lists
│   │   └── OpportunityHeatmap.tsx  # Interactive Recharts analytics panels
│   └── lib/
│       ├── types.ts       # Unified type interfaces
│       ├── supabase.ts    # Supabase connection client
│       └── nvidia.ts      # NIM API orchestration & local mock simulations
```

---

## 🚀 Local Installation Guide

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or above)
*   [npm](https://www.npmjs.com/) (v10.x or above)

### 1. Clone & Install
```bash
git clone https://github.com/GeetEditz/CampusOS.git
cd CampusOS
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
> *Note: If no API keys are provided, CampusOS automatically activates high-fidelity local simulations to ensure judges can immediately interact with the platform without credentials.*

### 3. Setup Relational Database
*   Open the Supabase SQL Editor.
*   Copy the entire query stack inside `sql/schema.sql`.
*   Execute the script to instantiate tables (profiles, posts, comments, upvotes, notifications, chat_history), configure Row-Level Security (RLS) policies, and populate mock data.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your local browser to access CampusOS.

---

## 🏁 Hackathon Demo Walkthrough

1.  **Immersive Onboarding**: Visit the homepage, enter an email, and click `Access Portal`. Complete the detailed onboarding screen by entering your name, branch, skills, and target career interests.
2.  **Dashboard Control**: Check active stats, recent notifications, and upcoming deadlines instantly matching your branch.
3.  **Contribute Senior Intel**: Tap `Contribute Intel` on the Senior Intelligence Feed. Post a simulated unadvertised opening, select an urgency level, and tag it. Your post instantly populates the feed!
4.  **AI Roadmap Engine**: Navigate to the `AI Roadmap Engine` tab to watch Llama 3.1 scan your branch parameters and synthesize target preparation milestones in real time.
5.  **Mentor Conversational Chat**: Open `AI Mentor Chat` and select a pre-seeded starter query like "How to apply for Dr. Verma's challenge" to witness responsive, contextual career advice.
6.  **Interactive Heatmap**: Visit `Opportunity Analytics` to inspect animated bar charts, trending domain pies, and monthly active line graphs.

---

## 🔮 Future Roadmap

*   **Verified Academic Seals**: Direct SSO integration with university databases to automatically tag student branches/CGPA.
*   **Automatic NIM Alert Triggers**: Scheduled cron-jobs scanning web-crawled scholarship sites to automatically email students whose skills match the eligibility matrix.
*   **Endorsement smart-contracts**: Blockchain-backed credentials validating senior helpfulness scores, preventing fake testimonials.
