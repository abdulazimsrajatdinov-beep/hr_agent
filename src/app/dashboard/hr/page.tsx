"use client";

import { motion } from "framer-motion";
import { Search, Filter, BrainCircuit, MessageSquare, X } from "lucide-react";
import Image from "next/image";

import { useState, useEffect } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Arza qaldırdı": return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    case "AI Intervyuda": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Bahalandı": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Biykarlaw": return "bg-red-500/20 text-red-400 border-red-500/30";
    default: return "bg-slate-500/20 text-slate-300";
  }
};

export default function HRDashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<{name: string, messages: any[]} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Bárshesi");

  useEffect(() => {
    fetch("/api/candidates")
      .then(res => res.json())
      .then(data => setCandidates(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    await fetch("/api/candidates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch =
      !searchQuery.trim() ||
      c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vacancy?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.prevRole?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Bárshesi" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kandidatlar</h1>
          <p className="text-sm text-slate-400">Jami {filteredCandidates.length} kandidat</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qıdırıw..." 
              className="w-full h-10 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-sm focus:border-primary/50 outline-none"
            />
          </div>
          <div className="relative flex items-center">
            <Filter size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 pl-9 pr-4 rounded-xl glass bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition cursor-pointer outline-none text-slate-200"
            >
              <option value="Bárshesi" className="bg-slate-800 text-white">Bárshesi</option>
              <option value="Arza qaldırdı" className="bg-slate-800 text-white">Arza qaldırdı</option>
              <option value="AI Intervyuda" className="bg-slate-800 text-white">AI Intervyuda</option>
              <option value="Bahalandı" className="bg-slate-800 text-white">Bahalandı</option>
              <option value="Qabıllandı" className="bg-slate-800 text-white">Qabıllandı</option>
              <option value="Biykarlaw" className="bg-slate-800 text-white">Biykarlaw</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban / Table view */}
      <div className="glass rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-slate-400">
                <th className="p-4 font-medium whitespace-nowrap">Kandidat</th>
                <th className="p-4 font-medium whitespace-nowrap">Vakansiya / Qánigelik</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium whitespace-nowrap">AI Bahası</th>
                <th className="p-4 font-medium text-right">Ameller</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCandidates.map((candidate, i) => (
                <motion.tr 
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4 flex items-center gap-3 min-w-[200px]">
                    <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden relative shrink-0">
                       <Image src={`https://api.dicebear.com/9.x/notionists/svg?seed=${candidate.fullName}`} alt={candidate.fullName} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{candidate.fullName}</p>
                      <p className="text-xs text-slate-400">{candidate.phone || new Date(candidate.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="p-4 min-w-[150px]">
                    <span className="text-sm text-slate-300">{candidate.vacancy?.title || candidate.major || candidate.prevRole || "Satıwshı / Kassir"}</span>
                  </td>
                  <td className="p-4 min-w-[120px]">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-medium border whitespace-nowrap ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="p-4 min-w-[120px]">
                    {candidate.aiScore ? (
                       <div className="flex items-center gap-2">
                         <BrainCircuit size={16} className={candidate.aiScore > 80 ? "text-green-500" : candidate.aiScore > 50 ? "text-yellow-500" : "text-red-500"} />
                         <span className="font-bold text-sm">{candidate.aiScore}/100</span>
                       </div>
                    ) : (
                       <span className="text-sm text-slate-500">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    {candidate.interviewChat && (
                      <button 
                        onClick={() => setSelectedChat({ name: candidate.fullName, messages: JSON.parse(candidate.interviewChat) })}
                        className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                        title="Sáwbetti kóriw"
                      >
                        <MessageSquare size={16} />
                      </button>
                    )}
                    <select
                      value={candidate.status}
                      onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary/50 text-slate-300"
                    >
                      <option value="Arza qaldırdı" className="bg-slate-800 text-white">Arza qaldırdı</option>
                      <option value="AI Intervyuda" className="bg-slate-800 text-white">AI Intervyuda</option>
                      <option value="Bahalandı" className="bg-slate-800 text-white">Bahalandı</option>
                      <option value="Qabıllandı" className="bg-green-800 text-white">Qabıllandı</option>
                      <option value="Biykarlaw" className="bg-red-800 text-white">Biykarlaw</option>
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chat Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 w-full max-w-2xl rounded-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="font-bold text-lg">{selectedChat.name} menen AI sáwbeti</h3>
              <button onClick={() => setSelectedChat(null)} className="p-1 hover:bg-white/10 rounded-lg transition"><X size={20}/></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
              {selectedChat.messages.map((msg: any, i: number) => (
                <div key={i} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <span className="text-[10px] text-slate-500 mb-1 px-1 uppercase">{msg.sender === 'user' ? 'Kandidat' : 'AI Asistent'}</span>
                  <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'glass border border-white/10 text-slate-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
