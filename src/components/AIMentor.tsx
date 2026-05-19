import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Cpu, 
  Sparkles, 
  HelpCircle,
  Clock,
  ArrowRight,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage, UserProfile } from '@/lib/types';
import { getAIMentorResponse } from '@/lib/nvidia';
import { supabase } from '@/lib/supabase';
import { isUuid } from '@/lib/utils';

interface AIMentorProps {
  user: UserProfile;
}

export default function AIMentor({ user }: AIMentorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      content: `Hello ${user.name.split(' ')[0]}! I am your **CampusOS AI Mentor** 🧠.

I have fully indexed the **Senior Intelligence Feed**, verified referral portals, and private faculty openings across our college.

Ask me anything about:
*   How to apply for **Dr. Verma\'s PyTorch Research Assistant** challenge
*   Preparing for the upcoming **Microsoft & Google placements**
*   How to get referred for early sophomore internships

What challenge can I help you bypass today?`,
      createdAt: new Date().toISOString()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!supabase || !isUuid(user.id)) return;
      try {
        console.log(`[CampusOS AI Mentor] 🔍 Loading chat history for user: ${user.id}...`);
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('[CampusOS Chat] ❌ Error loading chat history:', error.message);
          return;
        }

        if (data && data.length > 0) {
          const loadedMsgs: ChatMessage[] = data.map((row: any) => ({
            id: row.id,
            sender: row.sender as 'user' | 'ai',
            content: row.content,
            createdAt: row.created_at
          }));
          setMessages(loadedMsgs);
          console.log(`[CampusOS Chat] ✅ Loaded ${loadedMsgs.length} historical messages from database!`);
        }
      } catch (err) {
        console.error('[CampusOS Chat] ❌ Unexpected error fetching chat history:', err);
      }
    };

    fetchChatHistory();
  }, [user.id]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    "How do I apply for Dr. Verma\'s PyTorch challenge?",
    "How to prepare for Microsoft System Design?",
    "Who is referring for Google STEP internship?",
    "What is the Robotics Club PCB recruitment?"
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // 1. Save user message to remote Supabase database chat_history
      if (supabase && isUuid(user.id)) {
        const { error: saveErr } = await supabase.from('chat_history').insert({
          user_id: user.id,
          sender: 'user',
          content: text
        });
        if (saveErr) console.error('[CampusOS Chat] ❌ Error saving user message:', saveErr.message);
      }

      const response = await getAIMentorResponse(
        text,
        messages.map(m => ({ sender: m.sender, content: m.content })),
        {
          branch: user.branch,
          year: user.year,
          skills: user.skills,
          interests: user.interests
        }
      );

      const aiMsg: ChatMessage = {
        id: `m-a-${Date.now()}`,
        sender: 'ai',
        content: response,
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);

      // 2. Save AI response to remote Supabase database chat_history
      if (supabase && isUuid(user.id)) {
        const { error: saveAiErr } = await supabase.from('chat_history').insert({
          user_id: user.id,
          sender: 'ai',
          content: response
        });
        if (saveAiErr) console.error('[CampusOS Chat] ❌ Error saving AI response:', saveAiErr.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Markdown-like parser for chat text
  const parseResponse = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('###')) {
        return <h3 key={idx} className="text-xs font-black text-indigo-400 uppercase tracking-wider mt-3 mb-1 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" />{line.replace('###', '').trim()}</h3>;
      }
      if (line.startsWith('* **') || line.startsWith('- **') || line.startsWith('  * **')) {
        const cleaned = line.replace(/^\s*[\*-] \*\*/, '');
        const splitIndex = cleaned.indexOf('**');
        const boldPart = splitIndex !== -1 ? cleaned.substring(0, splitIndex) : '';
        const restPart = splitIndex !== -1 ? cleaned.substring(splitIndex + 2) : cleaned;
        return (
          <div key={idx} className="ml-3 flex items-start gap-2 my-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300">
              <strong className="text-zinc-100">{boldPart}</strong>
              {restPart}
            </p>
          </div>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <div key={idx} className="ml-3 flex items-start gap-2 my-1">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/40 w-4 h-4 rounded-full flex items-center justify-center border border-indigo-500/20 shrink-0">{line.match(/^\d+/)?.[0]}</span>
            <p className="text-xs text-zinc-300">{line.replace(/^\d+\.\s*/, '')}</p>
          </div>
        );
      }
      if (line.startsWith('*') || line.startsWith('-')) {
        return (
          <div key={idx} className="ml-5 flex items-start gap-2 my-1">
            <div className="w-1 h-1 rounded-full bg-zinc-500 shrink-0 mt-2"></div>
            <p className="text-xs text-zinc-400">{line.replace(/^[\*-]/, '').trim()}</p>
          </div>
        );
      }
      if (line.trim() === '') return <div key={idx} className="h-1.5"></div>;
      
      return <p key={idx} className="text-xs text-zinc-300 leading-relaxed my-1">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto p-0.5 flex-1 min-h-0 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-white/5 pb-3 shrink-0">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            AI Mentor Assistant
          </h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            Institutional expert scanning unadvertised internship pathways and faculty resources in real time.
          </p>
        </div>

        <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 animate-pulse" />
          NVIDIA NIM ONLINE
        </span>
      </div>

      {/* Main chat window layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col glass-panel border border-white/5 rounded-2xl overflow-hidden relative min-h-0">
          
          {/* Message log */}
          <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-5 flex flex-col gap-4 scrollbar-none min-h-0">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full overflow-hidden border shrink-0 flex items-center justify-center ${
                  msg.sender === 'user' ? 'border-indigo-500/30' : 'border-cyan-500/30 bg-gradient-to-tr from-cyan-600 to-indigo-600'
                }`}>
                  {msg.sender === 'user' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-2xl flex flex-col gap-1 border ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-indigo-600/25 to-purple-600/15 border-indigo-500/30 text-white rounded-tr-none'
                    : 'bg-white/3 border-white/5 text-zinc-300 rounded-tl-none shadow-lg'
                }`}>
                  <div className="prose prose-invert max-w-none text-xs">
                    {parseResponse(msg.content)}
                  </div>
                  <span className="text-[8px] text-zinc-600 self-end mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 self-start max-w-[85%] animate-pulse">
                <div className="w-8 h-8 rounded-full border border-cyan-500/30 bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-white/3 border border-white/5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          <div className="p-4 border-t border-white/5 bg-zinc-950/40 shrink-0">
            <div className="flex gap-3 relative">
              <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Ask AI Mentor anything..." 
                className="flex-grow bg-white/3 border border-white/5 rounded-xl pl-4 pr-12 py-3 text-xs glass-input placeholder-zinc-500"
              />
              <button 
                onClick={() => handleSendMessage(inputText)}
                className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right side helper info / quick starters */}
        <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
          <div className="p-5 rounded-2xl glass-panel border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Recommended Starters</h3>
            </div>

            <div className="flex flex-col gap-2.5">
              {starterQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="p-3 text-left rounded-xl bg-white/3 border border-white/5 hover:border-cyan-500/30 text-[11px] text-zinc-400 hover:text-zinc-200 transition-all font-semibold flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
