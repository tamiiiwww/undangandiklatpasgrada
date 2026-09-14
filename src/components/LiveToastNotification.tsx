import { Bell, CheckCircle2, X } from "lucide-react";
import { RSVPItem } from "../types";

interface LiveToastNotificationProps {
  notification: {
    message: string;
    rsvp?: RSVPItem;
  } | null;
  onDismiss: () => void;
  onOpenAdmin: () => void;
}

export function LiveToastNotification({
  notification,
  onDismiss,
  onOpenAdmin,
}: LiveToastNotificationProps) {
  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900 border-2 border-amber-500/70 shadow-2xl text-white animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-red-950/80 border border-red-800 text-amber-400 shrink-0">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-amber-400 uppercase">
              Notifikasi Kehadiran Baru
            </span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
            {notification.message}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[11px] px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition"
            >
              Buka Panel Admin
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="text-[11px] px-2 py-1 text-slate-400 hover:text-white transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
