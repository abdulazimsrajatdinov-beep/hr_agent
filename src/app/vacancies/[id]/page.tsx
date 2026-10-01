"use client";

import { motion } from "framer-motion";
import { ChevronLeft, DollarSign, Clock, Briefcase, MapPin, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function VacancyDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [vacancy, setVacancy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/vacancies/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setVacancy(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <main className="flex-1 w-full max-w-md mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </main>
    );
  }

  const descriptionLines = vacancy?.description
    ? vacancy.description.split("\n").map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pt-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/vacancies">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <ChevronLeft size={24} className="text-foreground" />
          </div>
        </Link>
        <span className="text-sm font-medium px-3 py-1 bg-primary/20 text-primary rounded-full">
          {vacancy?.isActive !== false ? "Aktiv" : "Jabıq"}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div>
          <h1 className="text-3xl font-extrabold mb-2">{vacancy?.title || "Satıwshı-konsultant"}</h1>
          <p className="text-primary font-medium text-lg">{vacancy?.department || "Real Education bólimi"}</p>
        </div>

        <div className="glass rounded-2xl p-5 grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <DollarSign size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Aylıq</p>
              <p className="text-sm font-semibold text-foreground">{vacancy?.salary || "Sáwbetlesiw tiykarında"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              <Briefcase size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Tájiriybe</p>
              <p className="text-sm font-semibold text-foreground">Talaplar boyınsha</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <Clock size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Bántlik</p>
              <p className="text-sm font-semibold text-foreground">{vacancy?.type || "Tolıq stavka"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Mánzil</p>
              <p className="text-sm font-semibold text-foreground">{vacancy?.location || "Nókis"}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" /> Tolıq maǵlıwmat hám talaplar
          </h2>
          {descriptionLines.length > 0 ? (
            <ul className="space-y-3">
              {descriptionLines.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 size={20} className="text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-300 text-sm leading-relaxed">
              Real Education komandasında juwapkershilikli, mijazlar menen jaqsı qarım-qatnasta bola alatuǵın hám óz isine sadıq xızmetkerlerdi kútemiz.
            </p>
          )}
        </div>
      </motion.div>

      {/* Floating Apply Button */}
      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center w-full max-w-md mx-auto pointer-events-none">
        <Link href={`/application?vacancyId=${resolvedParams.id}`} className="w-full pointer-events-auto">
          <button className="w-full bg-primary hover:bg-yellow-400 text-black shadow-xl shadow-yellow-500/20 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95">
            Arza tapsırıw
          </button>
        </Link>
      </div>
    </main>
  );
}
