import Link from "next/link";
import { Bot } from "lucide-react";
import { repo } from "@/lib/repo";
import { unitBalance } from "@/lib/finance";
import { getTenantContext } from "../../_components/tenant-ui";
import AssistantChat, { type AssistantKB } from "./AssistantChat";

export const metadata = { title: "עוזר חכם" };

export default async function Page() {
  const { session, building } = await getTenantContext();
  const bid = session.buildingId;

  const [info, gates, meetings, maintenance, payments] = await Promise.all([
    repo.getBuildingInfo(bid),
    repo.getGatesByBuilding(bid),
    repo.getMeetingsByBuilding(bid),
    repo.getMaintenanceByBuilding(bid),
    session.unitId ? repo.getPaymentsByUnit(session.unitId) : Promise.resolve([]),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const nextMeeting = meetings
    .filter((m) => m.status === "scheduled" && m.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const kb: AssistantKB = {
    buildingName: building?.name ?? "הבניין",
    residentFirst: session.name.split(" ")[0] ?? "שכן",
    whatsappUrl: info?.whatsappUrl,
    codes: (info?.codes ?? []).map((c) => ({ label: c.label, code: c.code, note: c.note })),
    phones: (info?.contacts ?? []).map((c) => ({ name: c.name, role: c.role, phone: c.phone })),
    facilities: (info?.facilities ?? []).map((f) => ({ name: f.name, hours: f.hours, responsible: f.responsible, description: f.description, bookable: f.bookable })),
    gates: gates.map((g) => ({ name: g.name, dialerPhone: g.dialerPhone })),
    nextMeeting: nextMeeting ? { title: nextMeeting.title, date: nextMeeting.date, time: nextMeeting.time, location: nextMeeting.location } : undefined,
    upcomingMaintenance: maintenance
      .filter((m) => m.nextDue >= today)
      .sort((a, b) => a.nextDue.localeCompare(b.nextDue))
      .slice(0, 3)
      .map((m) => ({ title: m.title, nextDue: m.nextDue })),
    roomBookingEnabled: !!building?.roomBookingEnabled,
    roomBookingFee: building?.roomBookingFee,
    balance: unitBalance(payments),
  };

  return (
    <div className="space-y-4">
      <section className="fade-up">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl brand-gradient text-white shadow-sm"><Bot size={22} /></span>
          <div>
            <h1 className="text-2xl font-black tracking-tight">העוזר החכם</h1>
            <p className="text-sm text-muted">כל מה שצריך לדעת על {building?.name ?? "הבניין"} — בשיחה אחת.</p>
          </div>
        </div>
      </section>

      <AssistantChat kb={kb} />

      <Link href="/app/more" className="btn btn-outline w-full">חזרה למרכז השירותים</Link>
    </div>
  );
}
