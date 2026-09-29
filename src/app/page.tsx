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
    <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pt-8 pb-24">


      {/* Hero Section */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-10 relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/30 rounded-full blur-3xl -z-10" />
        <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-primary">
          Diyar Market Komandasına Qosıl
        </h1>
        <p className="text-lg text-slate-400 font-medium">
          Dúkanımızdıń bir bólegi bol!
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
            <div className="relative overflow-hidden bg-primary rounded-2xl p-5 flex items-center justify-between group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col">
                <span className="text-white/80 text-sm font-medium mb-1 flex items-center gap-1">
                  <Sparkles size={14} /> Óz jolıńdı basla
                </span>
                <span className="text-white text-xl font-bold">Arza tapsırıw</span>
              </div>
              <div className="relative z-10 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <ChevronRight className="text-white" size={24} />
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
            title="Dúkan haqqında"
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
