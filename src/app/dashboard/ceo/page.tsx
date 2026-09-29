"use client";

import { motion } from "framer-motion";
import { Users, CheckCircle, Clock, TrendingUp, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Yan', arzalar: 65, kesh: 28 },
  { name: 'Fev', arzalar: 59, kesh: 48 },
  { name: 'Mar', arzalar: 80, kesh: 40 },
  { name: 'Apr', arzalar: 81, kesh: 19 },
  { name: 'May', arzalar: 56, kesh: 86 },
  { name: 'Iyun', arzalar: 155, kesh: 27 },
  { name: 'Iyul', arzalar: 210, kesh: 90 },
];

export default function CEODashboard() {
  const [statsData, setStatsData] = useState({ total: 0, hired: 0, pending: 0, vacancies: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => setStatsData(data))
      .catch(err => console.error(err));
  }, []);

  const stats = [
    { label: "Ulıwma Arzalar", value: (statsData.total || 0).toString(), change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/20" },
    { label: "Jumısqa alınǵanlar", value: (statsData.hired || 0).toString(), change: "+5%", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/20" },
    { label: "Intervyu kútilmekte", value: (statsData.pending || 0).toString(), change: "-2%", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/20" },
    { label: "Aktiv Vakansiyalar", value: (statsData.vacancies || 0).toString(), change: "+0%", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/20" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">CEO Dashboard</h1>
          <p className="text-sm text-slate-400">Ulıwma kompaniya kórsetkishleri hám esabatı</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-white/20 transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Icon size={64} className={stat.color} />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.change.startsWith("+") ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
                  {stat.change}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Chart */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="glass rounded-2xl p-6 border border-white/10 lg:col-span-2 flex flex-col min-h-[300px]"
         >
           <h3 className="font-bold text-lg mb-6">Aylar kesiminde arzalar</h3>
           <div className="flex-1 w-full h-64">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                 <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                 <YAxis stroke="#94a3b8" fontSize={12} />
                 <RechartsTooltip
                   contentStyle={{ backgroundColor: "#06402B", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                 />
                 <Line type="monotone" dataKey="arzalar" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                 <Line type="monotone" dataKey="kesh" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
               </LineChart>
             </ResponsiveContainer>
           </div>
         </motion.div>

         {/* Funnel Placeholder */}
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="glass rounded-2xl p-6 border border-white/10 flex flex-col min-h-[300px]"
         >
           <h3 className="font-bold text-lg mb-6">Voronka (Funnel)</h3>
           <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="w-full bg-blue-500/20 rounded-xl p-3 flex justify-between items-center text-sm">
                <span className="font-medium">Sayttan ótkenler</span>
                <span className="font-bold text-blue-400">100%</span>
              </div>
              <div className="w-[85%] mx-auto bg-purple-500/20 rounded-xl p-3 flex justify-between items-center text-sm border border-purple-500/10">
                <span className="font-medium">Arza taslaǵanlar</span>
                <span className="font-bold text-purple-400">85%</span>
              </div>
              <div className="w-[65%] mx-auto bg-orange-500/20 rounded-xl p-3 flex justify-between items-center text-sm border border-orange-500/10">
                <span className="font-medium">AI dan ótkenler</span>
                <span className="font-bold text-orange-400">45%</span>
              </div>
              <div className="w-[45%] mx-auto bg-green-500/20 rounded-xl p-3 flex justify-between items-center text-sm border border-green-500/10">
                <span className="font-medium">Offer alǵanlar</span>
                <span className="font-bold text-green-400">12%</span>
              </div>
           </div>
         </motion.div>
      </div>
    </div>
  );
}
