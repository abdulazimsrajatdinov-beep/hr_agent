"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Send, ListTodo, FileText, Users, Building2, CheckCircle2, ChevronRight, Check } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function OnboardingPage() {
  const params = useParams();
  const candidateId = params.candidateId as string;

  const [activeTab, setActiveTab] = useState("ai");
  const [candidate, setCandidate] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [sops, setSops] = useState<any[]>([]);
  
  // AI Chat state
  const [messages, setMessages] = useState<{ sender: "user" | "ai", text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!candidateId) return;
    
    fetch(`/api/candidates/${candidateId}`)
       .then(res => res.json())
       .then(data => {
         setCandidate(data);
         if (data && data.status === "Qabıllandı") {
           setMessages([
             { sender: "ai", text: `Sálem, ${data.fullName}! Real Education komandasına xosh keldińiz! 🎉 Men sizdiń shaxsi Onboarding (Adaptaciya) asistentinizben. Jumıs, wazıypalar yamasa komanda haqqında qálegen sorawıńızdı bere beriń!` }
           ]);
         }
       })
       .catch(err => console.error(err));
       
    fetch("/api/company").then(res => res.json()).then(data => {
      setCompany(Array.isArray(data) && data.length > 0 ? data[0] : null);
    });
    fetch("/api/team").then(res => res.json()).then(data => setTeam(data));
    fetch("/api/tasks").then(res => res.json()).then(data => setTasks(data));
    fetch("/api/sop").then(res => res.json()).then(data => setSops(data));
  }, [candidateId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/onboarding-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidateId,
          messages: [...messages, { sender: "user", text: userMsg }]
        })
      });
      const data = await res.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { sender: "ai", text: data.text }]);
      }
    } catch (error) {
      console.error("AI chat error", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!candidate) return <div className="min-h-screen flex items-center justify-center text-white">Júklenbekte...</div>;
  if (candidate.status !== "Qabıllandı") return <div className="min-h-screen flex items-center justify-center text-red-400 font-bold">Bul betke kiriwge ruxsat joq.</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-80 glass border-r border-white/10 flex flex-col p-6 sticky top-0 md:h-screen z-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl overflow-hidden bg-yellow-400 p-0.5 border border-primary/40 shrink-0"><img src="/real-logo.jpg" alt="Real HR" className="w-full h-full object-cover rounded-lg" /></div><h1 className="text-2xl font-black text-primary">REAL HR</h1></div>
          <p className="text-sm text-slate-400">Onboarding Portal</p>
        </div>

        <div className="flex items-center gap-4 mb-10 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
             {candidate.fullName?.charAt(0)}
          </div>
          <div>
            <p className="font-bold">{candidate.fullName}</p>
            <p className="text-xs text-primary">{candidate.vacancy?.title || "Jańa xızmetker"}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <TabButton active={activeTab === "ai"} onClick={() => setActiveTab("ai")} icon={BrainCircuit} label="AI Asistent" />
          <TabButton active={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} icon={ListTodo} label="Wazıypalar" />
          <TabButton active={activeTab === "sop"} onClick={() => setActiveTab("sop")} icon={FileText} label="SOP hám Qaǵıydalar" />
          <TabButton active={activeTab === "team"} onClick={() => setActiveTab("team")} icon={Users} label="Komanda" />
          <TabButton active={activeTab === "company"} onClick={() => setActiveTab("company")} icon={Building2} label="Kompaniya haqqında" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {activeTab === "ai" && (
            <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="text-primary" />
                <h2 className="text-xl font-bold">HR Onboarding Asistent</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-6 flex flex-col pb-4" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'glass border border-white/10 text-slate-200 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="glass border border-white/10 rounded-2xl rounded-bl-none p-4 flex gap-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="pt-4 mt-auto">
                <div className="relative glass rounded-2xl border border-white/20 p-2 flex items-center">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Sıńıq sorawıńızdı beriń..."
                    className="w-full bg-transparent outline-none px-4 text-slate-200"
                  />
                  <button onClick={handleSendMessage} disabled={isTyping || !input.trim()} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 transition shrink-0">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full w-full max-w-4xl mx-auto p-4 md:p-8 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><ListTodo className="text-primary"/> Birinshi háptelik wazıypalar</h2>
              <div className="grid gap-4">
                {tasks.map(task => (
                  <div key={task.id} className="glass p-5 rounded-2xl border border-white/10 flex items-center gap-4 group hover:bg-white/5 transition cursor-pointer">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 border-slate-500">
                    </div>
                    <span className="flex-1 text-white font-medium">{task.title}</span>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-slate-400">Wazıypalar joq.</p>}
              </div>
            </motion.div>
          )}

          {activeTab === "sop" && (
            <motion.div key="sop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full w-full max-w-4xl mx-auto p-4 md:p-8 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><FileText className="text-primary"/> SOP hám Qaǵıydalar</h2>
              <div className="grid gap-6">
                {sops.map(sop => (
                  <div key={sop.id} className="glass p-6 rounded-3xl border border-white/10 prose prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-white mb-2">{sop.title}</h3>
                    <div className="text-slate-300 whitespace-pre-wrap">{sop.content}</div>
                  </div>
                ))}
                {sops.length === 0 && <p className="text-slate-400">SOP tabılmadı.</p>}
              </div>
            </motion.div>
          )}

          {activeTab === "team" && (
            <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full w-full max-w-4xl mx-auto p-4 md:p-8 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Users className="text-primary"/> Biziń komanda</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {team.map(member => (
                  <div key={member.id} className="glass p-5 rounded-2xl border border-white/10 flex flex-col items-center gap-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden relative">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/30 bg-primary/20">{member.name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-sm text-primary">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "company" && (
            <motion.div key="company" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full w-full max-w-4xl mx-auto p-4 md:p-8 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Building2 className="text-primary"/> Kompaniya haqqında</h2>
              {company ? (
                <div className="glass p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-4">{company.title}</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{company.description}</p>
                </div>
              ) : (
                <div className="glass p-8 rounded-3xl border border-white/10 text-center text-slate-400">Maǵlıwmat tabilmadı.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full ${
        active ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold" : "hover:bg-white/5 text-slate-400"
      }`}
    >
      <Icon size={20} className={active ? "text-white" : "text-slate-400"} />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight size={16} />}
    </button>
  );
}
