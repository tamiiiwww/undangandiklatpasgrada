import { Bell, Settings2, LogOut, ShieldAlert } from "lucide-react";
import { PaskibraEmblem } from "./PaskibraEmblem";

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenEditEvent: () => void;
  unreadCount: number;
  isLiveConnected: boolean;
  customLogoUrl?: string;
  isAdminMode?: boolean;
  onExitAdmin?: () => void;
}

export function Navbar({
  onOpenAdmin,
  onOpenEditEvent,
  unreadCount,
  isLiveConnected,
  customLogoUrl,
  isAdminMode = false,
  onExitAdmin,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800">
      {/* Red and White Indonesian National Ribbon */}
      <div className="h-1.5 w-full grid grid-cols-2">
        <div className="bg-red-600" />
        <div className="bg-white" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <PaskibraEmblem size={44} customLogoUrl={customLogoUrl} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-slate-100 uppercase font-serif">
                PASGRADA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/60">
                Resmi
              </span>
              {isAdminMode && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  Mode Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Pendidikan &amp; Pelatihan (Diklat) PASGRADA
            </p>
          </div>
        </div>

        {/* Action Controls - Strictly restricted to Admin Mode */}
        {isAdminMode ? (
          <div className="flex items-center gap-2 sm:gap-3 animate-in fade-in duration-200">
            {/* Edit Event Details / Poster for Organizer */}
            <button
              id="btn-edit-event-details"
              onClick={onOpenEditEvent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition shadow-sm"
              title="Ubah info tanggal, tempat, atau ganti poster acara"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Atur Info &amp; Poster</span>
            </button>

            {/* Admin Notification & Management Button */}
            <button
              id="btn-open-admin-panel"
              onClick={onOpenAdmin}
              className="relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white border border-red-500/30 transition shadow-md group"
            >
              <div className="relative">
                <Bell className="w-4 h-4 transition-transform group-hover:scale-110" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[10px] font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Panel Admin</span>

              {/* Live SSE Pulse indicator */}
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveConnected ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                }`}
                title={isLiveConnected ? "Live Connected" : "Connecting"}
              />
            </button>

            {/* Exit Admin Mode to test public guest view */}
            {onExitAdmin && (
              <button
                type="button"
                onClick={onExitAdmin}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                title="Keluar dari Mode Admin (Kembali ke tampilan tamu publik)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* Public Guest View: Clean and dignified without any editing buttons */
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              Undangan Resmi Diklat
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
