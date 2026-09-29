"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then(res => res.json())
      .then(data => {
        setFaqs(Array.isArray(data) ? data : []);
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
        <h1 className="text-2xl font-bold">Kóp beriletuǵın sorawlar</h1>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-slate-500 py-10">Házirshe FAQ joq.</p>
        ) : (
          faqs.map((faq, index) => (
            <motion.div 
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-5 flex items-center justify-between text-left gap-4"
              >
                <span className="font-bold text-foreground">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-slate-400 shrink-0 transition-transform ${openIndex === index ? "rotate-180" : ""}`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-sm text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}
