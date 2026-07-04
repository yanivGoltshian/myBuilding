// Domain model — maps 1:1 to the PostgreSQL schema (db/schema.ts).
// Prototype: served from an in-memory repo. Production: Neon Postgres on Vercel.

export type Role = "tenant" | "committee" | "manager" | "admin";

export interface ManagementCompany {
  id: string;
  name: string;
  logoText: string;
  brandColor: string;
  plan: "basic" | "pro";
  monthlyFee: number; // the small fixed SaaS fee the company pays us
  phone: string;
}

export interface Building {
  id: string;
  companyId: string;
  name: string;
  address: string;
  city: string;
  brandColor: string; // white-label accent per building
  logoText: string;
  roomBookingEnabled: boolean;
  bankName?: string;
  bankLast4?: string;
}

export interface Unit {
  id: string;
  buildingId: string;
  number: string;
  floor: number;
  ownerName: string;
  isRented: boolean;
  monthlyDues: number;
}

export interface Resident {
  id: string;
  unitId: string;
  buildingId: string;
  name: string;
  phone: string;
  role: Role;
  isOwner: boolean; // owner vs renter — drives the current/capital expense split
}

export type PaymentStatus = "paid" | "due" | "overdue";

export interface Payment {
  id: string;
  unitId: string;
  buildingId: string;
  period: string; // YYYY-MM
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  method?: string;
}

// current = שוטף (falls on residents incl. renters); capital = הוני (owners only)
export type ExpenseType = "current" | "capital";
export type FlowKind = "expense" | "income";

export interface Ledger {
  id: string;
  buildingId: string;
  date: string; // YYYY-MM-DD
  category: string;
  description: string;
  amount: number;
  kind: FlowKind;
  type: ExpenseType;
  vendor?: string;
  recurring?: boolean;
}

export type CallStatus = "open" | "in_progress" | "closed";

export interface ServiceCall {
  id: string;
  buildingId: string;
  unitId: string;
  residentName: string;
  subject: string;
  category: string;
  description: string;
  status: CallStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RoomBooking {
  id: string;
  buildingId: string;
  unitId: string;
  residentName: string;
  date: string; // YYYY-MM-DD
  time: string;
  subject: string;
}

export interface DocItem {
  id: string;
  buildingId: string;
  unitId?: string;
  name: string;
  kind: "bylaws" | "form" | "unit" | "general";
  date: string;
}

// ---- Community / engagement (the "want to open the app" hooks) ----

export type AnnouncementCategory =
  | "general"
  | "maintenance"
  | "urgent"
  | "event"
  | "finance";

export interface Announcement {
  id: string;
  buildingId: string;
  title: string;
  body: string;
  date: string;
  author: string;
  category: AnnouncementCategory;
  pinned: boolean;
  reactions: number;
  comments: number;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  buildingId: string;
  question: string;
  description?: string;
  options: PollOption[];
  closesAt: string;
  createdAt: string;
}

export type EventKind =
  | "maintenance"
  | "social"
  | "meeting"
  | "cleaning"
  | "delivery";

export interface BuildingEvent {
  id: string;
  buildingId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  kind: EventKind;
  description?: string;
}

export type MarketCategory =
  | "furniture"
  | "appliance"
  | "kids"
  | "free"
  | "other";

export interface MarketItem {
  id: string;
  buildingId: string;
  sellerName: string;
  unit: string;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  category: MarketCategory;
  date: string;
}

export interface Gate {
  id: string;
  buildingId: string;
  name: string;
  gatePhone: string;
  dialerPhone: string;
  isPrivate: boolean;
  color: string;
}

// ---- Residents' assembly minutes (אסיפת דיירים) ----
export type MeetingStatus = "scheduled" | "held";

export interface MeetingDecision {
  topic: string;
  outcome: string;
}

export interface Meeting {
  id: string;
  buildingId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  status: MeetingStatus;
  agenda: string[];
  attendance?: number; // households present
  quorum?: number; // households required
  summary?: string; // free-text protocol
  decisions: MeetingDecision[];
  pollId?: string; // linked digital vote
}

// ---- Configurable per-building info hub (rooms, codes, phones, WhatsApp) ----
export type ContactCategory =
  | "committee"
  | "management"
  | "emergency"
  | "service"
  | "other";

export interface BuildingContact {
  id: string;
  name: string;
  role?: string; // "כספים", "טכני", "חשמלאי חירום"...
  phone: string;
  category: ContactCategory;
}

export interface AccessCode {
  id: string;
  label: string; // "כניסה ראשית", "חדר זבל", "חדר מחזור", "חניון"
  code: string;
  icon?: string; // lucide icon name
  note?: string;
}

export interface Facility {
  id: string;
  name: string; // "חדר כושר", "חדר אירועים", "חדר קרטונים"
  icon?: string;
  description?: string;
  hours?: string;
  responsible?: string; // committee member in charge
  bookable?: boolean;
}

// Everything on this object is editable by the management company per building.
export interface BuildingInfo {
  buildingId: string;
  whatsappUrl?: string;
  contacts: BuildingContact[];
  codes: AccessCode[];
  facilities: Facility[];
}

export interface SessionUser {
  residentId?: string;
  name: string;
  phone: string;
  role: Role;
  buildingId: string;
  companyId: string;
  unitId?: string;
}

export interface Database {
  companies: ManagementCompany[];
  buildings: Building[];
  units: Unit[];
  residents: Resident[];
  payments: Payment[];
  ledger: Ledger[];
  calls: ServiceCall[];
  bookings: RoomBooking[];
  docs: DocItem[];
  announcements: Announcement[];
  polls: Poll[];
  events: BuildingEvent[];
  market: MarketItem[];
  gates: Gate[];
  meetings: Meeting[];
  buildingInfo: BuildingInfo[];
}
