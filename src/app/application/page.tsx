"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload, BrainCircuit, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Jeke maǵlıwmatlar" },
  { id: 2, title: "Bilim" },
  { id: 3, title: "Tájiriybe" },
  { id: 4, title: "Kónlikpeler" },
  { id: 5, title: "Portfolio" },
  { id: 6, title: "AI Intervyu" },
];

export default function ApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    username: "",
    birthDate: "",
    university: "",
    major: "",
    gradYear: "",
    prevCompany: "",
    prevRole: "",
    achievements: "",
    portfolioUrl: "",
    resumeUrl: "",
    skills: [] as string[],
    chatId: "",
    vacancyId: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const vId = params.get("vacancyId");
      if (vId) {
        setFormData(prev => ({ ...prev, vacancyId: vId }));
      }
    }

    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      tg.ready();
      
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setFormData(prev => ({
          ...prev,
          fullName: [user.first_name, user.last_name].filter(Boolean).join(" ") || prev.fullName,
          username: user.username ? `@${user.username}` : prev.username,
          chatId: user.id ? String(user.id) : prev.chatId,
        }));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Fake upload for now, just save the file name to simulate success
      setFormData(prev => ({ ...prev, resumeUrl: file.name }));
    }
  };

  const nextStep = () => {
    setError("");
    // Validation
    if (currentStep === 1 && (!formData.fullName.trim() || !formData.phone.trim() || !formData.birthDate)) {
      setError("Iltimas, atı-jónińiz, telefon nomerińiz hám tuwılǵan sáneńizdi tolıq kiritinń.");
      return;
    }
    if (currentStep === 2 && (!formData.university.trim() || !formData.major.trim())) {
      setError("Iltimas, oqıw ornı hám qánigeligińizdi kiritinń.");
      return;
    }
    if (currentStep === 4 && formData.skills.length === 0) {
      setError("Keminde 1 kónlikpe (skill) tańlań.");
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleStartInterview = async () => {
    try {
      const res = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const candidate = await res.json();
      
      if (res.status === 400 || candidate.error) {
        setError(candidate.error || "Arzańızdı qabıllawda qátelik júz berdi.");
        return;
      }
      
      if (candidate?.id) {
        localStorage.setItem("currentCandidateId", candidate.id);
      }
      router.push("/ai-interview");
    } catch (error) {
      console.error("Failed to submit application", error);
      setError("Tarmoq qáteligi júz berdi. Iltimas, qayta urınıp kóriń.");
    }
  };

  return (
    <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col h-[100dvh] pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-10 h-10 rounded-full glass flex items-center justify-center cursor-pointer" onClick={prevStep}>
          {currentStep === 1 ? (
            <Link href="/"><ChevronLeft size={24} className="text-foreground" /></Link>
          ) : (
            <ChevronLeft size={24} className="text-foreground" />
          )}
        </div>
        <div className="flex-1 px-4">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <span className="text-sm font-bold text-slate-400">
          {currentStep}/{steps.length}
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-foreground">{steps[currentStep - 1].title}</h1>
      {error && <p className="text-red-500 text-sm mb-4 animate-pulse">{error}</p>}
      {!error && <div className="mb-4"></div>}

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto pb-24" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {currentStep === 1 && (
               <>
                 <InputField label="Toliq atı-jónińiz *" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Mısalı: Aliev Wáli" />
                 <InputField label="Telefon nomer *" name="phone" value={formData.phone} onChange={handleChange} placeholder="+998" type="tel" />
                 <InputField label="Telegram username" name="username" value={formData.username} onChange={handleChange} placeholder="@username" />
                 <InputField label="Tuwılǵan sáne" name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" placeholder="" />
               </>
            )}
            
            {currentStep === 2 && (
               <>
                 <InputField label="Oqıw ornı / Universitet *" name="university" value={formData.university} onChange={handleChange} placeholder="Mısalı: Nókis Mámleketlik Universiteti" />
                 <InputField label="Qánigeligiz *" name="major" value={formData.major} onChange={handleChange} placeholder="Mısalı: Kassir, Satıwshı" />
                 <InputField label="Tamamlaǵan jıl" name="gradYear" value={formData.gradYear} onChange={handleChange} placeholder="Mısalı: 2024" type="number" />
               </>
            )}

            {currentStep === 3 && (
               <>
                 <InputField label="Aldınǵı jumıs ornıńız" name="prevCompany" value={formData.prevCompany} onChange={handleChange} placeholder="Kompaniya atı" />
                 <InputField label="Lawazımıńız" name="prevRole" value={formData.prevRole} onChange={handleChange} placeholder="Mısalı: Kassir yamasa Administrator" />
                 <div className="flex flex-col gap-2">
                   <label className="text-sm font-medium text-slate-300">Jetiskenliklerińiz</label>
                   <textarea 
                     name="achievements"
                     value={formData.achievements}
                     onChange={handleChange}
                     rows={3} 
                     className="glass bg-transparent rounded-2xl p-4 outline-none focus:border-primary/50 text-foreground resize-none"
                     placeholder="Qanday jetiskenliklerge eristińiz?"
                   />
                 </div>
               </>
            )}

            {currentStep === 4 && (
               <div className="flex flex-col gap-4">
                 <p className="text-sm text-slate-400 mb-2">Ózińiz jaqsı biletugın kónlikpelerdi tańlań (*):</p>
                 <div className="flex flex-wrap gap-2">
                    {["Pedagogika & Oqıtıw", "Mijazlar menen islesiw", "Inglis tili", "Rus tili", "IT & Dástúrlew", "Matematika", "SMM & Marketing", "Administratorlıq", "Prezentaciya", "Psixologiya", "Kompyuter sawatlılıǵı"].map(skill => {
                      const isSelected = formData.skills.includes(skill);
                      return (
                        <div 
                          key={skill} 
                          onClick={() => toggleSkill(skill)}
                          className={`px-4 py-2 rounded-full cursor-pointer transition-all duration-300 border flex items-center gap-1 ${
                            isSelected 
                              ? "bg-primary text-black font-bold border-primary shadow-lg shadow-yellow-500/30" 
                              : "glass hover:bg-white/10 border-white/10"
                          }`}
                        >
                          {isSelected && <Check size={14} />}
                          {skill}
                        </div>
                      )
                    })}
                 </div>
               </div>
            )}

            {currentStep === 5 && (
               <>
                 <input 
                   type="file" 
                   accept=".pdf,.docx,.doc" 
                   className="hidden" 
                   ref={fileInputRef} 
                   onChange={handleFileUpload}
                 />
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
                     formData.resumeUrl ? "border-amber-400/50 bg-amber-400/10" : "border-white/20 hover:bg-white/5"
                   }`}
                 >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${formData.resumeUrl ? 'bg-amber-400/20' : 'bg-primary/20'}`}>
                      {formData.resumeUrl ? <Check size={28} className="text-amber-400" /> : <Upload size={28} className="text-primary" />}
                    </div>
                    <h3 className="font-bold">{formData.resumeUrl ? "CV Júklendi!" : "CV / Reyume júkleń"}</h3>
                    <p className="text-sm text-slate-400">{formData.resumeUrl || "PDF yamasa DOCX formatında (Max 5MB)"}</p>
                 </div>
                 <InputField label="Qosımsha hújjet (eger bolsa)" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://" />
               </>
            )}

            {currentStep === 6 && (
               <div className="flex flex-col items-center text-center mt-10">
                 <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative">
                    <BrainCircuit size={48} className="text-primary" />
                    <motion.div 
                      className="absolute inset-0 border-2 border-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                 </div>
                 <h2 className="text-2xl font-bold mb-4">AI Intervyuga tayarsızba?</h2>
                 <p className="text-slate-400 mb-8">
                   Bizdiń AI asistentimiz sizden vakansiyaga sáykes sorawlar soraydi hám bilimingizdi bahalaydi.
                 </p>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer / Controls */}
      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center w-full max-w-md mx-auto">
        <button 
          onClick={currentStep === steps.length ? handleStartInterview : nextStep}
          className="w-full bg-primary hover:bg-yellow-400 text-black shadow-xl shadow-yellow-500/20 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 flex justify-center items-center gap-2"
        >
          {currentStep === steps.length ? "Intervyunı baslaw" : "Kelesi"}
          {currentStep !== steps.length && <ChevronRight size={20} />}
        </button>
      </div>
    </main>
  );
}

function InputField({ 
  label, 
  placeholder, 
  type = "text",
  name,
  value,
  onChange 
}: { 
  label: string, 
  placeholder: string, 
  type?: string,
  name?: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="glass bg-transparent rounded-2xl p-4 outline-none focus:border-primary/50 text-foreground"
      />
    </div>
  );
}
