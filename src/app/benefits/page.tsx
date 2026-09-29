"use client";

import { motion } from "framer-motion";
import { ChevronLeft, TrendingUp, Book, HeartHandshake, Coffee, Laptop, Gift } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: TrendingUp, title: "Karyeralıq ósiw", desc: "Satıwshı yamasa kassirlikten filial baslıǵı lawazımına shekem ósiw imkaniyatı", color: "text-blue-500" },
  { icon: Book, title: "Biypul oqıtıw", desc: "Jańa xızmetkerler ushın kásipke úyretiw hám stajirovka", color: "text-purple-500" },
  { icon: HeartHandshake, title: "Doslarsha komanda", desc: "Birge rawajlanatuǵın hám hár dayım járdem beretuǵın jámáát", color: "text-green-500" },
  { icon: Coffee, title: "Qolaylı sharayat", desc: "Taza, zamanagóy dúkan hám túslik awqatlanıw qolaylıqları", color: "text-orange-500" },
  { icon: Laptop, title: "Rásmiy jumıs", desc: "waqtında tólenetuǵın aylıq hám turaqlı jumıs ornı", color: "text-pink-500" },
  { icon: Gift, title: "Bonuslar hám jeńillikler", desc: "Jaqsı nátiyjeler hám bayramlar ushın hár aylıq qosımsha bonuslar", color: "text-yellow-500" },
];

export default function BenefitsPage() {
  return (
    <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col pt-8 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
            <ChevronLeft size={24} className="text-foreground" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold">Bizdiń abzallıqlar</h1>
      </div>

      <motion.div 
        className="flex flex-col gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {benefits.map((benefit, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 flex items-start gap-4"
          >
            <div className={`w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${benefit.color}`}>
              <benefit.icon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground mb-1">{benefit.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{benefit.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
