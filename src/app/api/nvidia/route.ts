import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const { type, branch, year, skills, interests, message, chatHistory } = body;
    
    console.log(`\n==================================================`);
    console.log(`🚀 [NVIDIA Server Route] Request Received: Type="${type}"`);
    console.log("👨‍🎓 Student Context:", { year, branch });
    console.log("🛠️ Skills:", skills || []);
    console.log("🎯 Interests:", interests || []);
    if (type === 'chat') {
      console.log(`💬 User Message: "${message}"`);
    }
    console.log(`==================================================`);

    // Read the private API key on the secure Node.js server side
    const apiKey = process.env.NEXT_PUBLIC_NVIDIA_NIM_API_KEY || '';

    if (!apiKey) {
      console.error('❌ [NVIDIA Server Route] Error: API key is missing in .env.local');
      return NextResponse.json({ error: 'NVIDIA NIM API key is not configured on the server.' }, { status: 500 });
    }

    if (type === 'chat') {
      const messages = [
        {
          role: "system",
          content: `You are the CampusOS AI Mentor, an institutional intelligence expert designed to help first-generation college students discover hidden campus opportunities, prepare for placements, select the best faculty advisors, and navigate college life.
          The student is a Year ${year} student in ${branch}. 
          Skills: ${skills ? skills.join(', ') : ''}.
          Interests: ${interests ? interests.join(', ') : ''}.
          Use senior knowledge context. Give actionable, supportive, conversational, and direct guidance.`
        },
        ...(chatHistory || []).map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        {
          role: "user",
          content: message
        }
      ];

      console.log(`📡 [NVIDIA NIM API] Dispatching Chat Request to model "meta/llama-3.1-70b-instruct"...`);
      const apiResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`❌ [NVIDIA NIM API] Server returned status ${apiResponse.status}:`, errorText);
        return NextResponse.json({ error: `NVIDIA NIM Server Error: ${errorText}` }, { status: apiResponse.status });
      }

      const data = await apiResponse.json();
      const duration = Date.now() - startTime;
      const content = data.choices[0]?.message?.content || '';
      
      console.log(`✅ [NVIDIA NIM API] Chat Response Received successfully in ${duration}ms!`);
      console.log(`📝 Generated Mentorship Content Snapshot:\n---\n${content.substring(0, 200)}...\n---`);
      console.log(`==================================================\n`);

      return NextResponse.json({ content });
    } else {
      // Recommendations roadmap
      console.log(`📡 [NVIDIA NIM API] Dispatching Recommendation Prompt to model "meta/llama-3.1-70b-instruct"...`);
      const apiResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [
            {
              role: "system",
              content: "You are CampusOS AI Opportunity Engine. Based on the student's profile, generate a highly professional, markdown-formatted set of actionable recommendations including hackathons, internships, scholarships, and placement preparation tips."
            },
            {
              role: "user",
              content: `Generate recommendations for a ${year} year student in ${branch}. Skills: ${skills ? skills.join(', ') : ''}. Interests: ${interests ? interests.join(', ') : ''}.`
            }
          ],
          temperature: 0.2,
          max_tokens: 1024
        })
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`❌ [NVIDIA NIM API] Server returned status ${apiResponse.status}:`, errorText);
        return NextResponse.json({ error: `NVIDIA NIM Server Error: ${errorText}` }, { status: apiResponse.status });
      }

      const data = await apiResponse.json();
      const duration = Date.now() - startTime;
      const content = data.choices[0]?.message?.content || '';

      console.log(`✅ [NVIDIA NIM API] Recommendations Response Received successfully in ${duration}ms!`);
      console.log(`📝 Roadmap Snippet Snapshot:\n---\n${content.substring(0, 200)}...\n---`);
      console.log(`==================================================\n`);

      return NextResponse.json({ content });
    }
  } catch (error: any) {
    console.error('❌ [NVIDIA Server Route] Unexpected Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
