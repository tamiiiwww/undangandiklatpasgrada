import { CheckCircle2, XCircle, HeartHandshake, ShieldCheck } from "lucide-react";

interface RSVPQuestionSectionProps {
  onSelectYes: () => void;
  onSelectNo: () => void;
  question?: string;
  description?: string;
}

export function RSVPQuestionSection({
  onSelectYes,
  onSelectNo,
  question,
  description,
}: RSVPQuestionSectionProps) {
  const displayQuestion = question || "Apakah Kakak berkenan untuk hadir??";
  const displayDescription =
    description ||
    "Kehadiran Kakak Purna / Senior PASGRADA adalah suatu kehormatan besar dan menjadi motivasi berharga bagi adik-adik peserta Diklat.";

  return (
    <section id="rsvp-section" className="w-full py-12 px-4 sm:px-6 relative scroll-mt-20">
      <div className="max-w-2xl mx-auto">
        {/* Decorative Card with Gold & Red border */}
        <div className="relative rounded-2xl p-0.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 shadow-2xl">
          <div className="rounded-[15px] bg-slate-900/95 p-6 sm:p-10 border border-slate-800 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Konfirmasi Kehadiran Tamu Undangan
            </div>

            {/* The Explicit User Prompt Question */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-serif mb-3">
              {displayQuestion}
            </h2>

            <p className="text-sm text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
              {displayDescription}
            </p>

            {/* The Two Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* YA OPTION */}
              <button
                id="btn-rsvp-yes"
                type="button"
                onClick={onSelectYes}
                className="group relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-100 group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">Ya, Saya Siap Hadir</span>
              </button>

              {/* TIDAK OPTION */}
              <button
                id="btn-rsvp-no"
                type="button"
                onClick={onSelectNo}
                className="group relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white font-semibold text-base border border-slate-700 hover:border-slate-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <XCircle className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                <span className="tracking-wide">Tidak Bisa Hadir</span>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <HeartHandshake className="w-4 h-4 text-red-400" />
              <span>Salam hangat dan hormat dari seluruh panitia Diklat PASGRADA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
