export interface RSVPItem {
  id: string;
  name: string;
  angkatan: string;
  attendance: "hadir" | "tidak_hadir";
  ticketCode: string;
  notes?: string;
  createdAt: string;
  isReadByAdmin: boolean;
}

export interface EventDetails {
  title: string;
  subTitle: string;
  theme: string;
  date: string;
  time: string;
  location: string;
  locationDetails: string;
  dresscode: string;
  contactPerson: string;
  adminWhatsApp: string;
  customLogoUrl?: string;
  posterImageUrl?: string;
  notes: string;
  rsvpQuestion?: string;
  rsvpDescription?: string;
}

export type AppView = "home" | "form_hadir" | "ticket_card" | "tidak_hadir";
