/**
 * NVIDIA NIM API integration helper with robust fallback mechanism for local testing/hackathon demos.
 */

interface NimRecommendParams {
  branch: string;
  year: number;
  skills: string[];
  interests: string[];
}

export async function getAINimRecommendations(params: NimRecommendParams): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_NVIDIA_NIM_API_KEY || '';
  
  if (!apiKey) {
    // Return high-quality, personalized simulation if API Key is not set yet
    return simulateNimRecommendations(params);
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-405b-instruct",
        messages: [
          {
            role: "system",
            content: "You are CampusOS AI Opportunity Engine. Based on the student's profile, generate a highly professional, markdown-formatted set of actionable recommendations including hackathons, internships, scholarships, and placement preparation tips."
          },
          {
            role: "user",
            content: `Generate recommendations for a ${params.year} year student in ${params.branch}. Skills: ${params.skills.join(', ')}. Interests: ${params.interests.join(', ')}.`
          }
        ],
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`NVIDIA NIM API responded with ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || simulateNimRecommendations(params);
  } catch (error) {
    console.error('NVIDIA NIM API Error:', error);
    return simulateNimRecommendations(params);
  }
}

export async function getAIMentorResponse(
  message: string,
  chatHistory: { sender: 'user' | 'ai'; content: string }[],
  studentProfile: NimRecommendParams
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_NVIDIA_NIM_API_KEY || '';

  if (!apiKey) {
    return simulateMentorResponse(message, studentProfile);
  }

  try {
    const messages = [
      {
        role: "system",
        content: `You are the CampusOS AI Mentor, an institutional intelligence expert designed to help first-generation college students discover hidden campus opportunities, prepare for placements, select the best faculty advisors, and navigate college life.
        The student is a Year ${studentProfile.year} student in ${studentProfile.branch}. 
        Skills: ${studentProfile.skills.join(', ')}.
        Interests: ${studentProfile.interests.join(', ')}.
        Use senior knowledge context. Give actionable, supportive, conversational, and direct guidance.`
      },
      ...chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: "user",
        content: message
      }
    ];

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-405b-instruct",
        messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`NVIDIA NIM API responded with ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || simulateMentorResponse(message, studentProfile);
  } catch (error) {
    console.error('NVIDIA NIM API Error:', error);
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
