"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Briefcase, Building2, HelpCircle, UserCheck, Menu, X, ListTodo, FileText, Calculator, LayoutDashboard } from "lucide-react";

export default function HRDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Kandidatlar", href: "/dashboard/hr", icon: UserCheck },
    { name: "Vakansiyalar", href: "/dashboard/hr/vacancies", icon: Briefcase },
    { name: "Kompaniya", href: "/dashboard/hr/company", icon: Building2 },
    { name: "Komanda", href: "/dashboard/hr/team", icon: Users },
    { name: "Wazıypalar", href: "/dashboard/hr/tasks", icon: ListTodo },
    { name: "SOP", href: "/dashboard/hr/sop", icon: FileText },
    { name: "FAQ (Sorawlar)", href: "/dashboard/hr/faq", icon: HelpCircle },
    { name: "HR Rejelestiriw", href: "/dashboard/hr/planning", icon: Calculator },
    { name: "CEO Dashboard", href: "/dashboard/ceo", icon: LayoutDashboard },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 glass border-b border-white/10 sticky top-0 z-50">
        <h1 className="font-bold text-lg">HR CMS</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 glass border-r border-white/10 p-4 flex-col gap-2 z-40 transition-transform duration-300
        ${isMobileMenuOpen ? "flex translate-x-0" : "hidden md:flex -translate-x-full md:translate-x-0"}
      `}>
        <div className="hidden md:block mb-8 mt-4 px-4">
          <h1 className="font-bold text-2xl text-primary">DIYAR MARKET</h1>
          <p className="text-xs text-slate-400">HR Basqarıw Sisteması</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1 mt-4 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-slate-300"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
