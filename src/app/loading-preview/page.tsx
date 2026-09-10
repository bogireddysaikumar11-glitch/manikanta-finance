"use client";

import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoadingPreviewPage() {
  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-[60]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold border border-amber-500/30 shadow-lg transition-colors backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
      <LoadingScreen />
    </div>
  );
}
