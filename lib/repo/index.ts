import type { Database } from "../types";
import { seedDatabase } from "../seed";
import { paymentMethodLabel } from "../payments";
import type {
  BrandingInput,
  BuildingInfoInput,
  MeetingSummaryInput,
  NewAnnouncementInput,
  NewBookingInput,
  NewCallInput,
  NewLedgerInput,
  NewMaintenanceInput,
  NewMarketInput,
  NewMeetingInput,
  NewPollInput,
  NewVendorInput,
  Repo,
  UpdateMarketInput,
} from "./types";

// Persist a single mutable DB across requests and HMR reloads in `next dev`.
const g = globalThis as unknown as { __vaadDb?: Database };
function db(): Database {
  if (!g.__vaadDb) g.__vaadDb = seedDatabase();
  return g.__vaadDb;
}

function rid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const mockRepo: Repo = {
  async getCompany(id) {
    return db().companies.find((c) => c.id === id);
  },
  async getBuilding(id) {
    return db().buildings.find((b) => b.id === id);
  },
  async getBuildingsByCompany(companyId) {
    return db().buildings.filter((b) => b.companyId === companyId);
  },
  async getUnit(id) {
    return db().units.find((u) => u.id === id);
  },
  async getUnitsByBuilding(buildingId) {
    return db()
      .units.filter((u) => u.buildingId === buildingId)
      .sort((a, b) => a.number.localeCompare(b.number));
  },
  async getResidentsByBuilding(buildingId) {
    return db().residents.filter((r) => r.buildingId === buildingId);
  },
  async getResidentByPhone(phone) {
    const norm = phone.replace(/\D/g, "");
    return db().residents.find((r) => r.phone.replace(/\D/g, "") === norm);
  },
  async getResidentById(id) {
    return db().residents.find((r) => r.id === id);
  },
  async getPaymentsByUnit(unitId) {
    return db()
      .payments.filter((p) => p.unitId === unitId)
      .sort((a, b) => b.period.localeCompare(a.period));
  },
  async getPaymentsByBuilding(buildingId) {
    return db().payments.filter((p) => p.buildingId === buildingId);
  },
  async getLedgerByBuilding(buildingId) {
    return db()
      .ledger.filter((l) => l.buildingId === buildingId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },
  async getCallsByBuilding(buildingId) {
    return db()
      .calls.filter((c) => c.buildingId === buildingId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async getCallsByUnit(unitId) {
    return db()
      .calls.filter((c) => c.unitId === unitId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async getBookingsByBuilding(buildingId) {
    return db()
      .bookings.filter((b) => b.buildingId === buildingId)
      .sort((a, b) => a.date.localeCompare(b.date));
  },
  async getDocsByBuilding(buildingId) {
    return db().docs.filter((d) => d.buildingId === buildingId);
  },
  async getAnnouncementsByBuilding(buildingId) {
    return db()
      .announcements.filter((a) => a.buildingId === buildingId)
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.date.localeCompare(a.date);
      });
  },
  async getPollsByBuilding(buildingId) {
    return db()
      .polls.filter((p) => p.buildingId === buildingId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async getEventsByBuilding(buildingId) {
    return db()
      .events.filter((e) => e.buildingId === buildingId)
      .sort((a, b) => a.date.localeCompare(b.date));
  },
  async getMarketByBuilding(buildingId) {
    return db()
      .market.filter((m) => m.buildingId === buildingId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },
  async getGatesByBuilding(buildingId) {
    return db().gates.filter((g) => g.buildingId === buildingId);
  },
  async getMeetingsByBuilding(buildingId) {
    return db()
      .meetings.filter((m) => m.buildingId === buildingId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },
  async getMeeting(id) {
    return db().meetings.find((m) => m.id === id);
  },
  async getBuildingInfo(buildingId) {
    return db().buildingInfo.find((i) => i.buildingId === buildingId);
  },
  async getMaintenanceByBuilding(buildingId) {
    return db()
      .maintenance.filter((m) => m.buildingId === buildingId)
      .sort((a, b) => a.nextDue.localeCompare(b.nextDue));
  },
  async getChecklistsByBuilding(buildingId) {
    return db()
      .checklists.filter((c) => c.buildingId === buildingId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async getVendorsByBuilding(buildingId) {
    return db()
      .vendors.filter((v) => v.buildingId === buildingId)
      .sort((a, b) => {
        if (a.preferred !== b.preferred) return a.preferred ? -1 : 1;
        return a.category.localeCompare(b.category, "he");
      });
  },

  async createCall(input: NewCallInput) {
    const now = new Date().toISOString();
    const call = {
      id: rid("sc"),
      ...input,
      status: "open" as const,
      createdAt: now,
      updatedAt: now,
    };
    db().calls.unshift(call);
    return call;
  },
  async setCallStatus(id, status) {
    const call = db().calls.find((c) => c.id === id);
    if (call) {
      call.status = status;
      call.updatedAt = new Date().toISOString();
    }
  },
  async payDues(unitId, period, method) {
    const d = db();
    let pay = d.payments.find((p) => p.unitId === unitId && p.period === period);
    const now = new Date().toISOString();
    const label = paymentMethodLabel(method);
    if (pay) {
      pay.status = "paid";
      pay.paidAt = now;
      pay.method = label;
    } else {
      const unit = d.units.find((u) => u.id === unitId);
      pay = {
        id: rid("pay"),
        unitId,
        buildingId: unit?.buildingId ?? "b1",
        period,
        amount: unit?.monthlyDues ?? 0,
        status: "paid",
        paidAt: now,
        method: label,
      };
      d.payments.push(pay);
    }
    return pay;
  },
  async votePoll(pollId, optionId) {
    const poll = db().polls.find((p) => p.id === pollId);
    const opt = poll?.options.find((o) => o.id === optionId);
    if (opt) opt.votes += 1;
    return poll;
  },
  async reactAnnouncement(id) {
    const a = db().announcements.find((x) => x.id === id);
    if (a) a.reactions += 1;
  },
  async createBooking(input: NewBookingInput) {
    const d = db();
    // availability guard: reject if the same date+time slot is already taken
    const clash = d.bookings.some(
      (b) =>
        b.buildingId === input.buildingId &&
        b.date === input.date &&
        b.time === input.time
    );
    if (clash) return undefined;
    const booking = { id: rid("bk"), paid: false, ...input };
    d.bookings.push(booking);
    return booking;
  },
  async payBooking(id) {
    const booking = db().bookings.find((b) => b.id === id);
    if (booking) booking.paid = true;
    return booking;
  },
  async addMarketItem(input: NewMarketInput) {
    const item = { id: rid("m"), ...input, date: new Date().toISOString() };
    db().market.unshift(item);
    return item;
  },
  async updateMarketItem(id, input: UpdateMarketInput) {
    const item = db().market.find((m) => m.id === id);
    if (!item) return undefined;
    if (input.title !== undefined) item.title = input.title;
    if (input.description !== undefined) item.description = input.description;
    if (input.category !== undefined) item.category = input.category;
    if (input.isFree !== undefined) item.isFree = input.isFree;
    if (input.price !== undefined) item.price = input.isFree ? 0 : input.price;
    return item;
  },
  async deleteMarketItem(id) {
    const d = db();
    d.market = d.market.filter((m) => m.id !== id);
  },
  async addLedger(input: NewLedgerInput) {
    const row = { id: rid("l"), ...input };
    db().ledger.unshift(row);
    return row;
  },
  async createAnnouncement(input: NewAnnouncementInput) {
    const a = {
      id: rid("an"),
      ...input,
      pinned: input.pinned ?? false,
      date: new Date().toISOString(),
      reactions: 0,
      comments: 0,
    };
    db().announcements.unshift(a);
    return a;
  },
  async createPoll(input: NewPollInput) {
    const poll = {
      id: rid("p"),
      buildingId: input.buildingId,
      question: input.question,
      description: input.description,
      options: input.options.map((label, i) => ({
        id: `o${i + 1}`,
        label,
        votes: 0,
      })),
      closesAt: input.closesAt,
      createdAt: new Date().toISOString(),
    };
    db().polls.unshift(poll);
    return poll;
  },
  async createMeeting(input: NewMeetingInput) {
    const meeting = {
      id: rid("mt"),
      ...input,
      status: "scheduled" as const,
      decisions: [],
    };
    db().meetings.unshift(meeting);
    return meeting;
  },
  async updateMeeting(id, input: MeetingSummaryInput) {
    const m = db().meetings.find((x) => x.id === id);
    if (!m) return undefined;
    if (input.attendance !== undefined) m.attendance = input.attendance;
    if (input.summary !== undefined) m.summary = input.summary;
    if (input.decisions !== undefined) m.decisions = input.decisions;
    if (input.markHeld) m.status = "held";
    return m;
  },
  async updateBranding(buildingId, input: BrandingInput) {
    const b = db().buildings.find((x) => x.id === buildingId);
    if (!b) return;
    if (input.brandColor !== undefined) b.brandColor = input.brandColor;
    if (input.logoText !== undefined) b.logoText = input.logoText;
    if (input.roomBookingEnabled !== undefined)
      b.roomBookingEnabled = input.roomBookingEnabled;
    if (input.roomBookingFee !== undefined)
      b.roomBookingFee = input.roomBookingFee;
    if (input.paymentMethods !== undefined)
      b.paymentMethods = input.paymentMethods;
  },
  async updateBuildingInfo(buildingId, input: BuildingInfoInput) {
    const d = db();
    let info = d.buildingInfo.find((i) => i.buildingId === buildingId);
    if (!info) {
      info = { buildingId, contacts: [], codes: [], facilities: [] };
      d.buildingInfo.push(info);
    }
    if (input.whatsappUrl !== undefined) info.whatsappUrl = input.whatsappUrl;
    if (input.contacts !== undefined) info.contacts = input.contacts;
    if (input.codes !== undefined) info.codes = input.codes;
    if (input.facilities !== undefined) info.facilities = input.facilities;
    return info;
  },
  async addVendor(input: NewVendorInput) {
    const vendor = { id: rid("vn"), rating: 0, ...input };
    db().vendors.unshift(vendor);
    return vendor;
  },
  async deleteVendor(id) {
    const d = db();
    d.vendors = d.vendors.filter((v) => v.id !== id);
  },
  async addMaintenanceTask(input: NewMaintenanceInput) {
    const overdue = input.nextDue < new Date().toISOString().slice(0, 10);
    const task = {
      id: rid("mt"),
      ...input,
      status: (overdue ? "overdue" : "scheduled") as "overdue" | "scheduled",
    };
    db().maintenance.push(task);
    return task;
  },
  async completeMaintenanceTask(id) {
    const task = db().maintenance.find((m) => m.id === id);
    if (!task) return undefined;
    const today = new Date();
    task.lastDone = today.toISOString().slice(0, 10);
    const next = new Date(today);
    const steps: Record<string, number> = {
      weekly: 7,
      monthly: 30,
      quarterly: 91,
      biannual: 182,
      yearly: 365,
    };
    next.setDate(next.getDate() + (steps[task.cadence] ?? 30));
    task.nextDue = next.toISOString().slice(0, 10);
    task.status = "scheduled";
    return task;
  },
  async toggleChecklistItem(checklistId, itemId) {
    const list = db().checklists.find((c) => c.id === checklistId);
    const item = list?.items.find((i) => i.id === itemId);
    if (list && item) {
      item.done = !item.done;
      list.updatedAt = new Date().toISOString().slice(0, 10);
    }
    return list;
  },
};

// The active repository used across the app.
// Prototype: in-memory mock (works on Vercel too; resets on cold start).
// Production: set DATABASE_URL and swap this to `pgRepo` from "./postgres".
export const repo: Repo = mockRepo;

export type { Repo } from "./types";

