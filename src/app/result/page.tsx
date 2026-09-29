"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Home, BarChart3, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const s = localStorage.getItem("lastScore");
    if (s) setScore(parseInt(s));
  }, []);

  return (
    <main className="flex w-full h-[100dvh] max-w-md mx-auto flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Confetti or background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="relative z-10"
      >
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={56} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-black mb-2">Qutlıqlaymız!</h1>
        <p className="text-slate-400 text-sm mb-8">Siz AI Intervyunı tabıslı juwmaqladıńız.</p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full glass rounded-3xl p-6 mb-8 relative z-10"
      >
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            <span className="font-semibold text-sm">AI Bahalaw</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="font-bold text-sm">Úlken potentsial</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          <span className="text-5xl font-black text-white mb-2">{score || 85}<span className="text-2xl text-slate-500">/100</span></span>
          <p className="text-xs text-slate-400">Bal - Orta dárejeden joqarı</p>
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-slate-300 mb-8 max-w-[280px] mx-auto z-10"
      >
        Sizdiń juwaplarıńız HR menen kórip shıǵıladı hám tez arada sizbenen baylanısamız.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full z-10"
      >
        <Link href="/">
          <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex justify-center items-center gap-2">
            <Home size={20} />
            Bas betke qaytıw
          </button>
        </Link>
      </motion.div>
    </main>
  );
}
