"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { repo } from "@/lib/repo";
import {
  getSession,
  loginByPhone,
  setSession,
  clearSession,
} from "@/lib/session";
import type { MarketCategory, MeetingDecision, PaymentMethod } from "@/lib/types";

function currentPeriod(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/* ---------------- Auth ---------------- */

export async function loginPhoneAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const phone = String(formData.get("phone") ?? "").trim();
  if (!phone) return { error: "נא להזין מספר טלפון" };
  const user = await loginByPhone(phone);
  if (!user) return { error: "המספר לא נמצא. נסו את כניסת הדמו." };
  redirect(user.role === "manager" || user.role === "admin" ? "/manage" : "/app");
}

export async function demoLoginAction(residentId: string) {
  await setSession(residentId);
  const s = await getSession();
  redirect(s?.role === "manager" || s?.role === "admin" ? "/manage" : "/app");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

/* ---------------- Tenant ---------------- */

export async function payDuesAction(formData: FormData) {
  const session = await getSession();
  if (!session?.unitId) return;
  const period = String(formData.get("period") ?? currentPeriod());
  const methodRaw = String(formData.get("method") ?? "credit");
  const method = (["credit", "standing_order", "check", "bank_transfer"].includes(methodRaw)
    ? methodRaw
    : "credit") as PaymentMethod;
  await repo.payDues(session.unitId, period, method);
  revalidatePath("/app/payments");
  revalidatePath("/app");
}

export async function createCallAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const subject = String(formData.get("subject") ?? "").trim();
  const category = String(formData.get("category") ?? "כללי");
  const description = String(formData.get("description") ?? "").trim();
  if (!subject) return;
  await repo.createCall({
    buildingId: session.buildingId,
    unitId: session.unitId ?? "",
    residentName: session.name,
    subject,
    category,
    description,
  });
  revalidatePath("/app/service");
  revalidatePath("/app");
  redirect("/app/service");
}

export async function votePollAction(formData: FormData) {
  const pollId = String(formData.get("pollId") ?? "");
  const optionId = String(formData.get("optionId") ?? "");
  if (!pollId || !optionId) return;
  await repo.votePoll(pollId, optionId);
  revalidatePath("/app/community");
}

export async function reactAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await repo.reactAnnouncement(id);
  revalidatePath("/app/community");
  revalidatePath("/app");
}

export type BookingResult =
  | { ok: true; paid: boolean }
  | { ok: false; error: string };

function addOneHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const end = (h + 1) % 24;
  return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function createBookingAction(formData: FormData): Promise<BookingResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "יש להתחבר מחדש" };
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  const pay = formData.get("pay") === "on";
  if (!date || !time) return { ok: false, error: "נא לבחור תאריך ושעה" };

  const building = await repo.getBuilding(session.buildingId);
  const fee = building?.roomBookingFee ?? 0;

  const booking = await repo.createBooking({
    buildingId: session.buildingId,
    unitId: session.unitId ?? "",
    residentName: session.name,
    date,
    time,
    endTime: addOneHour(time),
    subject: subject || "שימוש בחדר הדיירים",
    fee,
  });
  if (!booking) return { ok: false, error: "המשבצת הזו כבר תפוסה, נסו שעה אחרת" };

  if (pay && fee > 0) await repo.payBooking(booking.id);
  revalidatePath("/app/more/room");
  return { ok: true, paid: pay && fee > 0 };
}

export async function payBookingAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = String(formData.get("bookingId") ?? "");
  if (!id) return;
  await repo.payBooking(id);
  revalidatePath("/app/more/room");
}

export async function addMarketAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isFree = formData.get("isFree") === "on";
  const price = isFree ? 0 : Number(formData.get("price") ?? 0);
  const category = String(formData.get("category") ?? "other") as MarketCategory;
  if (!title) return;
  const unit = session.unitId ? await repo.getUnit(session.unitId) : undefined;
  await repo.addMarketItem({
    buildingId: session.buildingId,
    residentId: session.residentId,
    sellerName: session.name,
    unit: unit?.number ?? "",
    title,
    description,
    price,
    isFree,
    category: category || "other",
  });
  revalidatePath("/app/community/market");
}

async function ownsMarketItem(id: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  const items = await repo.getMarketByBuilding(session.buildingId);
  const item = items.find((m) => m.id === id);
  if (!item) return false;
  if (item.residentId) return item.residentId === session.residentId;
  return item.sellerName === session.name; // fallback for legacy items
}

export async function updateMarketAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id || !(await ownsMarketItem(id))) return;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isFree = formData.get("isFree") === "on";
  const price = isFree ? 0 : Number(formData.get("price") ?? 0);
  if (!title) return;
  await repo.updateMarketItem(id, { title, description, price, isFree });
  revalidatePath("/app/community/market");
}

export async function deleteMarketAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id || !(await ownsMarketItem(id))) return;
  await repo.deleteMarketItem(id);
  revalidatePath("/app/community/market");
}

/* ---------------- Management ---------------- */

