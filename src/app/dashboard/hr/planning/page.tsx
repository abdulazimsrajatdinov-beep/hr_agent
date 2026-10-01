"use client";

import { useState, useMemo } from "react";
import { Calculator, ShoppingCart, ShoppingBag, Briefcase, Building2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function HRPlanningPage() {
  // Input states
  const [dailyCustomers, setDailyCustomers] = useState(2000);
  const [customersPerCashier, setCustomersPerCashier] = useState(300); // 1 kassir kúnine qansha mijazǵa xızmet kórsetedi
  
  const [marketArea, setMarketArea] = useState(500); // Kvadrat metr
  const [areaPerSales, setAreaPerSales] = useState(100); // 100 kv.m ushın 1 satıwshı kerek

  const [totalRegisters, setTotalRegisters] = useState(4); // Jami kassa apparatları
  const [shiftsPerDay, setShiftsPerDay] = useState(2); // Kúnine 2 smena
  
  // Calculations
  const calculated = useMemo(() => {
    // 1. Kassirler esabı
    const requiredCashiersPerShift = Math.ceil(dailyCustomers / (customersPerCashier * shiftsPerDay));
    const requiredTotalCashiers = requiredCashiersPerShift * shiftsPerDay;
    
    // 2. Zal xızmetkerleri (Satıwshılar)
    const requiredSalesPerShift = Math.ceil(marketArea / areaPerSales);
    const requiredTotalSales = requiredSalesPerShift * shiftsPerDay;
    
    // 3. Status checks
    const hasEnoughRegisters = requiredCashiersPerShift <= totalRegisters;
    const registerUtilization = Math.round((requiredCashiersPerShift / totalRegisters) * 100);

    return {
      requiredCashiersPerShift,
      requiredTotalCashiers,
      requiredSalesPerShift,
      requiredTotalSales,
      hasEnoughRegisters,
      registerUtilization
    };
  }, [dailyCustomers, customersPerCashier, marketArea, areaPerSales, totalRegisters, shiftsPerDay]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Calculator className="text-primary" size={32} />
          Oray Kadrların Rejelestiriw
        </h1>
        <p className="text-slate-400 mt-2">
          Real Education filiallarında kúnlik oqıwshılar hám oray auditoriyalarınan kelip shıǵıp, anıq neshe kadr kerek ekenligin esaplaw.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INPUTS SECTION */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-2"><ShoppingCart size={20}/> Mijazlar hám Kassa</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Kúnlik Mijazlar aǵımı (Ortasha)</label>
                <input 
                  type="number" 
                  value={dailyCustomers} 
                  onChange={e => setDailyCustomers(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">1 Kassir kúnine neshe mijazǵa xızmet kórsetedi?</label>
                <input 
                  type="number" 
                  value={customersPerCashier} 
                  onChange={e => setCustomersPerCashier(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-2"><Building2 size={20}/> Oray Infrastrukturası</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Oray maydanı (kv.m)</label>
                <input 
                  type="number" 
                  value={marketArea} 
                  onChange={e => setMarketArea(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Jami islep turǵan Kassa apparatları sanı</label>
                <input 
                  type="number" 
                  value={totalRegisters} 
                  onChange={e => setTotalRegisters(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Kúndelik Smenalar sanı (Ádette 2)</label>
                <input 
                  type="number" 
                  value={shiftsPerDay} 
                  onChange={e => setShiftsPerDay(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-2"><Briefcase size={20}/> Zal xızmeti</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Neshe kv.m ushın 1 satıwshı/konsultant kerek?</label>
                <input 
                  type="number" 
                  value={areaPerSales} 
                  onChange={e => setAreaPerSales(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50"
                />
                <p className="text-[10px] text-slate-500 mt-1">Standart boyınsha 50 yamasa 100 kv.m maydanǵa 1 xızmetker.</p>
              </div>
            </div>
          </div>
        </div>

        {/* OUTPUTS SECTION */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">Esap hám Prognoz</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <motion.div 
                key={calculated.requiredTotalCashiers}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-primary/20 border border-primary/30 p-6 rounded-2xl flex flex-col justify-center items-center text-center"
              >
                <h3 className="text-lg font-medium text-green-200 mb-2">Talap etiletuǵın Kassirler (Jami)</h3>
                <p className="text-5xl font-black text-white">{calculated.requiredTotalCashiers}</p>
                <p className="text-sm text-green-300 mt-2">Hár smenada {calculated.requiredCashiersPerShift} kadr</p>
              </motion.div>

              <motion.div 
                key={calculated.requiredTotalSales}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-purple-500/20 border border-purple-500/30 p-6 rounded-2xl flex flex-col justify-center items-center text-center"
              >
                <h3 className="text-lg font-medium text-purple-200 mb-2">Talap etiletuǵın Satıwshılar (Zal)</h3>
                <p className="text-5xl font-black text-white">{calculated.requiredTotalSales}</p>
                <p className="text-sm text-purple-300 mt-2">Hár smenada {calculated.requiredSalesPerShift} kadr</p>
              </motion.div>
            </div>

            <div className={`rounded-2xl p-6 border ${calculated.hasEnoughRegisters ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
               <div className="flex items-start gap-4">
                 <div className={`mt-1 ${calculated.hasEnoughRegisters ? 'text-green-500' : 'text-red-500'}`}>
                   {calculated.hasEnoughRegisters ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>}
                 </div>
                 <div>
                   <h4 className={`font-bold text-lg ${calculated.hasEnoughRegisters ? 'text-green-400' : 'text-red-400'}`}>
                     Kassa apparatları {calculated.hasEnoughRegisters ? "Jeterli" : "Jetpeydi!"}
                   </h4>
                   <p className="text-sm text-slate-300 mt-1">
                     Házirgi filialda jami <strong>{totalRegisters}</strong> kassa apparatı bar. 
                     Sizge bolsa bir smenada <strong>{calculated.requiredCashiersPerShift}</strong> kassa hám kassir islesiwi kerek. 
                   </p>
                   
                   <div className="mt-4">
                     <div className="flex justify-between text-xs mb-1">
                       <span>Kassa júklemesi (Load)</span>
                       <span className={calculated.registerUtilization > 100 ? 'text-red-400 font-bold' : ''}>{calculated.registerUtilization}%</span>
                     </div>
                     <div className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full ${calculated.registerUtilization > 100 ? 'bg-red-500' : 'bg-green-500'}`} 
                         style={{ width: `${Math.min(calculated.registerUtilization, 100)}%` }}
                       />
                     </div>
                   </div>

                   {!calculated.hasEnoughRegisters && (
                     <p className="text-sm text-red-300 mt-4 bg-red-950/50 p-3 rounded-xl border border-red-500/20">
                       <strong>Dıqqat:</strong> Ocherdler kóbeyip ketiwiniń yamasa klientler qánáátlenbewiniń aldın alıw ushın qosımsha kassa apparatların ornatıw hám kadr qabıllaw usınıs etiledi.
                     </p>
                   )}
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
