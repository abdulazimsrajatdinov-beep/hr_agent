"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, MapPin, Globe, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CompanyPage() {
  const [info, setInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/company")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const dbInfo = data[0];
          dbInfo.stats = dbInfo.stats ? JSON.parse(dbInfo.stats) : [];
          setInfo(dbInfo);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pt-8 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <ChevronLeft size={24} className="text-foreground" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold">Kompaniya haqqında</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-10"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
      ) : (
        <motion.div 
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Logo & Intro */}
          <div className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-4 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
            
            <div className="w-24 h-24 rounded-2xl bg-primary/20 p-4 flex items-center justify-center relative z-10 border border-primary/30 text-3xl font-black text-primary">
              DM
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">{info?.title || "Diyar Market"}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {info?.description || "Diyar Market — xalqımızǵa sapalı azıq-awqat hám kúndelikli tutınıw malların qolaylı bahalarda usınıwshı zamanagóy supermarketler tarmaǵı."}
              </p>
            </div>
          </div>

          {/* Stats */}
          {info?.stats && info.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {info.stats.map((stat: any, i: number) => (
                <div key={i} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Contact */}
          <div className="glass rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-lg mb-2">Baylanıs maǵlıwmatları</h3>
            
            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:text-primary transition">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Mánzil</p>
                <p className="text-xs text-slate-400 leading-relaxed">Nókis qalası, Diyar Market bas ofisi</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Sociallıq tarmaqlar</p>
                <span className="text-xs text-primary block">@diyarmarket</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
}
