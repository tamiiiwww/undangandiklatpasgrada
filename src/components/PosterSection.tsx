import { Calendar, Clock, MapPin, Award, ChevronDown, Image as ImageIcon } from "lucide-react";
import { EventDetails } from "../types";
import { PaskibraEmblem } from "./PaskibraEmblem";

interface PosterSectionProps {
  event: EventDetails;
  onScrollToRSVP: () => void;
  onOpenEditEvent: () => void;
  isAdminMode?: boolean;
}

export function PosterSection({
  event,
  onScrollToRSVP,
  onOpenEditEvent,
  isAdminMode = false,
}: PosterSectionProps) {
  return (
    <section className="relative w-full pt-4 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-red-600/15 via-red-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* POSTER / UNDANGAN CARD */}
        <div className="relative rounded-2xl p-1 bg-gradient-to-b from-amber-500/40 via-red-700/30 to-slate-800 shadow-2xl">
          <div className="rounded-[15px] bg-slate-900 border border-slate-700/80 overflow-hidden">
            {/* If custom poster image was uploaded */}
            {event.posterImageUrl ? (
              <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={event.posterImageUrl}
                  alt={event.title || "Poster Resmi Acara"}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              /* Built-in Digital Poster Design (Ceremonial & Dignified PASGRADA Style) */
              <div className="relative p-6 sm:p-10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex flex-col items-center text-center">
                {/* Decorative Indonesian Corner Arcs */}
                <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-500/60 rounded-tl-lg pointer-events-none" />
                <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-500/60 rounded-tr-lg pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-500/60 rounded-bl-lg pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-500/60 rounded-br-lg pointer-events-none" />

                {/* Indonesian Flag Ribbon Header */}
                <div className="w-24 h-1.5 grid grid-cols-2 rounded-full overflow-hidden mb-6 shadow-sm">
                  <div className="bg-red-600" />
                  <div className="bg-white" />
                </div>

                {/* Emblem */}
                <PaskibraEmblem size={96} className="mb-4" customLogoUrl={event.customLogoUrl} />

                {event.title && (
                  <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-wide text-white uppercase font-serif">
                    {event.title}
                  </h1>
                )}
                {event.subTitle && (
                  <p className="text-sm sm:text-base font-semibold text-red-400 tracking-wider uppercase mt-1">
                    {event.subTitle}
                  </p>
                )}

                {/* Elegant Quote / Theme */}
                <div className="my-6 max-w-xl px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 italic">
                  {event.theme}
                </div>

                {/* Event Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left my-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <Calendar className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Hari &amp; Tanggal
                      </span>
                      <span className="text-sm font-bold text-white block">
                        {event.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Waktu Pelaksanaan
                      </span>
                      <span className="text-sm font-bold text-white block">
                        {event.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Tempat / Lokasi
                      </span>
                      <span className="text-sm font-bold text-white block">
                        {event.location}
                      </span>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {event.locationDetails}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Pakaian / Dresscode
                      </span>
                      <span className="text-sm font-bold text-white block">
                        {event.dresscode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Friendly Note */}
                <p className="text-xs text-slate-400 max-w-lg mt-4 leading-relaxed">
                  {event.notes}
                </p>

                {/* Customize poster prompt - Strictly for Admin */}
                {isAdminMode && (
                  <button
                    type="button"
                    onClick={onOpenEditEvent}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 font-medium transition"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Punya desain poster gambar sendiri? Klik di sini untuk upload / ubah info
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Call To Action scroll down indicator */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <button
            id="btn-scroll-to-rsvp"
            onClick={onScrollToRSVP}
            className="group flex flex-col items-center gap-2 px-6 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition shadow-lg"
          >
            <span className="text-xs sm:text-sm font-semibold tracking-wide group-hover:text-red-400 transition">
              Gulir ke Bawah Untuk Konfirmasi Kehadiran
            </span>
            <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
