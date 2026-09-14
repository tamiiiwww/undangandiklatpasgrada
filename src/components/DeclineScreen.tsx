import React, { useState } from "react";
import { Heart, ArrowLeft, Send, Sparkles } from "lucide-react";
import { PaskibraEmblem } from "./PaskibraEmblem";

interface DeclineScreenProps {
  onBackToHome: () => void;
  customLogoUrl?: string;
}

export function DeclineScreen({ onBackToHome, customLogoUrl }: DeclineScreenProps) {
  const [senderName, setSenderName] = useState("");
  const [wishes, setWishes] = useState("");
  const [sentWishes, setSentWishes] = useState(false);

  const handleSendGreeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) return;

    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: senderName.trim(),
          angkatan: "Purna / Tamu",
          attendance: "tidak_hadir",
          notes: wishes.trim() || undefined,
        }),
      });
      setSentWishes(true);
    } catch {
      setSentWishes(true);
    }
  };

  return (
    <div className="w-full min-h-[80vh] py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Card with subtle red and warm gray styling */}
        <div className="rounded-3xl p-0.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl">
          <div className="rounded-[23px] bg-slate-950 p-6 sm:p-10 text-center border border-slate-800">
            <PaskibraEmblem size={70} className="mx-auto mb-4" customLogoUrl={customLogoUrl} />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium mb-4">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20" />
              Salam Hormat PASGRADA
            </div>

            {/* The exact phrase requested by the user */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-4">
              &ldquo;Terima kasih atas perhatiannya, semoga bisa hadir di acara selanjutnya.&rdquo;
            </h2>

            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
              Kami segenap panitia dan seluruh adik-adik peserta Diklat PASGRADA sangat memahami kesibukan Kakak. Doa dan dukungan moral dari Kakak senantiasa menjadi berkah bagi kelancaran kegiatan ini.
            </p>

            {/* Optional quick greeting/wishes from senior */}
            {!sentWishes ? (
              <form
                onSubmit={handleSendGreeting}
                className="my-6 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-left"
              >
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  Titip Pesan atau Doa untuk Adik-adik Diklat:
                </span>
                <input
                  type="text"
                  placeholder="Nama Kakak (contoh: Kak Fani)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-red-500"
                />
                <textarea
                  rows={2}
                  placeholder="Pesan / Doa restu..."
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 mb-2.5 focus:outline-none focus:border-red-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={!senderName.trim()}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirimkan Pesan Doa Restu</span>
                </button>
              </form>
            ) : (
              <div className="my-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Pesan dan doa restu Kakak telah kami teruskan ke panitia &amp; adik-adik!</span>
              </div>
            )}

            {/* Return or change decision */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-return-home-from-decline"
                type="button"
                onClick={onBackToHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Utama</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