export async function addLedgerAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const kind = (String(formData.get("kind") ?? "expense") as "expense" | "income");
  const type = (String(formData.get("type") ?? "current") as "current" | "capital");
  if (!category || !amount) return;
  await repo.addLedger({
    buildingId: session.buildingId,
    date: new Date().toISOString().slice(0, 10),
    category,
    description: description || category,
    amount,
    kind,
    type,
  });
  revalidatePath("/manage/finance");
  revalidatePath("/manage");
}

export async function setCallStatusAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "open"
    | "in_progress"
    | "closed";
  if (!id || !status) return;
  await repo.setCallStatus(id, status);
  revalidatePath("/manage/service");
}

export async function createAnnouncementAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const category = String(formData.get("category") ?? "general") as
    | "general"
    | "maintenance"
    | "urgent"
    | "event"
    | "finance";
  const pinned = formData.get("pinned") === "on";
  if (!title || !body) return;
  await repo.createAnnouncement({
    buildingId: session.buildingId,
    title,
    body,
    author: session.name,
    category,
    pinned,
  });
  revalidatePath("/manage/announcements");
  revalidatePath("/app/community");
  revalidatePath("/app");
}

export async function createPollAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const question = String(formData.get("question") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const days = Number(formData.get("days") ?? 7);
  const options = (formData.getAll("options") as string[])
    .map((o) => o.trim())
    .filter(Boolean);
  if (!question || options.length < 2) return;
  const closesAt = new Date(Date.now() + days * 86400000).toISOString();
  await repo.createPoll({
    buildingId: session.buildingId,
    question,
    description: description || undefined,
    options,
    closesAt,
  });
  revalidatePath("/manage/polls");
  revalidatePath("/app/community");
}

export async function createMeetingAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "19:30");
  const location = String(formData.get("location") ?? "חדר דיירים");
  const agenda = (formData.getAll("agenda") as string[])
    .map((a) => a.trim())
    .filter(Boolean);
  const quorum = Number(formData.get("quorum") ?? 0) || undefined;
  if (!title || !date) return;
  await repo.createMeeting({
    buildingId: session.buildingId,
    title,
    date,
    time,
    location,
    agenda,
    quorum,
  });
  revalidatePath("/manage/meetings");
  revalidatePath("/app/community/meetings");
}

export async function saveMeetingSummaryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const attendance = Number(formData.get("attendance") ?? 0) || undefined;
  const summary = String(formData.get("summary") ?? "").trim();
  const topics = (formData.getAll("topic") as string[]).map((t) => t.trim());
  const outcomes = (formData.getAll("outcome") as string[]).map((o) => o.trim());
  const decisions: MeetingDecision[] = topics
    .map((topic, i) => ({ topic, outcome: outcomes[i] ?? "" }))
    .filter((d) => d.topic);
  if (!id) return;
  await repo.updateMeeting(id, {
    attendance,
    summary: summary || undefined,
    decisions,
    markHeld: true,
  });
  revalidatePath("/manage/meetings");
  revalidatePath("/app/community/meetings");
}

export async function updateBrandingAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const brandColor = String(formData.get("brandColor") ?? "").trim();
  const logoText = String(formData.get("logoText") ?? "").trim();
  const roomBookingEnabled = formData.get("roomBookingEnabled") === "on";
  const feeRaw = formData.get("roomBookingFee");
  const roomBookingFee =
    feeRaw === null || String(feeRaw).trim() === ""
      ? undefined
      : Math.max(0, Number(feeRaw));
  const allMethods: PaymentMethod[] = ["credit", "standing_order", "check", "bank_transfer"];
  const paymentMethods = allMethods.filter((m) => formData.get(`pm_${m}`) === "on");
  await repo.updateBranding(session.buildingId, {
    brandColor: brandColor || undefined,
    logoText: logoText || undefined,
    roomBookingEnabled,
    roomBookingFee,
    paymentMethods,
  });
  revalidatePath("/manage/settings");
  revalidatePath("/manage");
  revalidatePath("/app/more/room");
  revalidatePath("/app/payments");
  revalidatePath("/app");
}

/* ---------------- Configurable building info hub ---------------- */

function rid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

async function reloadInfo(buildingId: string) {
  const info = await repo.getBuildingInfo(buildingId);
  return (
    info ?? { buildingId, contacts: [], codes: [], facilities: [] }
  );
}

function revalidateInfo() {
  revalidatePath("/manage/info");
  revalidatePath("/app/more");
  revalidatePath("/app/more/info");
}

export async function saveWhatsappAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const whatsappUrl = String(formData.get("whatsappUrl") ?? "").trim();
  await repo.updateBuildingInfo(session.buildingId, { whatsappUrl });
  revalidateInfo();
}

export async function addContactAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const category = String(formData.get("category") ?? "other") as
    | "committee"
    | "management"
    | "emergency"
    | "service"
    | "other";
  if (!name || !phone) return;
  const info = await reloadInfo(session.buildingId);
  const contacts = [
    ...info.contacts,
    { id: rid("ct"), name, role: role || undefined, phone, category },
  ];
  await repo.updateBuildingInfo(session.buildingId, { contacts });
  revalidateInfo();
}

