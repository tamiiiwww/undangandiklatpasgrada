import React, { useState } from "react";
import { X, Save, Upload, Sparkles, AlertCircle, Image as ImageIcon, RotateCcw } from "lucide-react";
import { EventDetails } from "../types";
import { PaskibraEmblem } from "./PaskibraEmblem";
import { compressImage } from "../utils/imageCompress";
import { DEFAULT_EVENT_DETAILS } from "../data/defaultEvent";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetails;
  onSave: (updated: EventDetails) => void;
}

export function EditEventModal({ isOpen, onClose, event, onSave }: EditEventModalProps) {
  const [formData, setFormData] = useState<EventDetails>({ ...event });
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file, 600, 0.85);
        setFormData((prev) => ({
          ...prev,
          customLogoUrl: compressed,
        }));
      } catch (err) {
        console.error("Error compressing logo:", err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file, 1200, 0.82);
        setFormData((prev) => ({
          ...prev,
          posterImageUrl: compressed,
        }));
      } catch (err) {
        console.error("Error compressing poster:", err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm("Kembalikan seluruh info dan poster ke data awal panitia?")) {
      setFormData({ ...DEFAULT_EVENT_DETAILS });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div>
            <h3 className="text-base font-extrabold text-white">
              Atur Deskripsi Acara &amp; Desain Poster
            </h3>
            <p className="text-xs text-slate-400">
              Sesuaikan rincian acara Diklat PASGRADA atau pasang gambar poster resmi panitia
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Logo / Emblem Management */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                Logo / Lambang PASGRADA
              </label>
              <span className="text-[11px] text-amber-400 font-medium">
                {formData.customLogoUrl ? "Logo Kustom Aktif" : "Lambang Bawaan Aktif"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1.5 shrink-0 shadow-inner">
                <PaskibraEmblem size={44} customLogoUrl={formData.customLogoUrl} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-700 hover:bg-red-600 text-white cursor-pointer transition shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah Logo Khusus</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.customLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, customLogoUrl: "" }))}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                    >
                      Gunakan Lambang Bawaan
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Logo tampil di seluruh bagian aplikasi (Navbar, Poster, Formulir, Kartu Undangan, dan Footer).
                </p>
              </div>
            </div>
          </div>

          {/* Upload Poster Image */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Gambar Poster Acara (Opsional)
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-700 file:text-white hover:file:bg-red-600 cursor-pointer"
              />
              {formData.posterImageUrl && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-emerald-400">✓ Gambar poster terpasang</span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, posterImageUrl: "" }))}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Hapus / Gunakan Desain Bawaan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Nama Acara
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Sub-judul
            </label>
            <input
              type="text"
              value={formData.subTitle}
              onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Tema Diklat
            </label>
            <textarea
              rows={2}
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Hari &amp; Tanggal
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Waktu Pelaksanaan
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Location & Detail Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Lokasi / Gedung
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Detail Alamat / Ruangan
              </label>
              <input
                type="text"
                value={formData.locationDetails || ""}
                onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                placeholder="Contoh: Kompleks Pendidikan Utama, Jl. Veteran No. 45"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Dresscode & Contact Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Pakaian / Dresscode
              </label>
              <input
                type="text"
                value={formData.dresscode}
                onChange={(e) => setFormData({ ...formData, dresscode: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Narahubung Panitia
              </label>
              <input
                type="text"
                value={formData.contactPerson || ""}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Contoh: Kak Arga & Kak Sintia"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Notes on Poster */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Catatan / Harapan Kehadiran di Bawah Poster
            </label>
            <textarea
              rows={2}
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          {/* RSVP Questions & Description Customization */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
              Pengaturan Teks Formulir Konfirmasi (RSVP)
            </span>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Teks Pertanyaan Konfirmasi
              </label>
              <input
                type="text"
                value={formData.rsvpQuestion || ""}
                onChange={(e) => setFormData({ ...formData, rsvpQuestion: e.target.value })}
                placeholder="Apakah Kakak berkenan untuk hadir??"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Deskripsi / Sambutan di Atas Tombol Ya/Tidak
              </label>
              <textarea
                rows={2}
                value={formData.rsvpDescription || ""}
                onChange={(e) => setFormData({ ...formData, rsvpDescription: e.target.value })}
                placeholder="Kehadiran Kakak adalah suatu kehormatan besar..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
          </div>

          {/* WhatsApp Admin for Notifications */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Nomor WhatsApp Admin Panitia (Format Internasional misal 62812xxxx)
            </label>
            <input
              type="text"
              value={formData.adminWhatsApp}
              onChange={(e) => setFormData({ ...formData, adminWhatsApp: e.target.value })}
              placeholder="Contoh: 6281234567890"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
              title="Reset semua isian formulir ke data awal panitia"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Awal</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isProcessingImage}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isProcessingImage ? "Mengolah Gambar..." : "Simpan Perubahan"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
