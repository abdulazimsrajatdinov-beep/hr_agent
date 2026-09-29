"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, Mic, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AIInterviewPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Sálem! Men Diyar Market tiń AI HR asistentimen. Intervyunı baslawǵa tayarsız ba?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMsg = { id: Date.now(), sender: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const candidateId = localStorage.getItem("currentCandidateId");
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          candidateId: candidateId
        })
      });

      const data = await res.json();
      
      if (data.error || res.status !== 200) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: data.error || data.text || "Keshirersiz, qátelik júz berdi." }]);
        setIsLoading(false);
        return;
      }

      const aiResponse = { 
        id: Date.now() + 1, 
        sender: "ai", 
        text: data.text 
      };
      setMessages(prev => [...prev, aiResponse]);

      if (data.isFinished) {
        if (data.score) {
          localStorage.setItem("lastScore", data.score.toString());
        }
        setTimeout(() => {
          router.push("/result");
        }, 2000);
      }
    } catch (e) {
      console.error("Chat error", e);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: "Tarmaqta qátelik júz berdi." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full h-[100dvh] max-w-md mx-auto flex-col bg-background relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10 glass z-10">
        <Link href="/application">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <ChevronLeft size={24} className="text-foreground" />
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <BrainCircuit size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-bold">AI Asistent</h1>
            <p className="text-xs text-green-400 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Onlayn
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-24" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
            >
              <div className={`p-4 rounded-2xl ${msg.sender === "user" ? "bg-primary text-white rounded-tr-sm" : "glass rounded-tl-sm text-slate-200"}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">Házir</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 glass border-t border-white/10 z-10">
        <div className="flex gap-2 items-center">
          <button className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 hover:bg-white/10 transition">
            <Mic size={20} className="text-slate-300" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Juwap jazıń..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-full h-12 px-4 outline-none focus:border-primary/50 text-sm"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 hover:scale-105 transition active:scale-95 shadow-lg shadow-primary/20"
          >
            <Send size={18} className="text-white ml-1" />
          </button>
        </div>
      </div>
    </main>
  );
}
