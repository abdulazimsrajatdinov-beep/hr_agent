"use client";

import { useState, useEffect } from "react";

export default function CompanyCMS() {
  const [info, setInfo] = useState<any>(null);
  const [formData, setFormData] = useState({ id: "", title: "", description: "", stats: [{ label: "", value: "" }] });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    const res = await fetch("/api/company");
    const data = await res.json();
    if (data && data.length > 0) {
      const dbInfo = data[0];
      setInfo(dbInfo);
      setFormData({
        id: dbInfo.id,
        title: dbInfo.title,
        description: dbInfo.description,
        stats: dbInfo.stats ? JSON.parse(dbInfo.stats) : [{ label: "", value: "" }]
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const isNew = !formData.id;
    const url = isNew ? "/api/company" : `/api/company/${formData.id}`;
    const method = isNew ? "POST" : "PUT";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    
    setIsSaving(false);
    alert("Saqlandı!");
    fetchCompanyInfo();
  };

  const addStat = () => setFormData({ ...formData, stats: [...formData.stats, { label: "", value: "" }] });
  const updateStat = (index: number, key: string, value: string) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [key]: value };
    setFormData({ ...formData, stats: newStats });
  };
  const removeStat = (index: number) => {
    const newStats = formData.stats.filter((_, i) => i !== index);
    setFormData({ ...formData, stats: newStats });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Kompaniya maǵlıwmatları</h1>
        <p className="text-sm text-slate-400">Biz haqqımızda bólimindegi tekst hám statistikalardı ózgertiw</p>
      </div>

      <form onSubmit={handleSave} className="glass p-6 rounded-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Tiykarǵı atama (Slogan)</label>
          <input className="input-field bg-white/5 p-3 rounded-xl outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-300">Kompaniya haqqında tekst</label>
          <textarea className="input-field bg-white/5 p-3 rounded-xl outline-none min-h-[150px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm text-slate-300">Statistikalar (Mıs: 50+ xızmetker)</label>
          {formData.stats.map((stat, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input placeholder="Mánis (Mıs: 50+)" className="input-field bg-white/5 p-3 rounded-xl outline-none w-1/3" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} />
              <input placeholder="Ataw (Mıs: Xızmetkerler)" className="input-field bg-white/5 p-3 rounded-xl outline-none flex-1" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} />
              <button type="button" onClick={() => removeStat(i)} className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition">X</button>
            </div>
          ))}
          <button type="button" onClick={addStat} className="px-4 py-2 border border-white/10 rounded-xl text-sm hover:bg-white/5 transition self-start">+ Statistika qosıw</button>
        </div>

        <button type="submit" disabled={isSaving} className="mt-4 px-6 py-3 rounded-xl bg-primary hover:bg-blue-600 transition font-bold text-white shadow-lg shadow-primary/20">
          {isSaving ? "Saqlanıp atır..." : "Saqlaw"}
        </button>
      </form>
    </div>
  );
}
