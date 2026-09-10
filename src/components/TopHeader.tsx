"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export default function TopHeader({ onToggleSidebar }: TopHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (pathname === "/login") return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/daily-book?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 shadow-xs">
      {/* Left: Mobile Hamburger, Brand Crest on Mobile, & Global Search on Desktop */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-2xl min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Open Menu"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Crest (Visible on small screens) */}
        <div className="flex sm:hidden items-center gap-2 min-w-0">
          <img
            src="/images/manikanta_logo.jpg"
            alt="Manikanta"
            className="w-7 h-7 rounded-full object-cover border border-amber-400 shrink-0"
          />
          <span className="font-extrabold text-xs text-slate-900 tracking-tight truncate">
            MANIKANTA <span className="text-amber-600 font-bold">FINANCE</span>
          </span>
        </div>

        {/* Desktop Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bike, customer, registration number, or invoice..."
            className="w-full pl-10 pr-20 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
          <span className="flex items-center gap-1 absolute right-2.5 top-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs font-medium text-slate-400">
            <span>Ctrl</span>
            <span>K</span>
          </span>
        </form>
      </div>

      {/* Right: Search Toggle (Mobile), Notifications, Admin Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          title="Search"
          aria-label="Toggle Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <button
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="System Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              MR
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-800 leading-tight">
                Manikanta Reddy
              </div>
              <div className="text-xs text-slate-500 font-normal leading-none mt-0.5">
                Admin
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-sm font-semibold text-slate-900">Manikanta Reddy</div>
                <div className="text-xs text-slate-500">
                  admin@manikantafinance.com
                </div>
              </div>

              <div className="px-4 py-2 text-xs text-emerald-600 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 2FA Authentication Active
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors border-t border-slate-100"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Mobile Search Bar Dropdown */}
      {isMobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-3 shadow-md sm:hidden animate-in slide-in-from-top-2 duration-150">
          <form
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setIsMobileSearchOpen(false);
            }}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bike, customer, registration..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
