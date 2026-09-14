import { useState, useEffect, useRef, useCallback } from "react";
import { Lock } from "lucide-react";
import { AppView, RSVPItem, EventDetails } from "./types";
import { DEFAULT_EVENT_DETAILS } from "./data/defaultEvent";
import { Navbar } from "./components/Navbar";
import { PosterSection } from "./components/PosterSection";
import { RSVPQuestionSection } from "./components/RSVPQuestionSection";
import { AttendanceFormView } from "./components/AttendanceFormView";
import { PassCardTicket } from "./components/PassCardTicket";
import { DeclineScreen } from "./components/DeclineScreen";
import { AdminPanelModal } from "./components/AdminPanelModal";
import { EditEventModal } from "./components/EditEventModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { LiveToastNotification } from "./components/LiveToastNotification";
import { soundManager } from "./utils/audio";
import { PaskibraEmblem } from "./components/PaskibraEmblem";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("home");

  // Load event details from localStorage, fallback to DEFAULT_EVENT_DETAILS
  const [event, setEvent] = useState<EventDetails>(() => {
    try {
      const saved = localStorage.getItem("paskib_event_details");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.title === "PENDIDIKAN DAN PELATIHAN PASKIBRA" ||
          parsed.title === "PENDIDIKAN DAN PELATIHAN PASGRADA"
        ) {
          parsed.title = "PENDIDIKAN & PELATIHAN";
        }
        if (
          parsed.subTitle === "Pasukan Pengibar Bendera Pusaka" ||
          parsed.subTitle === "Pendidikan & Pelatihan (Diklat) Paskibra"
        ) {
          parsed.subTitle = "Calon Anggota & Pemantapan Purna PASGRADA";
        }
        if (typeof parsed.theme === "string" && parsed.theme.includes("Paskibra")) {
          parsed.theme = parsed.theme.replace(/Paskibra/g, "PASGRADA").replace(/PASKIBRA/g, "PASGRADA");
        }
        if (typeof parsed.notes === "string" && parsed.notes.includes("Paskibra")) {
          parsed.notes = parsed.notes.replace(/Paskibra/g, "PASGRADA").replace(/PASKIBRA/g, "PASGRADA");
        }
        return { ...DEFAULT_EVENT_DETAILS, ...parsed };
      }
      return DEFAULT_EVENT_DETAILS;
    } catch {
      return DEFAULT_EVENT_DETAILS;
    }
  });

  // Admin login modal visibility
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Check persistent admin authentication in localStorage
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("paskib_admin_auth") === "true";
    } catch {
      return false;
    }
  });

  // Detect URL parameter (e.g. ?mode=admin or ?secret=... or #admin)
  // If visited with ?mode=admin and not yet logged in, immediately open the Admin Password modal!
  useEffect(() => {
    const checkUrlForAdmin = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const hash = window.location.hash.toLowerCase();

        // If user explicitly asks to logout
        if (params.get("mode") === "public" || params.get("logout") === "admin") {
          localStorage.removeItem("paskib_admin_auth");
          sessionStorage.removeItem("paskib_admin_session");
          setIsAdminMode(false);
          setIsLoginModalOpen(false);
          return;
        }

        const mode = params.get("mode")?.toLowerCase();
        const secret = params.get("secret")?.toLowerCase();
        const adminParam = params.get("admin")?.toLowerCase();

        const requestedAdmin =
          mode === "admin" ||
          secret === "pasgrada123" ||
          secret === "admin" ||
          adminParam === "true" ||
          adminParam === "1" ||
          hash === "#admin" ||
          hash === "#mode=admin";

        if (requestedAdmin) {
          const isAlreadyAuth = localStorage.getItem("paskib_admin_auth") === "true";
          if (isAlreadyAuth) {
            setIsAdminMode(true);
          } else {
            // Prompt says: "Jika pengguna membuka link dengan URL parameter ?mode=admin, buka langsung pop-up input password admin tersebut."
            setIsLoginModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Error inspecting admin url parameter:", err);
      }
    };

    checkUrlForAdmin();
    window.addEventListener("popstate", checkUrlForAdmin);
    window.addEventListener("hashchange", checkUrlForAdmin);
    return () => {
      window.removeEventListener("popstate", checkUrlForAdmin);
      window.removeEventListener("hashchange", checkUrlForAdmin);
    };
  }, []);

  const handleExitAdminMode = () => {
    try {
      localStorage.removeItem("paskib_admin_auth");
      sessionStorage.removeItem("paskib_admin_session");
    } catch {}
    setIsAdminMode(false);
    setIsAdminOpen(false);
    setIsEditEventOpen(false);
    setIsLoginModalOpen(false);

    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("mode");
      url.searchParams.delete("secret");
      url.searchParams.delete("admin");
      url.searchParams.delete("logout");
      url.hash = "";
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    } catch {
      // ignore
    }
  };

  // Load RSVPs from localStorage (Vercel & Netlify standalone support)
  const [rsvps, setRsvps] = useState<RSVPItem[]>(() => {
    try {
      const saved = localStorage.getItem("paskib_rsvps");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [currentTicket, setCurrentTicket] = useState<RSVPItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [liveToast, setLiveToast] = useState<{ message: string; rsvp?: RSVPItem } | null>(null);

  const toastTimerRef = useRef<number | null>(null);

  // Sync across tabs via window storage event (great for standalone multi-tab testing)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "paskib_rsvps" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setRsvps(updated);
          }
        } catch {}
      }
      if (e.key === "paskib_event_details" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setEvent((prev) => ({ ...prev, ...updated }));
        } catch {}
      }
      if (e.key === "paskib_admin_auth") {
        setIsAdminMode(e.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch RSVPs from backend API if running with Node server; gracefully fall back to localStorage
  const fetchRSVPs = useCallback(async () => {
    try {
      const res = await fetch("/api/rsvps");
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setRsvps(json.data);
        try {
          localStorage.setItem("paskib_rsvps", JSON.stringify(json.data));
        } catch {}
      }
    } catch {
      // Standalone static host (Netlify / Vercel): safely uses localStorage state
    }
  }, []);

  useEffect(() => {
    fetchRSVPs();
  }, [fetchRSVPs]);

  // Connect to SSE for real-time admin notifications when server is present
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/admin/events");

      eventSource.onopen = () => {
        setIsLiveConnected(true);
      };

      eventSource.addEventListener("new_rsvp", (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          const newRsvp = payload.rsvp as RSVPItem;

          // Sound alert only for authenticated Admin
          if (soundEnabled && isAdminMode) {
            soundManager.playAdminNotification();
          }

          // Trigger live toast only if in Admin mode
          if (isAdminMode) {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            setLiveToast({
              message: payload.message || `Kak ${newRsvp.name} (${newRsvp.angkatan}) menyatakan SIAP HADIR!`,
              rsvp: newRsvp,
            });
            toastTimerRef.current = window.setTimeout(() => {
              setLiveToast(null);
            }, 8000);
          }

          // Update local state list & localStorage
          setRsvps((prev) => {
            const exists = prev.some((item) => item.id === newRsvp.id);
            if (exists) return prev;
            const updated = [newRsvp, ...prev];
            try {
              localStorage.setItem("paskib_rsvps", JSON.stringify(updated));
            } catch {}
            return updated;
          });
        } catch (err) {
          console.error("Error processing SSE message:", err);
        }
      });

      eventSource.onerror = () => {
        setIsLiveConnected(false);
      };
    } catch {
      setIsLiveConnected(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [soundEnabled, isAdminMode]);

  // Save event changes to state and persist in localStorage
  const handleSaveEvent = (updated: EventDetails) => {
    setEvent(updated);
    try {
      localStorage.setItem("paskib_event_details", JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving event details to localStorage:", err);
    }
  };

  // Mark all RSVPs read in state and localStorage
  const handleMarkAllRead = async () => {
    setRsvps((prev) => {
      const updated = prev.map((r) => ({ ...r, isReadByAdmin: true }));
      try {
        localStorage.setItem("paskib_rsvps", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await fetch("/api/rsvps/mark-read", { method: "POST" });
    } catch {
      // ignore
    }
  };

  // Delete RSVP (Admin) in state and localStorage
  const handleDeleteRSVP = async (id: string) => {
    setRsvps((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem("paskib_rsvps", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      await fetch(`/api/rsvps/${id}`, { method: "DELETE" });
    } catch {
      // ignore
    }
  };

  // Smooth scroll down to RSVP section
  const handleScrollToRSVP = () => {
    const el = document.getElementById("rsvp-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // User clicked "YA" -> Go to Form
  const handleSelectYes = () => {
    setCurrentView("form_hadir");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // User clicked "TIDAK" -> Go to Decline Screen
  const handleSelectNo = () => {
    setCurrentView("tidak_hadir");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Attendance Form Submitted -> Transition to Ticket Pass Card and persist locally
  const handleSubmitSuccess = (rsvp: RSVPItem) => {
    setCurrentTicket(rsvp);
    setCurrentView("ticket_card");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Play notification chime for admin if sound enabled
    if (soundEnabled && isAdminMode) {
      soundManager.playAdminNotification();
    }

    // Persist new RSVP to local storage
    setRsvps((prev) => {
      const exists = prev.some((item) => item.id === rsvp.id);
      const updated = exists ? prev : [rsvp, ...prev];
      try {
        localStorage.setItem("paskib_rsvps", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Also attempt remote refresh in case backend is active
    fetchRSVPs();

    // Trigger local notification banner for admin
    if (isAdminMode) {
      setLiveToast({
        message: `Konfirmasi berhasil! Kartu Undangan atas nama Kak ${rsvp.name} (${rsvp.angkatan}) telah diterbitkan.`,
        rsvp,
      });
    }
  };

  const unreadCount = rsvps.filter((r) => !r.isReadByAdmin).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-600 selection:text-white font-sans">
      {/* Top Secret Admin Bar (Visible when unlocked via password login or ?mode=admin) */}
      {isAdminMode && (
        <div className="bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white text-xs px-4 py-2 border-b border-amber-400/40 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
              <span className="font-bold">Mode Admin Terbuka:</span>
              <span className="opacity-95 hidden sm:inline">
                Akses kelola poster, info acara, dan data kehadiran aktif (Tersimpan Lokal).
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditEventOpen(true)}
                className="px-2.5 py-1 bg-black/25 hover:bg-black/40 rounded font-semibold text-[11px] transition"
              >
                Atur Info &amp; Poster
              </button>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded font-semibold text-[11px] transition"
              >
                Panel Admin ({unreadCount})
              </button>
              <button
                type="button"
                onClick={handleExitAdminMode}
                className="px-2.5 py-1 bg-black/40 hover:bg-black/60 rounded font-bold text-[11px] text-amber-200 transition"
                title="Sembunyikan tombol admin dan kembali ke tampilan publik"
              >
                Keluar / Kunci Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenEditEvent={() => setIsEditEventOpen(true)}
        unreadCount={unreadCount}
        isLiveConnected={isLiveConnected}
        customLogoUrl={event.customLogoUrl}
        isAdminMode={isAdminMode}
        onExitAdmin={handleExitAdminMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === "home" && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-300">
            {/* Poster / Undangan Section */}
            <PosterSection
              event={event}
              onScrollToRSVP={handleScrollToRSVP}
              onOpenEditEvent={() => setIsEditEventOpen(true)}
              isAdminMode={isAdminMode}
            />

            {/* "Apakah Kakak berkenan untuk hadir??" Section */}
            <RSVPQuestionSection
              onSelectYes={handleSelectYes}
              onSelectNo={handleSelectNo}
              question={event.rsvpQuestion}
              description={event.rsvpDescription}
            />
          </div>
        )}

        {currentView === "form_hadir" && (
          <AttendanceFormView
            onBack={() => setCurrentView("home")}
            onSubmitSuccess={handleSubmitSuccess}
            customLogoUrl={event.customLogoUrl}
          />
        )}

        {currentView === "ticket_card" && currentTicket && (
          <PassCardTicket
            rsvp={currentTicket}
            event={event}
            onBackToHome={() => setCurrentView("home")}
          />
        )}

        {currentView === "tidak_hadir" && (
          <DeclineScreen
            onBackToHome={() => setCurrentView("home")}
            customLogoUrl={event.customLogoUrl}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-4 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <PaskibraEmblem size={32} customLogoUrl={event.customLogoUrl} />
            <span className="font-bold text-slate-300 tracking-wider uppercase font-serif">
              PASGRADA
            </span>
          </div>
          <p className="max-w-md text-slate-400">
            Pendidikan &amp; Pelatihan (Diklat) PASGRADA. Bersatu dalam kedisiplinan, berkarya untuk kejayaan Indonesia.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1 text-[11px] text-slate-400">
            <span>© {new Date().getFullYear()} Panitia Pelaksana Diklat PASGRADA</span>
            <span>•</span>
            <button
              id="btn-footer-admin-login"
              type="button"
              onClick={() => {
                if (isAdminMode) {
                  setIsAdminOpen(true);
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition"
              title="Akses khusus panitia pelaksana (Login Password: admin123)"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{isAdminMode ? "Panel Admin Panitia" : "Login Admin Panitia"}</span>
            </button>
            {isAdminMode && (
              <>
                <span>•</span>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-amber-400 hover:underline font-medium"
                >
                  Notifikasi Panitia ({rsvps.filter((r) => r.attendance === "hadir").length} Tamu Siap Hadir)
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Admin Login Modal (Default Password: admin123) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminMode(true);
          setIsAdminOpen(true);
        }}
        customLogoUrl={event.customLogoUrl}
      />

      {/* Modals and Overlays - Strictly for Admin */}
      {isAdminMode && (
        <>
          <AdminPanelModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            rsvps={rsvps}
            onMarkAllRead={handleMarkAllRead}
            onDeleteRSVP={handleDeleteRSVP}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            isLiveConnected={isLiveConnected}
            onLogout={handleExitAdminMode}
          />

          <EditEventModal
            isOpen={isEditEventOpen}
            onClose={() => setIsEditEventOpen(false)}
            event={event}
            onSave={handleSaveEvent}
          />

          {/* Real-time Toast notification */}
          <LiveToastNotification
            notification={liveToast}
            onDismiss={() => setLiveToast(null)}
            onOpenAdmin={() => {
              setLiveToast(null);
              setIsAdminOpen(true);
            }}
          />
        </>
      )}
    </div>
  );
}
