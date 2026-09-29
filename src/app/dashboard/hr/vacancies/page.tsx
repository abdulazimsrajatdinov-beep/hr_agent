"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function VacanciesCMS() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", title: "", department: "", type: "Full-time", location: "Nókis", salary: "", description: "", isActive: true });

  useEffect(() => {
    fetchVacancies();
  }, []);

  const fetchVacancies = async () => {
    const res = await fetch("/api/vacancies");
    const data = await res.json();
    setVacancies(Array.isArray(data) ? data : []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !formData.id;
    const url = isNew ? "/api/vacancies" : `/api/vacancies/${formData.id}`;
    const method = isNew ? "POST" : "PUT";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsEditing(false);
    fetchVacancies();
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Óshiriwge isenimińiz kámilme?")) return;
    await fetch(`/api/vacancies/${id}`, { method: "DELETE" });
    fetchVacancies();
  };

  const openEditor = (vacancy?: any) => {
    if (vacancy) {
      setFormData(vacancy);
    } else {
      setFormData({ id: "", title: "", department: "", type: "Full-time", location: "Nókis", salary: "", description: "", isActive: true });
    }
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6">{formData.id ? "Vakansiyanı ózgertiw" : "Jańa vakansiya qosıw"}</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Vakansiya atı (Title)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Bólim (Mıs: Marketing)" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Jumıs waqtı (Mıs: Full-time)" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Mánzil (Mıs: Nókis)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Aylıq (Mıs: 3,000,000 UZS)" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
          <textarea className="input-field bg-white/5 p-3 rounded-xl outline-none min-h-[100px]" placeholder="Tolıq maǵlıwmat (Tálaplar, wazıypalar)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
            <span>Aktiv (saytta kórinip turadı)</span>
          </label>
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
          <h1 className="text-2xl font-bold text-white">Vakansiyalar</h1>
          <p className="text-sm text-slate-400">Jumıs orınların basqarıw</p>
        </div>
        <button onClick={() => openEditor()} className="h-10 px-4 rounded-xl bg-primary flex items-center gap-2 text-sm hover:bg-blue-600 transition font-bold text-white">
          <Plus size={18} />
          <span className="hidden sm:inline">Jańa qosıw</span>
        </button>
      </div>

      <div className="grid gap-4">
        {vacancies.map(v => (
          <div key={v.id} className="glass p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/5 transition">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                {v.title}
                {!v.isActive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Jasırın</span>}
              </h3>
              <p className="text-sm text-slate-400">{v.department} • {v.type} • {v.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEditor(v)} className="p-2 glass rounded-lg hover:bg-primary/20 hover:text-primary transition"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(v.id)} className="p-2 glass rounded-lg hover:bg-red-500/20 hover:text-red-400 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {vacancies.length === 0 && <p className="text-center text-slate-500 py-10">Házirshe vakansiyalar joq.</p>}
      </div>
    </div>
  );
}
