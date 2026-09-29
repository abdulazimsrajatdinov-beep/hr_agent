"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then(res => res.json())
      .then(data => {
        setTeam(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pt-8 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <ChevronLeft size={24} className="text-foreground" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold">Bizdiń komanda</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 flex justify-center p-10"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
        ) : team.length === 0 ? (
          <p className="col-span-2 text-center text-slate-500 py-10">Házirshe komanda aǵzaları joq.</p>
        ) : (
          team.map((member, i) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-4 flex flex-col items-center text-center gap-3"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 overflow-hidden relative border-2 border-primary/20">
                {member.imageUrl ? (
                  <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/50 bg-primary/20">{member.name.charAt(0)}</div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">{member.name}</h3>
                <p className="text-xs text-primary mt-1">{member.role}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}
