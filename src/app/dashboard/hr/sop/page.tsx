"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function SOPCMS() {
  const [sops, setSops] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", title: "", content: "", order: 0 });

  useEffect(() => {
    fetchSops();
  }, []);

  const fetchSops = async () => {
    const res = await fetch("/api/sop");
    const data = await res.json();
    setSops(Array.isArray(data) ? data : []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !formData.id;
    const url = isNew ? "/api/sop" : `/api/sop/${formData.id}`;
    const method = isNew ? "POST" : "PUT";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsEditing(false);
    fetchSops();
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Óshiriwge isenimińiz kámilme?")) return;
    await fetch(`/api/sop/${id}`, { method: "DELETE" });
    fetchSops();
  };

  const openEditor = (sop?: any) => {
    if (sop) {
      setFormData(sop);
    } else {
      setFormData({ id: "", title: "", content: "", order: sops.length });
    }
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6">{formData.id ? "SOP dı ózgertiw" : "Jańa SOP qosıw"}</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Tema (SOP atamasi)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <textarea className="input-field bg-white/5 p-3 rounded-xl outline-none min-h-[150px]" placeholder="Mazmunı (HTML yamasa ápiwayı tekst)" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
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
          <h1 className="text-2xl font-bold text-white">SOP hám Qaǵıydalar</h1>
          <p className="text-sm text-slate-400">Jańa xızmetkerler ushın qóllanbalar</p>
        </div>
        <button onClick={() => openEditor()} className="h-10 px-4 rounded-xl bg-primary flex items-center gap-2 text-sm hover:bg-blue-600 transition font-bold text-white">
          <Plus size={18} />
          <span className="hidden sm:inline">Jańa qosıw</span>
        </button>
      </div>

      <div className="grid gap-4">
        {sops.map(sop => (
          <div key={sop.id} className="glass p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/5 transition">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{sop.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{sop.content}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEditor(sop)} className="p-2 glass rounded-lg hover:bg-primary/20 hover:text-primary transition"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(sop.id)} className="p-2 glass rounded-lg hover:bg-red-500/20 hover:text-red-400 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {sops.length === 0 && <p className="text-center text-slate-500 py-10">Házirshe SOP joq.</p>}
      </div>
    </div>
  );
}
