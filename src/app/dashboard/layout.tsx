"use client";

import { motion } from "framer-motion";
import { Users, LayoutDashboard, Briefcase, Settings, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (pathname?.startsWith("/dashboard/hr")) {
    return <>{children}</>;
  }

  const links = [
    { href: "/dashboard/hr", label: "HR Panel", icon: Users },
    { href: "/dashboard/ceo", label: "CEO Panel", icon: LayoutDashboard },
    { href: "/vacancies", label: "Vakansiyalar", icon: Briefcase },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col glass border-r border-white/10 relative z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1"><div className="w-9 h-9 rounded-xl overflow-hidden bg-yellow-400 p-0.5 border border-primary/40 shrink-0"><img src="/real-logo.jpg" alt="Real HR" className="w-full h-full object-cover rounded-lg" /></div><h2 className="text-lg font-black text-primary leading-tight">REAL HR</h2></div>
          <p className="text-xs text-slate-400">AI Recruitment System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary/20 text-primary border border-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <link.icon size={20} />
                  <span className="font-medium text-sm">{link.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-4 md:px-6 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-300" onClick={() => setIsMobileOpen(!isMobileOpen)}>
              <Menu size={24} />
            </button>
            <h1 className="font-bold hidden md:block">Basqarıw Paneli</h1>
          </div>
          <div className="flex items-center gap-4">
             <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
               <Bell size={20} className="text-slate-300" />
             </button>
             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
               <Settings size={20} className="text-primary" />
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
