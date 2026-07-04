import { Home, Phone, Users } from "lucide-react";
import { Badge, Card, EmptyState, SectionHeader } from "@/components/ui/base";
import { unitBalance } from "@/lib/finance";
import { fmtILS } from "@/lib/format";
import { repo } from "@/lib/repo";
import { getManageContext, telHref } from "../../_components/manage-ui";

export const metadata = { title: "דיירים" };

export default async function Page(){
 const {session}=await getManageContext(); const [units,residents]=await Promise.all([repo.getUnitsByBuilding(session.buildingId), repo.getResidentsByBuilding(session.buildingId)]); const rows=await Promise.all(units.map(async unit=>({unit, residents: residents.filter(r=>r.unitId===unit.id), balance: unitBalance(await repo.getPaymentsByUnit(unit.id))})));
 return <div className="space-y-5"><section className="fade-up"><h1 className="text-3xl font-black tracking-tight">דירות ודיירים</h1><p className="mt-1 text-sm text-muted">ספר טלפונים ניהולי עם בעלים, שוכרים ויתרות פתוחות.</p></section><section className="fade-up"><SectionHeader title="רשימת דירות" />{rows.length ? <div className="space-y-3">{rows.map(({unit,residents,balance})=><Card key={unit.id} className="p-4"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="text-xl font-black">דירה {unit.number}</h2>{unit.isRented&&<Badge tone="info">מושכר</Badge>}</div><p className="text-sm text-muted">קומה {unit.floor} · בעלים: {unit.ownerName}</p></div><div className="text-left"><p className={balance>0?"font-black text-warning":"font-black text-success"}>{fmtILS(balance)}</p><p className="text-xs text-muted">יתרה</p></div></div><div className="mt-3 space-y-2">{residents.length ? residents.map(r=><div key={r.id} className="flex items-center justify-between gap-3 rounded-2xl bg-surface-2 p-3"><div className="min-w-0"><p className="font-bold">{r.name}</p><p className="text-xs text-muted">{r.isOwner ? "בעלים" : "שוכר"} · {r.role}</p></div><a href={telHref(r.phone)} dir="ltr" className="inline-flex items-center gap-1 text-sm font-bold text-brand"><Phone size={14}/>{r.phone}</a></div>) : <p className="rounded-2xl bg-surface-2 p-3 text-sm text-muted">אין אנשי קשר משויכים</p>}</div></Card>)}</div> : <EmptyState icon={<Users size={24}/>} title="אין דירות" sub="יחידות הבניין יופיעו כאן." />}</section></div>
}
