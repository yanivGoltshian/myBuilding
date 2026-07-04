import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Banknote,
  Bike,
  Building2,
  CalendarDays,
  Car,
  CheckCircle,
  Clock,
  DoorOpen,
  Droplets,
  Dumbbell,
  FileText,
  Flame,
  Heart,
  Home,
  Info,
  Landmark,
  Lightbulb,
  MapPin,
  Megaphone,
  Package,
  Phone,
  ReceiptText,
  Recycle,
  Shield,
  ShoppingBag,
  Sofa,
  Trash2,
  User,
  Users,
  Vote,
  WalletCards,
  Wrench,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Badge, Card, IconTile } from "@/components/ui/base";
import { getSession } from "@/lib/session";
import { repo } from "@/lib/repo";
import type {
  AnnouncementCategory,
  Building,
  ContactCategory,
  DocItem,
  MarketCategory,
  Payment,
  PaymentStatus,
  SessionUser,
  CallStatus,
  MeetingStatus,
} from "@/lib/types";

export async function getTenantContext(): Promise<{ session: SessionUser; building: Building | undefined }> {
  const session = await getSession();
  if (!session) redirect("/login");
  const building = await repo.getBuilding(session.buildingId);
  return { session, building };
}

export function currentPeriod() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function yearlyProgress(payments: Payment[]) {
  const year = String(new Date().getFullYear());
  const rows = payments.filter((p) => p.period.startsWith(year));
  if (!rows.length) return 0;
  return rows.filter((p) => p.status === "paid").length / rows.length;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function dateTimeValue(date: string, time = "00:00") {
  return new Date(`${date}T${time}:00`).getTime();
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map = {
    paid: ["success", "שולם"],
    due: ["warning", "לתשלום"],
    overdue: ["danger", "באיחור"],
  } as const;
  const [tone, label] = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function CallStatusBadge({ status }: { status: CallStatus }) {
  const map = {
    open: ["warning", "פתוח"],
    in_progress: ["info", "בטיפול"],
    closed: ["success", "טופל"],
  } as const;
  const [tone, label] = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function MeetingStatusBadge({ status }: { status: MeetingStatus }) {
  return status === "scheduled" ? <Badge tone="info">מתוכננת</Badge> : <Badge tone="success">התקיימה</Badge>;
}

const announcementMap: Record<AnnouncementCategory, { tone: "brand" | "success" | "warning" | "danger" | "info" | "muted"; label: string; icon: ReactNode }> = {
  general: { tone: "muted", label: "כללי", icon: <Megaphone size={14} /> },
  maintenance: { tone: "info", label: "תחזוקה", icon: <Wrench size={14} /> },
  urgent: { tone: "danger", label: "דחוף", icon: <AlertTriangle size={14} /> },
  event: { tone: "brand", label: "אירוע", icon: <CalendarDays size={14} /> },
  finance: { tone: "success", label: "כספים", icon: <ReceiptText size={14} /> },
};

export function AnnouncementBadge({ category }: { category: AnnouncementCategory }) {
  const meta = announcementMap[category];
  return <Badge tone={meta.tone} className="inline-flex items-center gap-1">{meta.icon}{meta.label}</Badge>;
}

export function DocKindBadge({ kind }: { kind: DocItem["kind"] }) {
  const map = {
    bylaws: ["brand", "תקנון"],
    form: ["info", "טופס"],
    unit: ["success", "אישי"],
    general: ["muted", "כללי"],
  } as const;
  const [tone, label] = map[kind];
  return <Badge tone={tone}>{label}</Badge>;
}

export function MarketCategoryBadge({ category }: { category: MarketCategory }) {
  const map = {
    furniture: "ריהוט",
    appliance: "מוצרי חשמל",
    kids: "ילדים",
    free: "חינם",
    other: "כללי",
  };
  return <Badge tone={category === "free" ? "success" : "muted"}>{map[category]}</Badge>;
}

export function contactCategoryLabel(category: ContactCategory) {
  return {
    committee: "ועד הבית",
    management: "חברת ניהול",
    emergency: "חירום",
    service: "נותני שירות",
    other: "אחרים",
  }[category];
}

export function CategoryIcon({ category }: { category: ContactCategory }) {
  const icon = {
    committee: <Users size={18} />,
    management: <Building2 size={18} />,
    emergency: <Shield size={18} />,
    service: <Wrench size={18} />,
    other: <User size={18} />,
  }[category];
  const tone = category === "emergency" ? "danger" : category === "management" ? "info" : category === "service" ? "warning" : "brand";
  return <IconTile tone={tone}>{icon}</IconTile>;
}

const iconMap = {
  Bike,
  Building2,
  CalendarDays,
  Car,
  DoorOpen,
  Droplets,
  Dumbbell,
  FileText,
  Flame,
  Heart,
  Home,
  Info,
  Landmark,
  Lightbulb,
  Package,
  Phone,
  ReceiptText,
  Recycle,
  ShoppingBag,
  Sofa,
  Trash2,
  Vote,
  WalletCards,
  Wrench,
  Banknote,
  CheckCircle,
  Clock,
  MapPin,
} as const;

export function NamedIcon({ name, size = 18 }: { name?: string; size?: number }) {
  const Icon = name && name in iconMap ? iconMap[name as keyof typeof iconMap] : Info;
  return <Icon size={size} />;
}

export function ActionTile({ href, icon, label, sub, external = false }: { href: string; icon: ReactNode; label: string; sub?: string; external?: boolean }) {
  const className = "card card-hover tap flex items-center gap-3 p-4 text-right";
  const content = (
    <>
      <IconTile tone="brand">{icon}</IconTile>
      <span className="min-w-0">
        <span className="block font-bold">{label}</span>
        {sub && <span className="mt-0.5 block text-xs text-muted">{sub}</span>}
      </span>
    </>
  );
  if (external) {
    return <a href={href} className={className} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{content}</a>;
  }
  return <Link href={href} className={className}>{content}</Link>;
}

export function DetailRow({ icon, title, sub, action }: { icon: ReactNode; title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
      <IconTile tone="plain" className="!h-10 !w-10">{icon}</IconTile>
      <div className="min-w-0 flex-1">
        <div className="font-bold">{title}</div>
        {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
      </div>
      {action}
    </div>
  );
}

export function SoftNote({ children }: { children: ReactNode }) {
  return <Card className="border-brand/20 p-4 text-sm text-muted" as="section">{children}</Card>;
}
