"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

export default function TeamCMS() {
  const [team, setTeam] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", role: "", imageUrl: "", order: 0 });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    const res = await fetch("/api/team");
    const data = await res.json();
    setTeam(Array.isArray(data) ? data : []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !formData.id;
    const url = isNew ? "/api/team" : `/api/team/${formData.id}`;
    const method = isNew ? "POST" : "PUT";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsEditing(false);
    fetchTeam();
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Óshiriwge isenimińiz kámilme?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    fetchTeam();
  };

  const openEditor = (member?: any) => {
    if (member) {
      setFormData(member);
    } else {
      setFormData({ id: "", name: "", role: "", imageUrl: "", order: team.length });
    }
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="max-w-xl mx-auto glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6">{formData.id ? "Komanda aǵzasın ózgertiw" : "Jańa aǵza qosıw"}</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Atı-jóni" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Lawazımı (Mıs: Frontend Dasturshi)" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Komanda aǵzası súwreti:</label>
            <input 
              type="file" 
              accept="image/*"
              className="input-field bg-white/5 p-3 rounded-xl outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-600 cursor-pointer" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 3 * 1024 * 1024) {
                    alert("Súwret kólemi 3MB tan aspawı kerek. Iltimas kishilew súwret jükleng.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({...formData, imageUrl: reader.result as string});
                  };
                  reader.readAsDataURL(file);
                }
              }} 
            />
            {formData.imageUrl && formData.imageUrl.startsWith('data:image') && (
              <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl mt-2 border border-white/20" />
            )}
          </div>
          <input type="number" className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Tártibi (San)" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} />
          
          <div className="flex gap-4 mt-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-xl glass hover:bg-white/10 transition">Biykarlaw</button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-primary hover:bg-blue-600 transition font-bold text-white">Saqlaw</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Komanda</h1>
          <p className="text-sm text-slate-400">Bizdiń topar aǵzaları</p>
        </div>
        <button onClick={() => openEditor()} className="h-10 px-4 rounded-xl bg-primary flex items-center gap-2 text-sm hover:bg-blue-600 transition font-bold text-white">
          <Plus size={18} />
          <span className="hidden sm:inline">Jańa qosıw</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {team.map(member => (
          <div key={member.id} className="glass p-5 rounded-2xl border border-white/10 flex flex-col items-center gap-4 hover:bg-white/5 transition relative group">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => openEditor(member)} className="p-2 glass bg-black/40 rounded-lg hover:text-primary"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(member.id)} className="p-2 glass bg-black/40 rounded-lg hover:text-red-400"><Trash2 size={16} /></button>
            </div>
            <div className="w-24 h-24 rounded-full bg-white/10 overflow-hidden relative">
               {member.imageUrl ? (
                 <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/30 bg-primary/20">{member.name.charAt(0)}</div>
               )}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-primary">{member.role}</p>
            </div>
          </div>
        ))}
        {team.length === 0 && <p className="text-center text-slate-500 py-10 col-span-full">Házirshe komanda aǵzaları joq.</p>}
      </div>
    </div>
  );
}
