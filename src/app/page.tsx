"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  Building2, 
  Users, 
  HelpCircle, 
  Gift, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

import Image from "next/image";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pt-6 pb-24">

      {/* Hero Section */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8 relative flex flex-col items-center"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/25 rounded-full blur-3xl -z-10" />
        
        {/* Real HR Official Brand Logo */}
        <div className="relative mb-4 w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/25 border-2 border-primary/50 p-1 bg-yellow-400">
          <Image 
            src="/real-logo.jpg" 
            alt="Real HR Logo" 
            width={96} 
            height={96} 
            className="w-full h-full object-cover rounded-2xl"
            priority
          />
        </div>

        <h1 className="text-4xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 font-serif tracking-tight">
          REAL HR
        </h1>
        <p className="text-xs font-bold tracking-[0.25em] text-primary uppercase mb-2">
          REAL EDUCATION
        </p>
        <p className="text-sm text-slate-300 font-medium max-w-xs">
          Real Education komandasına qosıl hám keleshegińdi biz benen birge qur!
        </p>
      </motion.div>

      {/* Main Actions */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4"
      >
        {/* Primary Action */}
        <motion.div variants={itemVariants}>
          <Link href="/application" className="block">
            <div className="relative overflow-hidden bg-primary text-black rounded-2xl p-5 flex items-center justify-between group shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/35 transition-all">
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col">
                <span className="text-black/80 text-xs font-bold mb-1 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles size={14} className="text-black" /> Óz jolıńdı basla
                </span>
                <span className="text-black text-xl font-black">Arza tapsırıw</span>
              </div>
              <div className="relative z-10 w-12 h-12 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <ChevronRight className="text-black" size={24} />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Secondary Actions Grid */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <ActionCard 
            href="/vacancies" 
            icon={<Briefcase size={24} className="text-primary" />}
            title="Vakansiyalar"
            variants={itemVariants}
          />
          <ActionCard 
            href="/company" 
            icon={<Building2 size={24} className="text-primary" />}
            title="Oray haqqında"
            variants={itemVariants}
          />
          <ActionCard 
            href="/benefits" 
            icon={<Gift size={24} className="text-primary" />}
            title="Abzallıqlar"
            variants={itemVariants}
          />
          <ActionCard 
            href="/team" 
            icon={<Users size={24} className="text-primary" />}
            title="Bizdiń komanda"
            variants={itemVariants}
          />
          <ActionCard 
            href="/faq" 
            icon={<HelpCircle size={24} className="text-primary" />}
            title="Sorawlar (FAQ)"
            variants={itemVariants}
            className="col-span-2"
          />
        </div>
      </motion.div>
    </main>
  );
}

function ActionCard({ 
  href, 
  icon, 
  title, 
  variants,
  className = ""
}: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  variants: any;
  className?: string;
}) {
  return (
    <motion.div variants={variants} className={className}>
      <Link href={href} className="block h-full">
        <div className="glass glass-hover rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 h-full">
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
          <span className="font-semibold text-foreground/90">{title}</span>
        </div>
      </Link>
    </motion.div>
  );
}
