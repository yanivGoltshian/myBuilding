import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AlertTriangle, Building2, CheckCircle, Clock, Megaphone, ReceiptText, User, Users, Wrench } from "lucide-react";
import { Badge, Card, IconTile } from "@/components/ui/base";
import { getSession } from "@/lib/session";
import { repo } from "@/lib/repo";
import type { AnnouncementCategory, Building, CallStatus, FlowKind, MeetingStatus, SessionUser } from "@/lib/types";

export async function getManageContext(): Promise<{ session: SessionUser; building: Building | undefined }> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "manager" && session.role !== "admin") redirect("/app");
  const building = await repo.getBuilding(session.buildingId);
  return { session, building };
}

export function telHref(phone?: string) {
  return `tel:${String(phone ?? "").replace(/[^\d+]/g, "")}`;
}

export function CallStatusBadge({ status }: { status: CallStatus }) {
  const map = { open: ["warning", "פתוחה"], in_progress: ["info", "בטיפול"], closed: ["success", "סגורה"] } as const;
  const [tone, label] = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function MeetingStatusBadge({ status }: { status: MeetingStatus }) {
  return status === "scheduled" ? <Badge tone="info">מתוכננת</Badge> : <Badge tone="success">התקיימה</Badge>;
}

export function FlowBadge({ kind }: { kind: FlowKind }) {
  return kind === "income" ? <Badge tone="success">הכנסה</Badge> : <Badge tone="danger">הוצאה</Badge>;
}

export function ExpenseTypeBadge({ type }: { type: "current" | "capital" }) {
  return type === "current" ? <Badge tone="info">שוטף</Badge> : <Badge tone="brand">הוני</Badge>;
}

const announcementMap: Record<AnnouncementCategory, { tone: "brand" | "success" | "warning" | "danger" | "info" | "muted"; label: string; icon: ReactNode }> = {
  general: { tone: "muted", label: "כללי", icon: <Megaphone size={14} /> },
  maintenance: { tone: "info", label: "תחזוקה", icon: <Wrench size={14} /> },
  urgent: { tone: "danger", label: "דחוף", icon: <AlertTriangle size={14} /> },
  event: { tone: "brand", label: "אירוע", icon: <Users size={14} /> },
  finance: { tone: "success", label: "כספים", icon: <ReceiptText size={14} /> },
};

export function AnnouncementBadge({ category }: { category: AnnouncementCategory }) {
  const meta = announcementMap[category];
  return <Badge tone={meta.tone} className="inline-flex items-center gap-1">{meta.icon}{meta.label}</Badge>;
}

export function statusRank(status: CallStatus) {
  return status === "open" ? 0 : status === "in_progress" ? 1 : 2;
}

export function dateTimeValue(date: string, time = "00:00") {
  return new Date(`${date}T${time}:00`).getTime();
}

export function MiniLink({ href, icon, title, sub }: { href: string; icon: ReactNode; title: string; sub?: string }) {
  return (
    <Link href={href} className="card card-hover tap flex items-center gap-3 p-4">
      <IconTile tone="brand">{icon}</IconTile>
      <span className="min-w-0"><span className="block font-black">{title}</span>{sub && <span className="mt-0.5 block text-xs text-muted">{sub}</span>}</span>
    </Link>
  );
}

export function PersonLine({ name, sub, phone }: { name: string; sub?: string; phone?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
      <IconTile tone="plain" className="!h-10 !w-10"><User size={17} /></IconTile>
      <div className="min-w-0 flex-1"><p className="font-bold">{name}</p>{sub && <p className="text-xs text-muted">{sub}</p>}</div>
      {phone && <a href={telHref(phone)} dir="ltr" className="text-sm font-bold text-brand">{phone}</a>}
    </div>
  );
}

export function SoftMetric({ label, value, tone = "brand" }: { label: string; value: ReactNode; tone?: "brand" | "success" | "warning" | "danger" | "info" | "muted" }) {
  return <Card className="p-3"><div className="text-xs text-muted">{label}</div><div className={`mt-1 text-lg font-black ${tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "danger" ? "text-danger" : tone === "info" ? "text-info" : "text-brand"}`}>{value}</div></Card>;
}

export function StatusDot({ tone = "brand" }: { tone?: "brand" | "success" | "warning" | "danger" | "info" | "muted" }) {
  const cls = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : tone === "danger" ? "bg-danger" : tone === "info" ? "bg-info" : "bg-brand";
  return <span className={`h-2 w-2 rounded-full ${cls}`} />;
}

export function EmptyCard({ children }: { children: ReactNode }) {
  return <Card className="p-4 text-sm text-muted">{children}</Card>;
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

export function ManagementNote({ children }: { children: ReactNode }) {
  return <Card className="border-brand/20 p-4 text-sm leading-6 text-muted">{children}</Card>;
}

export const callStatuses = [
  ["open", "פתוחה"],
  ["in_progress", "בטיפול"],
  ["closed", "סגורה"],
] as const;

export function BuildingGlyph() {
  return <Building2 size={18} />;
}

export function ClosedGlyph() {
  return <CheckCircle size={18} />;
}

export function ClockGlyph() {
  return <Clock size={18} />;
}
