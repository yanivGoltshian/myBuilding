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
import type { MeetingDecision } from "@/lib/types";

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
  await repo.payDues(session.unitId, period);
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

export async function createBookingAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  if (!date || !time) return;
  await repo.createBooking({
    buildingId: session.buildingId,
    unitId: session.unitId ?? "",
    residentName: session.name,
    date,
    time,
    subject: subject || "שימוש בחדר הדיירים",
  });
  revalidatePath("/app/more/room");
}

export async function addMarketAction(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isFree = formData.get("isFree") === "on";
  const price = isFree ? 0 : Number(formData.get("price") ?? 0);
  if (!title) return;
  const unit = session.unitId ? await repo.getUnit(session.unitId) : undefined;
  await repo.addMarketItem({
    buildingId: session.buildingId,
    sellerName: session.name,
    unit: unit?.number ?? "",
    title,
    description,
    price,
    isFree,
    category: "other",
  });
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
  await repo.updateBranding(session.buildingId, {
    brandColor: brandColor || undefined,
    logoText: logoText || undefined,
    roomBookingEnabled,
  });
  revalidatePath("/manage/settings");
  revalidatePath("/manage");
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
