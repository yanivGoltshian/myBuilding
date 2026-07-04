import { Phone, WalletCards } from "lucide-react";
import { Badge, Card, EmptyState, SectionHeader, StatCard } from "@/components/ui/base";
import { debtorsByUnit, debtsSummary } from "@/lib/finance";
import { fmtILS } from "@/lib/format";
import { repo } from "@/lib/repo";
import { getManageContext, telHref } from "../../_components/manage-ui";

export const metadata = { title: "חייבים" };

export default async function Page(){
 const {session}=await getManageContext();
 const [payments, units, residents]=await Promise.all([repo.getPaymentsByBuilding(session.buildingId), repo.getUnitsByBuilding(session.buildingId), repo.getResidentsByBuilding(session.buildingId)]);
 const summary=debtsSummary(payments);
 const rows=[...debtorsByUnit(payments).entries()].map(([unitId,d])=>{const unit=units.find(u=>u.id===unitId); const resident=residents.find(r=>r.unitId===unitId && !r.isOwner) ?? residents.find(r=>r.unitId===unitId); const overdue=payments.filter(p=>p.unitId===unitId && p.status==='overdue').reduce((s,p)=>s+p.amount,0); return {unit, resident, overdue, ...d};}).sort((a,b)=>b.amount-a.amount);
 return <div className="space-y-5"><section className="fade-up"><h1 className="text-3xl font-black tracking-tight">חייבים</h1><p className="mt-1 text-sm text-muted">רשימת דירות עם יתרה פתוחה לפי חומרה וסכום.</p></section><div className="grid grid-cols-2 gap-3 fade-up"><StatCard label="פתוח לגבייה" value={fmtILS(summary.outstanding)} tone="warning" icon={<WalletCards size={16}/>} hint={`${summary.dueCount+summary.overdueCount} חיובים`} /><StatCard label="באיחור" value={fmtILS(summary.overdueAmount)} tone="danger" hint={`${summary.overdueCount} חיובים באיחור`} /></div><section className="fade-up"><SectionHeader title="דירות לטיפול" />{rows.length ? <div className="space-y-2">{rows.map((r)=><Card key={r.unit?.id ?? 'x'} className="p-4"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="text-lg font-black">דירה {r.unit?.number}</h2>{r.overdue>0 && <Badge tone="danger">באיחור</Badge>}</div><p className="mt-1 text-sm text-muted">{r.unit?.ownerName}{r.unit?.isRented ? " · מושכרת" : ""}</p><p className="text-xs text-muted">איש קשר: {r.resident?.name ?? "לא משויך"} · {r.months} תקופות</p></div><div className="text-left"><p className="font-black text-danger">{fmtILS(r.amount)}</p>{r.overdue>0 && <p className="text-xs text-danger">מתוכם {fmtILS(r.overdue)} באיחור</p>}</div></div>{r.resident?.phone && <a href={telHref(r.resident.phone)} className="btn btn-outline mt-3 w-full"><Phone size={16}/> צור קשר</a>}</Card>)}</div> : <EmptyState icon={<WalletCards size={24}/>} title="אין חובות פתוחים" sub="כל הדירות מעודכנות לתקופה הנוכחית." />}</section></div>
}
