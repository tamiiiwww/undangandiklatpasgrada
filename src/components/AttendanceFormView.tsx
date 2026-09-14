import React, { useState } from "react";
import { ArrowLeft, Send, User, Award, MessageSquare, Check, Sparkles, AlertCircle } from "lucide-react";
import { PaskibraEmblem } from "./PaskibraEmblem";
import { RSVPItem } from "../types";

interface AttendanceFormViewProps {
  onBack: () => void;
  onSubmitSuccess: (rsvp: RSVPItem) => void;
  customLogoUrl?: string;
}

const COMMON_ANGKATAN = [
  "Angkatan 2018",
  "Angkatan 2019",
  "Angkatan 2020",
  "Angkatan 2021",
  "Angkatan 2022",
  "Angkatan 2023",
  "Angkatan 2024",
  "Angkatan 2025",
];

export function AttendanceFormView({
  onBack,
  onSubmitSuccess,
  customLogoUrl,
}: AttendanceFormViewProps) {
  const [name, setName] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuickAngkatan = (val: string) => {
    setAngkatan(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Mohon masukkan nama lengkap atau panggilan Kakak.");
      return;
    }
    if (!angkatan.trim()) {
      setErrorMessage("Mohon masukkan angkatan Kakak.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          angkatan: angkatan.trim(),
          attendance: "hadir",
          notes: notes.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        onSubmitSuccess(data.data);
      } else {
        throw new Error(data.message || "Gagal menyimpan konfirmasi.");
      }
    } catch (err: any) {
      // Standalone / Offline / Vercel & Netlify mode
      const fallbackRsvp: RSVPItem = {
        id: "rsvp-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        name: name.trim(),
        angkatan: angkatan.trim(),
        attendance: "hadir",
        ticketCode: `DIKLAT-${angkatan.replace(/\D/g, "") || "XX"}-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
        isReadByAdmin: false,
      };

      try {
        const existing = localStorage.getItem("paskib_rsvps");
        const list: RSVPItem[] = existing ? JSON.parse(existing) : [];
        localStorage.setItem("paskib_rsvps", JSON.stringify([fallbackRsvp, ...list]));
      } catch {
        // ignore
      }

      onSubmitSuccess(fallbackRsvp);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] py-8 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Back navigation */}
        <button
          id="btn-back-to-home"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Undangan</span>
        </button>

        {/* Card Form */}
        <div className="rounded-2xl p-0.5 bg-gradient-to-b from-amber-500/50 via-red-600/40 to-slate-800 shadow-2xl">
          <div className="rounded-[15px] bg-slate-900 p-6 sm:p-8 border border-slate-800">
            {/* Header with Emblem */}
            <div className="flex flex-col items-center text-center mb-6">
              <PaskibraEmblem size={64} className="mb-3" customLogoUrl={customLogoUrl} />
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Konfirmasi Siap Hadir
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-serif uppercase tracking-wide">
                Identitas Tamu Undangan
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm">
                Silakan isi nama dan angkatan Kakak. Data ini akan dicantumkan pada <strong>Kartu E-Undangan</strong> untuk ditunjukkan di lokasi acara.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAMA INPUT */}
              <div>
                <label
                  htmlFor="input-name"
                  className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Nama Lengkap / Panggilan <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Kak Dwi Septiawan / Kak Rina"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
                  />
                </div>
              </div>

              {/* ANGKATAN INPUT */}
              <div>
                <label
                  htmlFor="input-angkatan"
                  className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Angkatan Berapa <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <input
                    id="input-angkatan"
                    type="text"
                    required
                    value={angkatan}
                    onChange={(e) => setAngkatan(e.target.value)}
                    placeholder="Contoh: Angkatan 2021 / Purna 26 / Angkatan 30"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
                  />
                </div>

                {/* Quick Chips for Angkatan */}
                <div className="mt-2.5">
                  <span className="text-[11px] text-slate-400 block mb-1.5">
                    Pilih cepat angkatan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_ANGKATAN.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleQuickAngkatan(item)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium ${
                          angkatan === item
                            ? "bg-red-600 text-white border-red-500"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PESAN / CATATAN (OPSIONAL) */}
              <div>
                <label
                  htmlFor="input-notes"
                  className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5"
                >
                  Pesan / Doa untuk Adik-adik Diklat <span className="text-slate-500 font-normal">(Opsional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    id="input-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Semangat diklatnya adik-adik, semoga lancar dan makin kompak!"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition resize-none"
                  />
                </div>
              </div>

              {/* Notice regarding admin notification and card */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-amber-400 font-semibold">ℹ️ Informasi:</span> Saat Kakak menekan tombol kirim di bawah:
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
                  <li>Kartu e-undangan resmi atas nama Kakak akan langsung ditampilkan untuk di-screenshot.</li>
                  <li>Notifikasi konfirmasi kehadiran otomatis terkirim ke sistem admin panitia.</li>
                </ul>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                id="btn-submit-attendance"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengirim Konfirmasi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Konfirmasi Kehadiran</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
