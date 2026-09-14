import { useEffect, useRef } from "react";
import { Camera, CheckCircle2, Share2, ArrowLeft, Calendar, MapPin, Award, Clock, QrCode, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { RSVPItem, EventDetails } from "../types";
import { PaskibraEmblem } from "./PaskibraEmblem";
import { soundManager } from "../utils/audio";

interface PassCardTicketProps {
  rsvp: RSVPItem;
  event: EventDetails;
  onBackToHome: () => void;
}

export function PassCardTicket({ rsvp, event, onBackToHome }: PassCardTicketProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sound & celebratory confetti
    soundManager.playTicketCelebration();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#dc2626", "#ffffff", "#fbbf24", "#16a34a"],
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrintOrScreenshot = () => {
    window.print();
  };

  const generateWhatsAppMessage = () => {
    const text = encodeURIComponent(
      `*KONFIRMASI KEHADIRAN DIKLAT PASGRADA*\n\n` +
      `Siap Kak Panitia! Saya telah mengonfirmasi kehadiran untuk kegiatan Diklat PASGRADA:\n\n` +
      `👤 *Nama:* Kak ${rsvp.name}\n` +
      `🎖️ *Angkatan:* ${rsvp.angkatan}\n` +
      `🎫 *Kode Undangan:* ${rsvp.ticketCode}\n` +
      `📅 *Acara:* ${event.title}\n` +
      `📍 *Lokasi:* ${event.location}\n\n` +
      `Sampai jumpa di lokasi acara! Salam PASGRADA!`
    );
    const phone = (event.adminWhatsApp || "6285648149206").replace(/\D/g, "") || "6285648149206";
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, "_blank");
  };

  return (
    <div className="w-full min-h-[90vh] py-8 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl">
        {/* Navigation back */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button
            id="btn-back-home-from-ticket"
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ke Halaman Utama</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terkonfirmasi via WhatsApp</span>
          </div>
        </div>

        {/* SCREENSHOT INSTRUCTION NOTICE */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-red-500/20 border-2 border-amber-500/60 text-amber-200 text-center shadow-lg print:hidden animate-pulse">
          <div className="flex items-center justify-center gap-2 font-black text-sm sm:text-base text-amber-300 uppercase tracking-wide">
            <Camera className="w-5 h-5 text-amber-400" />
            <span>Silakan Screenshot (SS) Kartu Ini Sekarang!</span>
          </div>
          <p className="text-xs text-amber-100/90 mt-1 max-w-md mx-auto">
            Simpan gambar screenshot ini di galeri ponsel Kakak dan tunjukkan kepada panitia registrasi di gerbang/meja pendaftaran acara.
          </p>
        </div>

        {/* E-UNDANGAN PASS TICKET (TARGET FOR SCREENSHOT & PRINT) */}
        <div
          ref={cardRef}
          id="invitation-pass-card"
          className="relative rounded-3xl p-1 bg-gradient-to-b from-amber-400 via-red-600 to-amber-600 shadow-2xl overflow-hidden"
        >
          <div className="relative rounded-[22px] bg-slate-950 p-6 sm:p-8 text-white overflow-hidden border border-amber-500/30">
            {/* Background watermarks & textures */}
            <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
              <PaskibraEmblem size={260} customLogoUrl={event.customLogoUrl} />
            </div>

            {/* Red & White Ribbon top */}
            <div className="absolute top-0 left-0 right-0 h-2 grid grid-cols-2">
              <div className="bg-red-600" />
              <div className="bg-white" />
            </div>

            {/* Pass Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-5 pt-2">
              <div className="flex items-center gap-3">
                <PaskibraEmblem size={54} customLogoUrl={event.customLogoUrl} />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider font-serif">
                    KARTU UNDANGAN RESMI
                  </h3>
                  <span className="text-[11px] text-red-400 font-medium block">
                    {event.title || "Pendidikan & Pelatihan (Diklat)"}
                  </span>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex flex-col items-end">
                <div className="px-2.5 py-1 rounded-md bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  VIP PASS
                </div>
                <span className="text-[9px] text-slate-400 mt-1 font-mono">
                  {rsvp.ticketCode}
                </span>
              </div>
            </div>

            {/* Central Guest Identity Box */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-amber-500/40 text-center my-4 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-widest block mb-1">
                Tamu Undangan Kehormatan
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase font-serif drop-shadow">
                Kak {rsvp.name}
              </h2>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{rsvp.angkatan}</span>
              </div>

              {rsvp.notes && (
                <p className="mt-3 text-xs text-slate-300 italic border-t border-slate-800/80 pt-2 px-2">
                  &ldquo;{rsvp.notes}&rdquo;
                </p>
              )}
            </div>

            {/* Event Details compact list */}
            <div className="grid grid-cols-2 gap-3 text-xs my-4 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tanggal</span>
                  <span className="font-bold text-slate-200">{event.date}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Waktu</span>
                  <span className="font-bold text-slate-200">{event.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 col-span-2 sm:col-span-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tempat Acara</span>
                  <span className="font-bold text-slate-200">{event.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 col-span-2 sm:col-span-1">
                <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pakaian</span>
                  <span className="font-bold text-slate-200">{event.dresscode}</span>
                </div>
              </div>
            </div>

            {/* Ticket Footer with simulated Barcode & QR code */}
            <div className="pt-4 border-t border-dashed border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Barcode representation */}
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-end gap-[2px] h-9 mb-1">
                  {[28, 36, 20, 36, 16, 36, 28, 20, 36, 16, 28, 36, 20, 36, 28, 16, 36, 24, 36, 20].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className={`w-[3px] ${i % 3 === 0 ? "bg-amber-400" : "bg-slate-200"}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400">
                  {rsvp.ticketCode}
                </span>
              </div>

              {/* Status and instruction */}
              <div className="text-center sm:text-right">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>TERKONFIRMASI HADIR</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Tunjukkan kartu ini pada panitia registrasi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons for Screenshot / Share / WhatsApp */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
          <button
            id="btn-print-screenshot"
            type="button"
            onClick={handlePrintOrScreenshot}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition shadow-md"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Screenshot / Cetak Kartu</span>
          </button>

          <button
            id="btn-whatsapp-confirm"
            type="button"
            onClick={generateWhatsAppMessage}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition shadow-md"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Kirim Notif WhatsApp ke Panitia</span>
          </button>
        </div>
      </div>
    </div>
  );
}