export async function removeContactAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = String(formData.get("id") ?? "");
  const info = await reloadInfo(session.buildingId);
  await repo.updateBuildingInfo(session.buildingId, {
    contacts: info.contacts.filter((c) => c.id !== id),
  });
  revalidateInfo();
}

export async function addCodeAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const label = String(formData.get("label") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!label || !code) return;
  const info = await reloadInfo(session.buildingId);
  const codes = [
    ...info.codes,
    { id: rid("cd"), label, code, icon: icon || undefined, note: note || undefined },
  ];
  await repo.updateBuildingInfo(session.buildingId, { codes });
  revalidateInfo();
}

export async function removeCodeAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = String(formData.get("id") ?? "");
  const info = await reloadInfo(session.buildingId);
  await repo.updateBuildingInfo(session.buildingId, {
    codes: info.codes.filter((c) => c.id !== id),
  });
  revalidateInfo();
}

export async function addFacilityAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const hours = String(formData.get("hours") ?? "").trim();
  const responsible = String(formData.get("responsible") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();
  const bookable = formData.get("bookable") === "on";
  if (!name) return;
  const info = await reloadInfo(session.buildingId);
  const facilities = [
    ...info.facilities,
    {
      id: rid("fc"),
      name,
      description: description || undefined,
      hours: hours || undefined,
      responsible: responsible || undefined,
      icon: icon || undefined,
      bookable,
    },
  ];
  await repo.updateBuildingInfo(session.buildingId, { facilities });
  revalidateInfo();
}

export async function removeFacilityAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = String(formData.get("id") ?? "");
  const info = await reloadInfo(session.buildingId);
  await repo.updateBuildingInfo(session.buildingId, {
    facilities: info.facilities.filter((f) => f.id !== id),
  });
  revalidateInfo();
}

/* ---------------- Preventive maintenance, checklists & vendors ---------------- */

function revalidateMaintenance() {
  revalidatePath("/manage/maintenance");
  revalidatePath("/manage");
  revalidatePath("/app/more");
  revalidatePath("/app");
}

export async function addVendorAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const preferred = formData.get("preferred") === "on";
  if (!name || !category || !phone) return;
  await repo.addVendor({
    buildingId: session.buildingId,
    name,
    category,
    phone,
    contactName: contactName || undefined,
    notes: notes || undefined,
    preferred,
  });
  revalidatePath("/manage/vendors");
  revalidatePath("/manage/maintenance");
}

export async function deleteVendorAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await repo.deleteVendor(id);
  revalidatePath("/manage/vendors");
  revalidatePath("/manage/maintenance");
}

export async function addMaintenanceAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const cadenceRaw = String(formData.get("cadence") ?? "monthly");
  const cadence = (["weekly", "monthly", "quarterly", "biannual", "yearly"].includes(cadenceRaw)
    ? cadenceRaw
    : "monthly") as "weekly" | "monthly" | "quarterly" | "biannual" | "yearly";
  const nextDue = String(formData.get("nextDue") ?? "").trim();
  const vendorId = String(formData.get("vendorId") ?? "").trim();
  const costRaw = formData.get("cost");
  const cost =
    costRaw === null || String(costRaw).trim() === ""
      ? undefined
      : Math.max(0, Number(costRaw));
  if (!title || !category || !nextDue) return;
  let vendorName: string | undefined;
  if (vendorId) {
    const vendors = await repo.getVendorsByBuilding(session.buildingId);
    vendorName = vendors.find((v) => v.id === vendorId)?.name;
  }
  await repo.addMaintenanceTask({
    buildingId: session.buildingId,
    title,
    category,
    cadence,
    nextDue,
    vendorId: vendorId || undefined,
    vendorName,
    cost,
  });
  revalidateMaintenance();
}

export async function completeMaintenanceAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await repo.completeMaintenanceTask(id);
  revalidateMaintenance();
}

export async function toggleChecklistItemAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const checklistId = String(formData.get("checklistId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  if (!checklistId || !itemId) return;
  await repo.toggleChecklistItem(checklistId, itemId);
  revalidatePath("/manage/maintenance");
}

/* ---------------- AI resident assistant ---------------- */

export type AssistantCallResult = { ok: boolean; id?: string };

// The assistant can open a service call on the resident's behalf (no redirect —
// the chat renders an inline confirmation).
export async function assistantOpenCallAction(
  _prev: AssistantCallResult | undefined,
  formData: FormData
): Promise<AssistantCallResult> {
  const session = await getSession();
  if (!session) return { ok: false };
  const subject = String(formData.get("subject") ?? "").trim();
  const category = String(formData.get("category") ?? "כללי");
  const description = String(formData.get("description") ?? "").trim();
  if (!subject) return { ok: false };
  const call = await repo.createCall({
    buildingId: session.buildingId,
    unitId: session.unitId ?? "",
    residentName: session.name,
    subject,
    category,
    description: description || subject,
  });
  revalidatePath("/app/service");
  revalidatePath("/app");
  return { ok: true, id: call.id };
}
