"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Search, MapPin, DollarSign, Clock, Briefcase } from "lucide-react";
import Link from "next/link";

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vacancies")
      .then(res => res.json())
      .then(data => {
        setVacancies(Array.isArray(data) ? data.filter(v => v.isActive) : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const filtered = vacancies.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase()) || 
    (v.department && v.department.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pt-8 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition cursor-pointer">
            <ChevronLeft size={24} className="text-foreground" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold">Aktiv vakansiyalar</h1>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input 
          type="text"
          placeholder="Vakansiya izlew..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass bg-transparent rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-10">Vakansiya tabılmadı.</p>
        ) : (
          filtered.map((vacancy, index) => (
            <motion.div
              key={vacancy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/vacancies/${vacancy.id}`}>
                <div className="glass glass-hover rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-1">{vacancy.title}</h2>
                      <span className="text-sm text-primary font-medium">{vacancy.department || "Kompaniya bólimi"}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={16} className="text-slate-300" />
                      <span>{vacancy.salary || "Sáwbetlesiw tiykarında"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={16} className="text-slate-300" />
                      <span>Talaplar boyınsha</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-slate-300" />
                      <span>{vacancy.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-slate-300" />
                      <span>{vacancy.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}
