"use client";

import { motion } from "framer-motion";
import { ChevronLeft, TrendingUp, Book, HeartHandshake, Coffee, Laptop, Gift } from "lucide-react";
import Link from "next/link";

const benefits = [
  { icon: TrendingUp, title: "Karyeralıq ósiw", desc: "Oqıtıwshılıqtan filial yamasa baǵdar baslıǵı lawazımına shekem tez ósiw imkaniyatı", color: "text-amber-400" },
  { icon: Book, title: "Úzliksiz rawajlanıw", desc: "Mentorlıq dástúrleri, zamanagóy pedagogika hám metodikalıq biypul treningler", color: "text-purple-400" },
  { icon: HeartHandshake, title: "Doslarsha komanda", desc: "Zamanagóy, intellektual hám bir-birin qollap-quwatlaytuǵın kúshli jámáát", color: "text-emerald-400" },
  { icon: Coffee, title: "Qolaylı sharayat", desc: "Zamanagóy oqıw xanaları, innovaciyalıq texnika hám shiyrin kofe-breyk zonaları", color: "text-orange-400" },
  { icon: Laptop, title: "Rásmiy jumıs", desc: "Waqtında tólenetuǵın bekkem aylıq, sociallıq paket hám rásmiy miynet shártnaması", color: "text-blue-400" },
  { icon: Gift, title: "Bonuslar hám motivaciya", desc: "Nátijeli gruppalar, studentler jeńisleri hám KPI boyınsha úlken qosımsha bonuslar", color: "text-yellow-400" },
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
