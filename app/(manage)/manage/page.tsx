import Link from "next/link";
import { Banknote, Building2, CalendarDays, Home, Megaphone, Users, Vote, Wallet, Wrench } from "lucide-react";
import { Card, EmptyState, IconTile, SectionHeader, StatCard } from "@/components/ui/base";
import { Bars } from "@/components/ui/charts";
import { balance, debtorsByUnit, debtsSummary, monthlyFlow } from "@/lib/finance";
import { fmtILS, greeting, relativeTime } from "@/lib/format";
import { repo } from "@/lib/repo";
import { CallStatusBadge, getManageContext, MiniLink, statusRank } from "../_components/manage-ui";

export const metadata = { title: "לוח ניהול" };

export default async function Page() {
  const { session, building } = await getManageContext();
  const [company, buildings, units, payments, ledger, calls] = await Promise.all([
    repo.getCompany(session.companyId), repo.getBuildingsByCompany(session.companyId), repo.getUnitsByBuilding(session.buildingId), repo.getPaymentsByBuilding(session.buildingId), repo.getLedgerByBuilding(session.buildingId), repo.getCallsByBuilding(session.buildingId),
  ]);
  const debts = debtsSummary(payments);
  const openCalls = calls.filter((c) => c.status !== "closed").sort((a, b) => statusRank(a.status) - statusRank(b.status));
  const rented = units.filter((u) => u.isRented).length;
  const flow = monthlyFlow(ledger, 6);
  const debtors = [...debtorsByUnit(payments).entries()].map(([unitId, d]) => ({ unit: units.find((u) => u.id === unitId), ...d })).sort((a, b) => b.amount - a.amount).slice(0, 3);

  return (
    <div className="space-y-5">
      <section className="fade-up pt-1"><p className="text-sm text-muted">{company?.name} · {buildings.length} בניינים</p><h1 className="text-3xl font-black tracking-tight">{greeting(session.name)}</h1><p className="mt-1 text-sm text-muted">מרכז השליטה של {building?.name}: כסף, שירות ודיירים במקום אחד.</p></section>
      <div className="grid grid-cols-2 gap-3 fade-up">
        <StatCard label="נגבה / פתוח" value={fmtILS(debts.collected)} hint={`פתוח ${fmtILS(debts.outstanding)}`} tone={debts.outstanding ? "warning" : "success"} icon={<Wallet size={16} />} />
        <StatCard label="קריאות פעילות" value={openCalls.length} hint="פתוחות ובטיפול" tone={openCalls.length ? "warning" : "success"} icon={<Wrench size={16} />} />
        <StatCard label="תפוסה" value={`${rented}/${units.length}`} hint={`${Math.round((rented / Math.max(units.length, 1)) * 100)}% דירות מושכרות`} tone="info" icon={<Home size={16} />} />
        <StatCard label="יתרת בניין" value={fmtILS(balance(ledger))} hint="הכנסות פחות הוצאות" tone="brand" icon={<Banknote size={16} />} />
      </div>
      <Card className="fade-up p-4" as="section"><SectionHeader title="תזרים 6 חודשים" action={<Link href="/manage/finance" className="text-xs font-bold text-brand">פירוט</Link>} /><Bars data={flow.flatMap((m) => [{ label: m.label, value: m.income, highlight: true }, { label: "הו׳", value: m.expense }])} /></Card>
      <section className="fade-up"><SectionHeader title="חייבים לטיפול" action={<Link href="/manage/debts" className="text-xs font-bold text-brand">כל החייבים</Link>} />{debtors.length ? <div className="space-y-2">{debtors.map((d) => <Link key={d.unit?.id} href="/manage/debts" className="card card-hover tap flex items-center justify-between p-4"><div><p className="font-black">דירה {d.unit?.number}</p><p className="text-xs text-muted">{d.unit?.ownerName} · {d.months} תקופות</p></div><p className="font-black text-danger">{fmtILS(d.amount)}</p></Link>)}</div> : <EmptyState title="אין חובות פתוחים" sub="כל הדיירים מעודכנים." />}</section>
      <section className="fade-up"><SectionHeader title="קריאות שירות אחרונות" action={<Link href="/manage/service" className="text-xs font-bold text-brand">לניהול תור</Link>} />{openCalls.length ? <div className="space-y-2">{openCalls.slice(0, 3).map((call) => <Card key={call.id} className="p-4"><div className="flex items-start gap-3"><IconTile tone="warning"><Wrench size={17} /></IconTile><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h2 className="font-black">{call.subject}</h2><CallStatusBadge status={call.status} /></div><p className="mt-1 text-sm text-muted line-clamp-2">{call.description}</p><p className="mt-2 text-xs text-muted">{call.residentName} · {relativeTime(call.createdAt)}</p></div></div></Card>)}</div> : <EmptyState icon={<Wrench size={24} />} title="אין קריאות פעילות" sub="קריאות חדשות יופיעו כאן." />}</section>
      <section className="fade-up"><SectionHeader title="קיצורי ניהול" /><div className="grid grid-cols-2 gap-3"><MiniLink href="/manage/maintenance" icon={<Wrench size={18} />} title="אחזקה מונעת" sub="תחזוקה וצ׳קליסטים" /><MiniLink href="/manage/vendors" icon={<Users size={18} />} title="ספקים" sub="בעלי מקצוע" /><MiniLink href="/manage/buildings" icon={<Building2 size={18} />} title="בניינים" sub="פורטפוליו" /><MiniLink href="/manage/residents" icon={<Users size={18} />} title="דיירים" sub="אנשי קשר" /><MiniLink href="/manage/announcements" icon={<Megaphone size={18} />} title="עדכונים" sub="פרסום לקהילה" /><MiniLink href="/manage/polls" icon={<Vote size={18} />} title="סקרים" sub="הצבעות מהירות" /><MiniLink href="/manage/meetings" icon={<CalendarDays size={18} />} title="אסיפות" sub="זימון ופרוטוקול" /></div></section>
    </div>
  );
}
