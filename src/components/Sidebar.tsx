"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bike,
  PlusCircle,
  Users,
  BookOpen,
  CreditCard,
  Receipt,
  BarChart3,
  Settings,
  ShieldCheck,
  X,
  Database,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Bike Inventory", href: "/bikes", icon: Bike, exact: true },
    { label: "Buy Bike (Stock Entry)", href: "/bikes/new", icon: PlusCircle },
    { label: "Sell Bike (New Sale)", href: "/sales/new", icon: Receipt },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Record Book", href: "/daily-book", icon: BookOpen, isRecordBook: true },
    { label: "Payments / EMI", href: "/payments", icon: CreditCard },
    { label: "Expenses", href: "/expenses", icon: BarChart3 },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Security & Settings", href: "/security", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between px-2 mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/images/manikanta_logo.jpg"
                alt="Manikanta Finance"
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="font-bold text-white text-base tracking-wide leading-tight">
                  MANIKANTA
                </div>
                <div className="text-xs font-semibold text-amber-400 tracking-wider">
                  FINANCE & SALES
                </div>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.isRecordBook
                  ? pathname === "/daily-book" || pathname === "/record-book"
                  : item.exact || item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Corporate Status Card */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="rounded-xl bg-slate-800/70 border border-slate-700/60 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                Ledger System
              </span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              Records saved with immutable audit log. PostgreSQL verified.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
