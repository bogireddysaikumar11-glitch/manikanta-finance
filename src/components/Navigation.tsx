"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bike,
  BookOpen,
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  DollarSign,
  BarChart3,
  FileSpreadsheet,
  ShieldCheck,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, don't show the main navigation
  if (pathname === "/login") return null;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    {
      label: "Daily Record Book",
      href: "/daily-book",
      icon: BookOpen,
      highlight: true,
    },
    { label: "Bike Inventory", href: "/bikes", icon: Bike },
    { label: "New Sale", href: "/sales/new", icon: Receipt },
    { label: "Payments", href: "/payments", icon: CreditCard },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Expenses", href: "/expenses", icon: DollarSign },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Excel Export", href: "/export", icon: FileSpreadsheet },
    { label: "Security & Audit", href: "/security", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800 no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Bike className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wide text-white group-hover:text-amber-400 transition-colors">
                  MANIKANTA FINANCE
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                  MF-2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Second-Hand Two-Wheeler Sales & Record Management
              </p>
            </div>
          </Link>

          {/* Right Header Status */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PostgreSQL Single Source of Truth</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <div className="w-7 h-7 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                A
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-semibold text-slate-200 leading-none">Admin</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" /> 2FA Active
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 border border-transparent hover:border-rose-500/20"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="bg-slate-950 border-t border-slate-800/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                      : item.highlight
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-slate-950 stroke-[2.5]" : item.highlight ? "text-amber-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.highlight && !isActive && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 inline" /> STAR
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
