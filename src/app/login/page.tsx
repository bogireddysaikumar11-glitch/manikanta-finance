"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bike,
  ShieldCheck,
  KeyRound,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Phone,
  Database,
  RefreshCw,
  Calendar,
  TrendingUp,
  Receipt,
  BookOpen,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("admin");
  const [password, setPassword] = useState("Admin@Manikanta2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [twoFactorCode, setTwoFactorCode] = useState("202600");
  const [userId, setUserId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 1-Click Fast Autofill Demo Credentials
  const handleQuickAutofill = () => {
    setIdentifier("admin");
    setPassword("Admin@Manikanta2026");
    setError(null);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Check credentials.");
      }

      if (data.requires2FA) {
        setUserId(data.userId);
        setStep("2fa");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 800);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: twoFactorCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid 2FA verification code.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative selection:bg-blue-500 selection:text-white">
      {/* Subtle Background Mesh & Accent Gradient (Matches Dashboard Look) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-80" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Top Enterprise Header Bar */}
      <header className="relative z-10 w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/images/manikanta_logo.jpg"
              alt="Manikanta Finance"
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-base tracking-wide leading-tight flex items-center gap-2">
              <span>MANIKANTA</span>
              <span className="text-amber-600 text-xs font-bold px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                FINANCE
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-500 tracking-wider">
              ALL TWO WHEELER BIKES SHOWROOM
            </div>
          </div>
        </Link>

        {/* Status Pill matching TopHeader */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ledger System Online</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Showroom Portal</span>
          </div>
        </div>
      </header>

      {/* 2. Main Login Content Area (Executive Split / Centered Layout) */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Hero / Brand Showcase (Aligned with Dashboard KPI Features) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Showroom Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>OFFICIAL SHOWROOM & FINANCIAL LEDGER</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Two-Wheeler Sales & Finance Management
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                Complete inventory valuation, automated sales profit accounting, daily cash & UPI collection books, and customer EMI records.
              </p>
            </div>

            {/* Dashboard Feature Highlights Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex items-start gap-3 hover:border-slate-300 transition-colors">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Showroom Stock</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Real-time bike inventory, repair status & capital tracking.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex items-start gap-3 hover:border-slate-300 transition-colors">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Profit & Margins</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automated vehicle margin and instant collection reporting.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex items-start gap-3 hover:border-slate-300 transition-colors">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Daily Record Book</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Complete history of bike purchases, sales, and EMI dues.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex items-start gap-3 hover:border-slate-300 transition-colors">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Argon2id Security</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    2FA security & immutable cryptographic audit logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Pill */}
            <div className="pt-2 flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                ★ 26+ Years of Proven Showroom Trust
              </span>
              <span>•</span>
              <span className="text-slate-500">Authorized Dealer Portal</span>
            </div>
          </div>

          {/* Right Column: Main Sign-In Card (Styled exactly like Dashboard Cards) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-300 shadow-lg shadow-slate-200/50 p-6 sm:p-8 relative overflow-hidden">
              {/* Top Accent Strip matching Dashboard Blue & Gold */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500" />

              {/* Card Header with Manikanta Crest */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="relative shrink-0">
                  <img
                    src="/images/manikanta_logo.jpg"
                    alt="Manikanta Finance"
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white border border-slate-200 p-0.5 rounded-full text-blue-600 shadow-2xs">
                    <Bike className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                    Showroom Sign In
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized Manikanta Finance Ledger Portal
                  </p>
                </div>
              </div>

              {/* Quick Demo Autofill Pill (Executive Style) */}
              <div className="mb-5 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    Login: <strong className="text-slate-900 font-mono">admin</strong> or <strong className="text-slate-900 font-mono">9876543210</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickAutofill}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition-colors shadow-2xs"
                >
                  Fill Demo
                </button>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Notification */}
              {success && (
                <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-xs font-medium animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Credentials verified! Accessing showroom dashboard...</span>
                </div>
              )}

              {/* Step 1: Credentials Form */}
              {step === "credentials" ? (
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Username or Mobile Number
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Enter username or mobile number (e.g. admin or 9876543210)"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Admin Password
                      </label>
                      <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Argon2id Encrypted
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter security password"
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Recovery */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors font-medium">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-50 border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Remember Session</span>
                    </label>
                    <Link
                      href="/security"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Need 2FA Help?
                    </Link>
                  </div>

                  {/* Submit Button in Dashboard Royal Blue */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 group"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: 2-Factor Authentication */
                <form onSubmit={handle2FASubmit} className="space-y-5 animate-in fade-in">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Enter the 6-digit verification code from your authenticator app.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center uppercase tracking-wider">
                      Security Code (Default Demo: 202600)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      placeholder="202600"
                      className="w-full py-3 text-center font-mono text-2xl font-bold tracking-[0.5em] bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-900 outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Confirm & Enter Showroom</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setStep("credentials")}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      ← Back to Email / Password
                    </button>
                  </div>
                </form>
              )}

              {/* Test Loading State Link */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Test visual loading animation?</span>
                <Link
                  href="/loading-preview"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <span>Loading Preview</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Security & Corporate Footer matching Dashboard Architecture */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200 py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Manikanta Finance</span>
            <span>•</span>
            <span>All Two Wheeler Bikes • Since 26 Years Ago</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              256-Bit Argon2id Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-4 h-4 text-blue-600" />
              PostgreSQL Ledger
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-4 h-4 text-amber-600" />
              Support: +91 98456 12345
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
