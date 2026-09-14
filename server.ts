import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface RSVP {
  id: string;
  name: string;
  angkatan: string;
  attendance: "hadir" | "tidak_hadir";
  ticketCode: string;
  notes?: string;
  createdAt: string;
  isReadByAdmin: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rsvps.json");

function ensureDataFile(): RSVP[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    // Initial sample seed if needed, or empty array
    const initial: RSVP[] = [
      {
        id: "paskib-sample-1",
        name: "Rian Prasetyo",
        angkatan: "Angkatan 2020",
        attendance: "hadir",
        ticketCode: "DIKLAT-2020-8492",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        isReadByAdmin: true,
      },
      {
        id: "paskib-sample-2",
        name: "Nur Annisa Fitri",
        angkatan: "Angkatan 2022",
        attendance: "hadir",
        ticketCode: "DIKLAT-2022-3105",
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        isReadByAdmin: false,
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRSVPs(rsvps: RSVP[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(rsvps, null, 2), "utf-8");
}

let sseClients: Response[] = [];

function broadcastToAdmins(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      // client dropped
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Get all RSVPs
  app.get("/api/rsvps", (_req, res) => {
    const rsvps = ensureDataFile();
    res.json({
      success: true,
      data: rsvps.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      stats: {
        totalHadir: rsvps.filter((r) => r.attendance === "hadir").length,
        totalTidakHadir: rsvps.filter((r) => r.attendance === "tidak_hadir").length,
        unreadCount: rsvps.filter((r) => !r.isReadByAdmin).length,
      },
    });
  });

  // Submit RSVP
  app.post("/api/rsvp", (req: Request, res: Response) => {
    const { name, angkatan, attendance, notes } = req.body;

    if (!name || !angkatan) {
      return res.status(400).json({
        success: false,
        message: "Nama dan Angkatan wajib diisi.",
      });
    }

    const rsvps = ensureDataFile();
    const cleanAngkatan = String(angkatan).trim();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const angkatanCode = cleanAngkatan.replace(/\D/g, "") || "XX";
    const ticketCode = `DIKLAT-${angkatanCode}-${randomSuffix}`;

    const newRSVP: RSVP = {
      id: "rsvp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      name: String(name).trim(),
      angkatan: cleanAngkatan,
      attendance: attendance === "tidak_hadir" ? "tidak_hadir" : "hadir",
      ticketCode,
      notes: notes ? String(notes).trim() : undefined,
      createdAt: new Date().toISOString(),
      isReadByAdmin: false,
    };

    rsvps.unshift(newRSVP);
    saveRSVPs(rsvps);

    // Notify all admin SSE listeners instantly
    broadcastToAdmins("new_rsvp", {
      rsvp: newRSVP,
      message: `Konfirmasi baru: Kak ${newRSVP.name} (${newRSVP.angkatan}) menyatakan ${newRSVP.attendance === "hadir" ? "HADIR" : "TIDAK HADIR"}`,
      timestamp: newRSVP.createdAt,
    });

    return res.json({
      success: true,
      message: "Konfirmasi berhasil disimpan!",
      data: newRSVP,
    });
  });

  // Mark all or specific RSVP as read
  app.post("/api/rsvps/mark-read", (req: Request, res: Response) => {
    const { id } = req.body;
    const rsvps = ensureDataFile();
    if (id) {
      const target = rsvps.find((r) => r.id === id);
      if (target) target.isReadByAdmin = true;
    } else {
      rsvps.forEach((r) => {
        r.isReadByAdmin = true;
      });
    }
    saveRSVPs(rsvps);
    res.json({ success: true });
  });

  // Delete RSVP (Admin capability)
  app.delete("/api/rsvps/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    let rsvps = ensureDataFile();
    rsvps = rsvps.filter((r) => r.id !== id);
    saveRSVPs(rsvps);
    res.json({ success: true });
  });

  // SSE Stream for Admin Real-Time Notifications
  app.get("/api/admin/events", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    sseClients.push(res);

    // Send keep-alive every 20s
    const keepAlive = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 20000);

    req.on("close", () => {
      clearInterval(keepAlive);
      sseClients = sseClients.filter((client) => client !== res);
    });
  });

  // Serve public assets folder
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware for development vs static production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Diklat Paskibra running on http://localhost:${PORT}`);
  });
}

startServer();
