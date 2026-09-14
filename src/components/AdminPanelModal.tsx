import React, { useState } from "react";
import { X, Bell, Users, CheckCircle2, XCircle, Volume2, VolumeX, Download, Copy, Check, Trash2, Shield, Calendar, Sparkles, MessageSquare, KeyRound, LogOut, HardDrive } from "lucide-react";
import { RSVPItem } from "../types";
import { soundManager } from "../utils/audio";

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: RSVPItem[];
  onMarkAllRead: () => void;
  onDeleteRSVP: (id: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isLiveConnected: boolean;
  onLogout?: () => void;
}

export function AdminPanelModal({
  isOpen,
  onClose,
  rsvps,
  onMarkAllRead,
  onDeleteRSVP,
  soundEnabled,
  onToggleSound,
  isLiveConnected,
  onLogout,
}: AdminPanelModalProps) {
  const [filter, setFilter] = useState<"all" | "hadir" | "tidak_hadir">("all");
  const [copied, setCopied] = useState(false);
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  if (!isOpen) return null;

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setPasswordMsg("Password tidak boleh kosong.");
      return;
    }
    localStorage.setItem("paskib_admin_password", newPassword.trim());
    setPasswordMsg("Kata sandi berhasil diperbarui!");
    setTimeout(() => {
      setPasswordMsg("");
      setShowPasswordSettings(false);
      setNewPassword("");
    }, 2000);
  };

  const handleResetPassword = () => {
    localStorage.setItem("paskib_admin_password", "admin123");
    setPasswordMsg("Kata sandi direset ke default (admin123)");
    setTimeout(() => {
      setPasswordMsg("");
      setShowPasswordSettings(false);
    }, 2000);
  };

  const hadirList = rsvps.filter((r) => r.attendance === "hadir");
  const tidakHadirList = rsvps.filter((r) => r.attendance === "tidak_hadir");
  const unreadCount = rsvps.filter((r) => !r.isReadByAdmin).length;

  const filteredRSVPs = rsvps.filter((r) => {
    if (filter === "hadir") return r.attendance === "hadir";
    if (filter === "tidak_hadir") return r.attendance === "tidak_hadir";
    return true;
  });

  // Group by Angkatan
  const angkatanCounts = hadirList.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.angkatan] = (acc[curr.angkatan] || 0) + 1;
    return acc;
  }, {});

  // Copy WhatsApp summary
  const handleCopyWhatsAppSummary = () => {
    let text = `*REKAPITULASI KEHADIRAN DIKLAT PASGRADA*\n`;
    text += `Update: ${new Date().toLocaleString("id-ID")}\n`;
    text += `Total Siap Hadir: ${hadirList.length} orang\n\n`;
    text += `*Daftar Tamu & Purna Siap Hadir:*\n`;

    if (hadirList.length === 0) {
      text += `(Belum ada konfirmasi masuk)\n`;
    } else {
      hadirList.forEach((item, idx) => {
        text += `${idx + 1}. *Kak ${item.name}* - ${item.angkatan} (Tiket: ${item.ticketCode})\n`;
        if (item.notes) {
          text += `   _Catatan: "${item.notes}"_\n`;
        }
      });
    }

    text += `\n*Rincian Per Angkatan:*\n`;
    Object.entries(angkatanCounts).forEach(([angkatan, count]) => {
      text += `• ${angkatan}: ${count} orang\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID Tiket", "Nama Lengkap", "Angkatan", "Kehadiran", "Pesan/Catatan", "Waktu Konfirmasi"];
    const rows = rsvps.map((r) => [
      `"${r.ticketCode}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.angkatan.replace(/"/g, '""')}"`,
      `"${r.attendance === "hadir" ? "Siap Hadir" : "Tidak Hadir"}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString("id-ID")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap-kehadiran-diklat-pasgrada-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestChime = () => {
    soundManager.playAdminNotification();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/80 border border-red-800 text-red-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide">
                  Panel Notifikasi Admin Panitia
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isLiveConnected
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
                  {isLiveConnected ? "Live Connected" : "Local Mode"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pencatatan &amp; notifikasi instan setiap kali ada tamu yang bersedia hadir di Diklat
              </p>
            </div>
          </div>

          <button
            id="btn-close-admin-panel"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="p-4 bg-slate-950/40 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Siap Hadir
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {hadirList.length}
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500/40" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Tidak Hadir
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-slate-400 font-mono">
                {tidakHadirList.length}
              </span>
              <XCircle className="w-5 h-5 text-slate-600" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Notif Baru
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {unreadCount}
              </span>
              <Bell className="w-5 h-5 text-amber-500/40" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Suara Notifikasi
            </span>
            <div className="flex items-center justify-between mt-1">
              <button
                type="button"
                onClick={onToggleSound}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition ${
                  soundEnabled
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundEnabled ? "Aktif" : "Mati"}</span>
              </button>
              <button
                type="button"
                onClick={handleTestChime}
                className="text-[10px] text-amber-400 hover:underline"
                title="Coba bunyi lonceng"
              >
                Tes Bunyi
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-900">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filter === "all"
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Semua ({rsvps.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("hadir")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filter === "hadir"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Siap Hadir ({hadirList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("tidak_hadir")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filter === "tidak_hadir"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Tidak Hadir ({tidakHadirList.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition"
              >
                Tandai Semua Dibaca
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyWhatsAppSummary}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin ke WA"}</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Breakdown by Angkatan Summary Chips */}
        {Object.keys(angkatanCounts).length > 0 && (
          <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0">
              Per Angkatan:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {Object.entries(angkatanCounts).map(([angkatan, count]) => (
                <span
                  key={angkatan}
                  className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] whitespace-nowrap font-medium"
                >
                  <strong className="text-amber-400">{angkatan}:</strong> {count}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Attendees List Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredRSVPs.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Belum ada konfirmasi yang tercatat.</p>
              <p className="text-xs text-slate-600 mt-1">
                Data akan otomatis muncul di sini begitu ada tamu yang mengisi konfirmasi.
              </p>
            </div>
          ) : (
            filteredRSVPs.map((item) => (
              <div
                key={item.id}
                className={`relative p-4 rounded-xl border transition-all ${
                  item.attendance === "hadir"
                    ? item.isReadByAdmin
                      ? "bg-slate-900/90 border-slate-800"
                      : "bg-emerald-950/20 border-emerald-600/40 shadow-sm"
                    : "bg-slate-900/50 border-slate-800/60 opacity-80"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        item.attendance === "hadir"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {item.attendance === "hadir" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm sm:text-base">
                          Kak {item.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-[11px] font-semibold">
                          {item.angkatan}
                        </span>
                        {!item.isReadByAdmin && (
                          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                            BARU
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="font-mono text-slate-300">{item.ticketCode}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>

                      {item.notes && (
                        <p className="mt-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 italic">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        item.attendance === "hadir"
                          ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {item.attendance === "hadir" ? "Siap Hadir" : "Tidak Hadir"}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteRSVP(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                      title="Hapus data uji coba"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Security & Storage Bar */}
        <div className="p-3 bg-slate-950/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>Penyimpanan Lokal Aktif (Netlify &amp; Vercel Ready)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPasswordSettings(!showPasswordSettings)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>{showPasswordSettings ? "Tutup Sandi" : "Ubah Password"}</span>
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-800/60 text-[11px] font-bold transition"
              >
                <LogOut className="w-3 h-3" />
                <span>Kunci / Keluar Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Change Password Inline Drawer */}
        {showPasswordSettings && (
          <div className="p-4 bg-slate-900 border-t border-amber-500/30 text-xs animate-in slide-in-from-bottom-2">
            <form onSubmit={handleUpdatePassword} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password admin baru (cth: pasgrada2026)"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition"
              >
                Simpan Password
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                Reset ke admin123
              </button>
            </form>
            {passwordMsg && (
              <p className="mt-2 text-[11px] text-emerald-400 font-semibold">{passwordMsg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
