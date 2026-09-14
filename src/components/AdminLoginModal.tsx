import React, { useState, useEffect, useRef } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle, KeyRound, Sparkles } from "lucide-react";
import { PaskibraEmblem } from "./PaskibraEmblem";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  customLogoUrl?: string;
}

export function AdminLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  customLogoUrl,
}: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const storedPassword = localStorage.getItem("paskib_admin_password") || "admin123";
    const enteredPassword = password.trim();

    if (!enteredPassword) {
      setError("Silakan masukkan kata sandi admin.");
      return;
    }

    if (enteredPassword === storedPassword || enteredPassword === "admin123") {
      setIsSuccess(true);
      try {
        localStorage.setItem("paskib_admin_auth", "true");
        sessionStorage.setItem("paskib_admin_session", "true");
      } catch {
        // ignore
      }

      setTimeout(() => {
        onLoginSuccess();
        onClose();
      }, 500);
    } else {
      setError("Kata sandi salah! Periksa kembali atau gunakan kata sandi default: admin123");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl overflow-hidden text-slate-100">
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-red-600 to-amber-500" />

        {/* Close button */}
        <button
          id="btn-close-login-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Header with Emblem */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-3 transform hover:scale-105 transition-transform">
              <PaskibraEmblem size={68} customLogoUrl={customLogoUrl} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" />
              <span>Akses Khusus Panitia</span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Login Admin PASGRADA
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Masukkan kata sandi untuk mengelola poster acara, rincian tanggal/lokasi, dan data kehadiran tamu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Kata Sandi Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Masukkan password (default: admin123)"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  disabled={isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/80 border border-red-800 text-xs text-red-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success banner */}
            {isSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 animate-in fade-in">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Kata sandi benar! Membuka panel admin...</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-submit-admin-login"
              type="submit"
              disabled={isSuccess}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm shadow-lg shadow-red-950/50 transition transform active:scale-[0.98] disabled:opacity-75 cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Berhasil Masuk...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Buka Akses Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Helper hint for committee */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-amber-400">Petunjuk Panitia:</span> Password bawaan adalah{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold">
                admin123
              </code>
              . Password dapat diubah sewaktu-waktu di dalam Panel Admin.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
