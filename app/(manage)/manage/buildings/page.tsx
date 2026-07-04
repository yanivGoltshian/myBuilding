import Link from "next/link";
import { Building2, Wallet } from "lucide-react";
import { Card, EmptyState, IconTile, SectionHeader } from "@/components/ui/base";
import { debtsSummary } from "@/lib/finance";
import { fmtILS } from "@/lib/format";
import { repo } from "@/lib/repo";
import { getManageContext } from "../../_components/manage-ui";

export const metadata = { title: "בניינים" };

export default async function Page(){
 const {session}=await getManageContext(); const buildings=await repo.getBuildingsByCompany(session.companyId); const rows=await Promise.all(buildings.map(async b=>{const [units,payments]=await Promise.all([repo.getUnitsByBuilding(b.id), repo.getPaymentsByBuilding(b.id)]); return {b, units, debts:debtsSummary(payments)};}));
 return <div className="space-y-5"><section className="fade-up"><h1 className="text-3xl font-black tracking-tight">בנייני החברה</h1><p className="mt-1 text-sm text-muted">תמונת מצב מהירה לכל בניין בפורטפוליו.</p></section><section className="fade-up"><SectionHeader title="פורטפוליו" />{rows.length ? <div className="space-y-3">{rows.map(({b,units,debts})=><Card key={b.id} className="p-4"><div className="flex items-start gap-3"><IconTile tone="brand"><Building2 size={18}/></IconTile><div className="min-w-0 flex-1"><h2 className="text-lg font-black">{b.name}</h2><p className="text-sm text-muted">{b.address}, {b.city} · {units.length} דירות</p><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-surface-2 p-3"><p className="text-xs text-muted">נגבה</p><p className="font-black text-success">{fmtILS(debts.collected)}</p></div><div className="rounded-2xl bg-surface-2 p-3"><p className="text-xs text-muted">פתוח</p><p className="font-black text-warning">{fmtILS(debts.outstanding)}</p></div></div><Link href="/manage" className="btn btn-outline mt-3 w-full"><Wallet size={16}/> לניהול הבניין הפעיל</Link></div></div></Card>)}</div> : <EmptyState icon={<Building2 size={24}/>} title="אין בניינים" sub="בנייני החברה יופיעו כאן." />}</section></div>
}
