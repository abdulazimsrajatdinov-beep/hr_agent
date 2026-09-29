"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function TasksCMS() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: "", title: "", order: 0 });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !formData.id;
    const url = isNew ? "/api/tasks" : `/api/tasks/${formData.id}`;
    const method = isNew ? "POST" : "PUT";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsEditing(false);
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Óshiriwge isenimińiz kámilme?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const openEditor = (task?: any) => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({ id: "", title: "", order: tasks.length });
    }
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto glass p-6 rounded-2xl">
        <h2 className="text-xl font-bold mb-6">{formData.id ? "Wazıypanı ózgertiw" : "Jańa wazıypa qosıw"}</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" placeholder="Wazıypa atı (Title)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
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
          <h1 className="text-2xl font-bold text-white">Wazıypalar (Onboarding)</h1>
          <p className="text-sm text-slate-400">Jańa xızmetkerler ushın dáslepki wazıypalar</p>
        </div>
        <button onClick={() => openEditor()} className="h-10 px-4 rounded-xl bg-primary flex items-center gap-2 text-sm hover:bg-blue-600 transition font-bold text-white">
          <Plus size={18} />
          <span className="hidden sm:inline">Jańa qosıw</span>
        </button>
      </div>

      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task.id} className="glass p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/5 transition">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{task.title}</h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEditor(task)} className="p-2 glass rounded-lg hover:bg-primary/20 hover:text-primary transition"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(task.id)} className="p-2 glass rounded-lg hover:bg-red-500/20 hover:text-red-400 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-center text-slate-500 py-10">Házirshe wazıypalar joq.</p>}
      </div>
    </div>
  );
}
