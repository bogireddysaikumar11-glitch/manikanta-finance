"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bike,
  PlusCircle,
  Receipt,
  BookOpen,
  Menu,
} from "lucide-react";

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export default function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();

  // Hide bottom nav on login page
  if (pathname === "/login") return null;

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: LayoutDashboard,
      isActive: pathname === "/",
    },
    {
      label: "Stock",
      href: "/bikes",
      icon: Bike,
      isActive: pathname === "/bikes",
    },
    {
      label: "Buy Bike",
      href: "/bikes/new",
      icon: PlusCircle,
      isPrimary: true,
      isActive: pathname === "/bikes/new",
    },
    {
      label: "Sell Bike",
      href: "/sales/new",
      icon: Receipt,
      isActive: pathname === "/sales/new",
    },
    {
      label: "Daybook",
      href: "/daily-book",
      icon: BookOpen,
      isActive: pathname === "/daily-book",
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg lg:hidden transition-transform duration-200"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-6 h-16 max-w-md mx-auto items-center px-1">
        {/* First 2 Items */}
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                item.isActive
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    item.isActive ? "scale-110 stroke-[2.5]" : "stroke-2"
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Center Prominent "Buy Bike" Action */}
        <div className="flex flex-col items-center justify-center relative -top-3">
          <Link
            href="/bikes/new"
            aria-label="Buy Bike Stock Entry"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${
              pathname === "/bikes/new"
                ? "bg-amber-500 text-slate-950 ring-4 ring-amber-100"
                : "bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-50"
            }`}
          >
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </Link>
          <span
            className={`text-[10px] mt-0.5 font-bold tracking-tight ${
              pathname === "/bikes/new" ? "text-amber-600" : "text-blue-700"
            }`}
          >
            Buy Bike
          </span>
        </div>

        {/* Remaining 2 Main Items */}
        {navItems.slice(3, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                item.isActive
                  ? "text-blue-600 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    item.isActive ? "scale-110 stroke-[2.5]" : "stroke-2"
                  }`}
                />
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* "More" Drawer Button */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open Full Menu Drawer"
          className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900 font-medium rounded-xl transition-colors active:scale-95"
        >
          <Menu className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-1 tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
}
