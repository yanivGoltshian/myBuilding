import type {
  AccessCode,
  Announcement,
  Building,
  BuildingContact,
  BuildingEvent,
  BuildingInfo,
  DocItem,
  Facility,
  Gate,
  Ledger,
  ManagementCompany,
  MarketItem,
  Meeting,
  MeetingDecision,
  Payment,
  Poll,
  Resident,
  RoomBooking,
  ServiceCall,
  Unit,
} from "../types";

export interface NewCallInput {
  buildingId: string;
  unitId: string;
  residentName: string;
  subject: string;
  category: string;
  description: string;
}

export interface NewBookingInput {
  buildingId: string;
  unitId: string;
  residentName: string;
  date: string;
  time: string;
  subject: string;
}

export interface NewMarketInput {
  buildingId: string;
  sellerName: string;
  unit: string;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  category: MarketItem["category"];
}

export interface NewLedgerInput {
  buildingId: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  kind: Ledger["kind"];
  type: Ledger["type"];
  vendor?: string;
  recurring?: boolean;
}

export interface NewAnnouncementInput {
  buildingId: string;
  title: string;
  body: string;
  author: string;
  category: Announcement["category"];
  pinned?: boolean;
}

export interface NewPollInput {
  buildingId: string;
  question: string;
  description?: string;
  options: string[];
  closesAt: string;
}

export interface NewMeetingInput {
  buildingId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  agenda: string[];
  quorum?: number;
  pollId?: string;
}

export interface MeetingSummaryInput {
  attendance?: number;
  summary?: string;
  decisions?: MeetingDecision[];
  markHeld?: boolean;
}

export interface BrandingInput {
  brandColor?: string;
  logoText?: string;
  roomBookingEnabled?: boolean;
}

export interface BuildingInfoInput {
  whatsappUrl?: string;
  contacts?: BuildingContact[];
  codes?: AccessCode[];
  facilities?: Facility[];
}

// One interface, two implementations: in-memory (dev) and Postgres (prod).
export interface Repo {
  // reads
  getCompany(id: string): Promise<ManagementCompany | undefined>;
  getBuilding(id: string): Promise<Building | undefined>;
  getBuildingsByCompany(companyId: string): Promise<Building[]>;
  getUnit(id: string): Promise<Unit | undefined>;
  getUnitsByBuilding(buildingId: string): Promise<Unit[]>;
  getResidentsByBuilding(buildingId: string): Promise<Resident[]>;
  getResidentByPhone(phone: string): Promise<Resident | undefined>;
  getResidentById(id: string): Promise<Resident | undefined>;
  getPaymentsByUnit(unitId: string): Promise<Payment[]>;
  getPaymentsByBuilding(buildingId: string): Promise<Payment[]>;
  getLedgerByBuilding(buildingId: string): Promise<Ledger[]>;
  getCallsByBuilding(buildingId: string): Promise<ServiceCall[]>;
  getCallsByUnit(unitId: string): Promise<ServiceCall[]>;
  getBookingsByBuilding(buildingId: string): Promise<RoomBooking[]>;
  getDocsByBuilding(buildingId: string): Promise<DocItem[]>;
  getAnnouncementsByBuilding(buildingId: string): Promise<Announcement[]>;
  getPollsByBuilding(buildingId: string): Promise<Poll[]>;
  getEventsByBuilding(buildingId: string): Promise<BuildingEvent[]>;
  getMarketByBuilding(buildingId: string): Promise<MarketItem[]>;
  getGatesByBuilding(buildingId: string): Promise<Gate[]>;
  getMeetingsByBuilding(buildingId: string): Promise<Meeting[]>;
  getMeeting(id: string): Promise<Meeting | undefined>;
  getBuildingInfo(buildingId: string): Promise<BuildingInfo | undefined>;

  // writes
  createCall(input: NewCallInput): Promise<ServiceCall>;
  setCallStatus(id: string, status: ServiceCall["status"]): Promise<void>;
  payDues(unitId: string, period: string): Promise<Payment | undefined>;
  votePoll(pollId: string, optionId: string): Promise<Poll | undefined>;
  reactAnnouncement(id: string): Promise<void>;
  createBooking(input: NewBookingInput): Promise<RoomBooking>;
  addMarketItem(input: NewMarketInput): Promise<MarketItem>;
  addLedger(input: NewLedgerInput): Promise<Ledger>;
  createAnnouncement(input: NewAnnouncementInput): Promise<Announcement>;
  createPoll(input: NewPollInput): Promise<Poll>;
  createMeeting(input: NewMeetingInput): Promise<Meeting>;
  updateMeeting(id: string, input: MeetingSummaryInput): Promise<Meeting | undefined>;
  updateBranding(buildingId: string, input: BrandingInput): Promise<void>;
  updateBuildingInfo(buildingId: string, input: BuildingInfoInput): Promise<BuildingInfo>;
}
