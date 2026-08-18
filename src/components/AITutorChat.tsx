import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Sparkles, Send, RefreshCw, Trash2, ArrowRight } from "lucide-react";

interface Props {
  initialQuery?: string | null;
  clearInitialQuery?: () => void;
  isDark?: boolean;
}

export const AITutorChat: React.FC<Props> = ({ initialQuery, clearInitialQuery, isDark = true }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    { label: "Filioque Controversy", q: "Explain the historical difference in translation regarding the Holy Spirit's procession (the 'Filioque' controversy)." },
    { label: "Nicaea History", q: "What was the background structure of the Council of Nicaea (325 AD) and Constantinople (381 AD)?" },
    { label: "Memorization Strategy", q: "Set up a structured daily practicing regime that will help me memorize all 13 cards of the Nicene Creed easily." },
    { label: "Greek vs English", q: "Explain the original Greek terms behind 'consubstantial' (Homoousios) and 'Only Begotten' (Monogenes)." }
  ];

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
      if (clearInitialQuery) {
        clearInitialQuery();
      }
    }
  }, [initialQuery]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Peace be with you! I am your **Creed Companion** AI study partner.\n\nI am here to help you study, memorize, and deeply understand the Nicene Creed. You can ask me to: \n- Explain the theological significance or Greek roots of any phrase\n- Map out historical details about ecumenical councils\n- Provide tips and strategy guidelines for memorizing the 13 lines\n- Quiz your recall through freestyle chat exercises\n\nHow may I help you in your study today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error("Unable to retrieve response from Creed Companion.");
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text || "I was unable to synthesize a proper explanation. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setError("AI model currently offline. Please check your credentials.");
      
      const fallbackMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: "I am currently unable to connect to the server-side Gemini system. Common solutions:\n1. Open **Settings > Secrets** in your AI Studio panel and set a valid API key for `GEMINI_API_KEY`.\n2. Verify the server dev backend is compiled and successfully running.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm("Do you want to clear your current conversation history?")) {
      setMessages([
        {
          id: "welcome-reset",
          role: "assistant",
          content: "Chat cleared. I am ready for your next question or reciting rehearsal!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className={`w-full flex flex-col h-[580px] rounded-3xl overflow-hidden border shadow-md transition-all duration-300 ${isDark ? "bg-[#131418] border-slate-800/80" : "bg-white border-slate-200"}`}>
      
      {/* Top Header info */}
      <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors duration-300 ${isDark ? "bg-[#131418] border-slate-800/60" : "bg-slate-50 border-slate-200"}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-full border transition-colors ${isDark ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-750 border-slate-200"}`}>
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className={`text-sm font-semibold flex items-center gap-1.5 leading-none font-sans transition-colors duration-300 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
              <span>Creed Companion</span>
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[8.5px] font-mono rounded-full border ${isDark ? "text-slate-400 bg-slate-900 border-slate-800" : "text-slate-655 bg-white border-slate-200"}`}>
                <Sparkles size={8} className="text-[#D4C9B4]" /> Active Tutor
              </span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono tracking-tight block mt-0.5">Theological dialogue, history lessons & tutoring</span>
          </div>
        </div>

        {messages.length > 1 && (
          <button
            onClick={handleResetChat}
            className={`p-2 rounded-full border transition cursor-pointer ${isDark ? "text-slate-500 hover:text-red-400 bg-slate-900 hover:bg-slate-850 border-slate-800" : "text-slate-500 hover:text-red-600 bg-white hover:bg-slate-50 border-slate-200"}`}
            title="Clear Chat History"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Messages Scrolling Hub */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-5 transition-colors duration-305 ${isDark ? "bg-[#0E0F12]" : "bg-slate-50/50"}`}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[85%] ${
              m.role === "user" ? "ml-auto items-end" : "mr-auto items-start animate-fadeIn"
            }`}
          >
            {/* Timestamp label */}
            <span className="text-[9px] font-mono text-slate-505 text-slate-500 px-1.5 mb-1 block">{m.timestamp}</span>
            
            {/* Message bubble */}
            <div
              className={`p-4 rounded-3xl text-sm leading-relaxed whitespace-pre-line shadow-xs transition-colors duration-300 ${
                m.role === "user"
                  ? isDark 
                    ? "bg-slate-900 border border-slate-800 text-slate-200 rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tr-none shadow-sm shadow-slate-100"
                  : isDark
                    ? "bg-[#1C1D24]/80 border border-slate-800/50 text-slate-200 rounded-tl-none font-serif italic"
                    : "bg-white border border-[#D4C9B4]/40 text-slate-755 rounded-tl-none font-serif italic shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`flex items-center gap-2 max-w-[80%] mr-auto p-3.5 rounded-3xl rounded-tl-none border animate-fadeIn shadow-xs transition-colors ${isDark ? "bg-slate-900 border-slate-800/80 text-slate-400" : "bg-white border-slate-200 text-slate-700"}`}>
            <RefreshCw className="animate-spin text-[#D4C9B4]" size={13} />
            <span className="text-xs text-slate-500 font-mono">Creed Companion is synthesizing reflections...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom prompt panel */}
      <div className={`p-4 border-t space-y-4 transition-colors duration-300 ${isDark ? "bg-[#131418] border-slate-800/60" : "bg-slate-50 border-slate-200"}`}>
        
        {/* Suggestion tags */}
        {messages.length <= 1 && (
          <div className="space-y-1.5 px-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block px-1">Study suggestions:</span>
            <div className="grid grid-cols-2 gap-2 text-left">
              {starterPrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sp.q)}
                  className={`p-2.5 rounded-2xl text-left text-[11px] border flex items-center justify-between group transition cursor-pointer shadow-xs ${isDark ? "bg-slate-900 hover:bg-[#1E2026] text-slate-400 hover:text-slate-100 border-slate-800/80" : "bg-white hover:bg-slate-100/50 text-slate-700 hover:text-[#B48E3D] border-slate-200"}`}
                >
                  <span className="line-clamp-1">{sp.label}</span>
                  <ArrowRight size={10} className="opacity-40 group-hover:opacity-100 transition whitespace-nowrap ml-1 text-[#D4C9B4]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className={`flex items-center gap-2 relative transition-all duration-300 ${isDark ? "bg-[#131418]" : "bg-transparent"}`}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Please wait..." : "Ask Creed Companion..."}
            className={`w-full border rounded-full px-5 py-3 md:py-3.5 text-xs md:text-sm shadow-xs animate-fadeIn focus:outline-none focus:ring-1 transition-all duration-300 ${isDark ? "bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-605 focus:border-slate-700 focus:ring-slate-800" : "bg-white border-slate-200 text-slate-850 placeholder-slate-4D0 focus:border-slate-400 focus:ring-slate-250"}`}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-3 bg-[#D4C9B4] hover:bg-[#C4963A] text-slate-950 font-bold rounded-full transition disabled:bg-slate-900 disabled:text-slate-700 cursor-pointer disabled:cursor-not-allowed shadow-xs"
          >
            <Send size={13} />
          </button>
        </form>
      </div>

    </div>
  );
};
