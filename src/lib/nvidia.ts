/**
 * NVIDIA NIM API integration helper with robust fallback mechanism for local testing/hackathon demos.
 * Relies on secure Next.js Server Route Handler to prevent client-side CORS issues.
 */

interface NimRecommendParams {
  branch: string;
  year: number;
  skills: string[];
  interests: string[];
}

export async function getAINimRecommendations(params: NimRecommendParams): Promise<string> {
  try {
    const response = await fetch('/api/nvidia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'recommendations',
        branch: params.branch,
        year: params.year,
        skills: params.skills,
        interests: params.interests
      })
    });

    if (!response.ok) {
      throw new Error(`NVIDIA NIM server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.content || simulateNimRecommendations(params);
  } catch (error) {
    console.warn('NVIDIA NIM API Error (falling back to client simulation):', error);
    return simulateNimRecommendations(params);
  }
}

export async function getAIMentorResponse(
  message: string,
  chatHistory: { sender: 'user' | 'ai'; content: string }[],
  studentProfile: NimRecommendParams
): Promise<string> {
  try {
    const response = await fetch('/api/nvidia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'chat',
        message,
        chatHistory,
        branch: studentProfile.branch,
        year: studentProfile.year,
        skills: studentProfile.skills,
        interests: studentProfile.interests
      })
    });

    if (!response.ok) {
      throw new Error(`NVIDIA NIM server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.content || simulateMentorResponse(message, studentProfile);
  } catch (error) {
    console.warn('NVIDIA NIM API Error (falling back to client simulation):', error);
    return simulateMentorResponse(message, studentProfile);
  }
}

function simulateNimRecommendations(params: NimRecommendParams): string {
  return `### 🚀 CampusOS AI Personalized Roadmap
*Generated specifically for ${params.branch} — Year ${params.year}*

#### 🎯 Immediate Internship Target
*   **Google STEP Internship / Microsoft Explore:** Since you're in Year ${params.year} with solid **${params.skills[0] || 'programming'}** skills, focus on competitive sophomore internships. Leverage referrals from Senior Rohan Deshmukh (referral slot closes in 3 days).
*   **Action:** Format your resume using the Deedy template and solve the multi-dimensional DP question sheet in Rohan's Microsoft placement preparation repository.

#### 💡 Research Opportunity
*   **Dr. Verma's AI Lab Challenge:** With your interest in **${params.interests[0] || 'AI'}**, Dr. Verma's unadvertised PyTorch Assistant position is a goldmine.
*   **Action:** Visit Dr. Verma this Thursday at 3 PM. Present your GitHub profile showing a clean **${params.skills[1] || 'React'}** or Python repository.

#### 🏆 Hackathon Engagement
*   **Commit Happens Hackathon & NVIDIA Incubator:** Collaborate with a senior to submit a prototype using modern AI pipelines. The Dean's endorsement window closes soon.
*   **Action:** Connect with Karan Malhotra (Robotics Club Pioneer) to pitch your current project.

#### 📚 Targeted Placement Strategy
*   Prioritize mastering **System Design** and **Dynamic Programming** which are highly weighted for high-tier tech companies visiting our campus.`;
}

function simulateMentorResponse(message: string, profile: NimRecommendParams): string {
  const lowercaseMsg = message.toLowerCase();

  if (lowercaseMsg.includes('placement') || lowercaseMsg.includes('job') || lowercaseMsg.includes('prepare')) {
    return `### 💼 Elite Placement Strategy for ${profile.branch}

Preparing for top-tier companies requires a systematic schedule:

1. **Master the Past Year Databases**: Microsoft, Google, and Atlassian have specific question pools for our campus. Check Senior **Priya Sharma's** Microsoft placement prep repository containing solutions in C++/Java.
2. **Focus Areas**: 
   * **DSA**: Master Dynamic Programming and Graph algorithms.
   * **System Design**: Be prepared for High-Level (HLD) questions on scalability.
3. **Internal Referral**: Senior Rohan Deshmukh currently has Google referrral slots. Check the Senior Intelligence Feed and apply before the internal deadline!

Do you want me to list the top 10 frequently asked questions from the Microsoft repository?`;
  }

  if (lowercaseMsg.includes('professor') || lowercaseMsg.includes('faculty') || lowercaseMsg.includes('verma') || lowercaseMsg.includes('research')) {
    return `### 🔬 Research & Faculty Intelligence

To get research internships with our department professors:

1. **Dr. Verma (AI Lab)**: Currently looking for 3 summer research assistants. He values hands-on coding (specifically PyTorch) over theoretical GPA. Go to his office on Thursday afternoon and show your GitHub.
2. **Dr. Sinha (Systems Group)**: Works on cloud orchestration and Docker. If you have done projects in Node.js/Go, he is very receptive.
3. **Avoid mass emailing**: Professors here respond best to students who walk in with a running demo or clean codebase.

Would you like tips on how to pitch your GitHub projects to Dr. Verma?`;
  }

  if (lowercaseMsg.includes('internship') || lowercaseMsg.includes('second year') || lowercaseMsg.includes('early')) {
    return `### 🚀 Securing Internships in Year ${profile.year}

Landing early internships is all about bypass channels (non-traditional pipelines):

1. **Sophomore Referral Programs**: Tech giants like Google (STEP) and Microsoft have specific pipelines. Getting referred by a senior already placed there increases shortlisting chance by 10x.
2. **Open Source & Hackathons**: Build and deploy 2 premium, working web applications. Recruiters care more about a live Vercel URL than an empty resume.
3. **Seniors Feed**: Check the Internships tab in CampusOS. There are active postings from seniors who are leaving their current internship positions and looking for juniors to recommend as replacements.

I can guide you step-by-step on how to optimize your LinkedIn and GitHub. What would you like to focus on first?`;
  }

  return `Hello Arjun! As your **CampusOS AI Mentor**, I've analyzed your profile in **${profile.branch}** (Year ${profile.year}).

Based on your skills (**${profile.skills.slice(0, 3).join(', ')}**), here is how I can guide you today:
1. **Prepare for incoming placement drives** (Mastering company-specific repositories)
2. **Apply for hidden research/faculty roles** (Like Dr. Verma's PyTorch opening)
3. **Succeed in hackathons and club recruitments** (Like the Robotics Club Ros/PCB recruitments)

What is on your mind? Feel free to ask specific questions about professors, referral strategies, or roadmap prep!`;
}
