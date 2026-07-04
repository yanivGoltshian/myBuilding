import { Landmark, PieChart, Plus, ReceiptText, Wallet } from "lucide-react";
import { addLedgerAction } from "@/app/actions";
import { Badge, Card, EmptyState, SectionHeader, StatCard } from "@/components/ui/base";
import { Bars, Donut } from "@/components/ui/charts";
import { CATEGORY_COLORS, currentVsCapital, expenseByCategory, monthlyFlow, totals } from "@/lib/finance";
import { fmtDate, fmtILS } from "@/lib/format";
import { repo } from "@/lib/repo";
import { ExpenseTypeBadge, FlowBadge, getManageContext } from "../../_components/manage-ui";
import { SubmitButton } from "../../_components/SubmitButton";

export const metadata = { title: "כספים" };

export default async function Page() {
  const { session } = await getManageContext();
  const ledger = await repo.getLedgerByBuilding(session.buildingId);
  const t = totals(ledger);
  const split = currentVsCapital(ledger);
  const categories = expenseByCategory(ledger);
  const flow = monthlyFlow(ledger, 6);
  const rows = [...ledger].sort((a, b) => b.date.localeCompare(a.date));
  return <div className="space-y-5">
    <section className="fade-up"><h1 className="text-3xl font-black tracking-tight">כספים ותזרים</h1><p className="mt-1 text-sm text-muted">מעקב הכנסות, הוצאות וחלוקה בין שוטף להוני.</p></section>
    <div className="grid grid-cols-2 gap-3 fade-up"><StatCard label="הכנסות" value={fmtILS(t.income)} tone="success" icon={<Wallet size={16}/>} /><StatCard label="הוצאות" value={fmtILS(t.expense)} tone="danger" icon={<ReceiptText size={16}/>} /><StatCard label="יתרה" value={fmtILS(t.net)} tone={t.net >= 0 ? "brand" : "danger"} icon={<Landmark size={16}/>} /><StatCard label="הוצאות הוניות" value={fmtILS(split.capital)} tone="info" icon={<PieChart size={16}/>} /></div>
    <Card className="fade-up p-4"><SectionHeader title="תזרים חודשי" /><Bars data={flow.flatMap((m) => [{ label: m.label, value: m.income, highlight: true }, { label: "הו׳", value: m.expense }])} /></Card>
    <Card className="fade-up p-4"><SectionHeader title="פילוח הוצאות" />{categories.length ? <div className="flex items-center gap-4"><Donut data={categories.map((c, i) => ({ label: c.category, value: c.amount, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))} centerLabel={fmtILS(split.total)} centerSub="סה״כ" /><div className="min-w-0 flex-1 space-y-2">{categories.slice(0,5).map((c,i)=><div key={c.category} className="flex items-center justify-between gap-2 text-sm"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{background:CATEGORY_COLORS[i%CATEGORY_COLORS.length]}} />{c.category}</span><b>{fmtILS(c.amount)}</b></div>)}</div></div> : <EmptyState title="אין הוצאות" sub="הוצאות שיתווספו יוצגו בפילוח." />}</Card>
    <Card className="fade-up p-4"><SectionHeader title="שוטף מול הוני" /><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-surface-2 p-3"><p className="text-xs text-muted">שוטף</p><p className="text-xl font-black">{fmtILS(split.current)}</p><p className="mt-1 text-xs text-muted">דיירים ושוכרים: ניקיון, חשמל, מים ותחזוקה.</p></div><div className="rounded-2xl bg-surface-2 p-3"><p className="text-xs text-muted">הוני</p><p className="text-xl font-black">{fmtILS(split.capital)}</p><p className="mt-1 text-xs text-muted">בעלים בלבד: שיפוצים, תשתיות והשבחות.</p></div></div></Card>
    <Card className="fade-up p-4" as="section"><SectionHeader title="הוספת תנועה" action={<Plus size={18} className="text-brand" />} /><form action={addLedgerAction} className="space-y-3"><div className="grid grid-cols-2 gap-3"><label><span className="label">סוג</span><select name="kind" className="select"><option value="expense">הוצאה</option><option value="income">הכנסה</option></select></label><label><span className="label">חיוב</span><select name="type" className="select"><option value="current">שוטף</option><option value="capital">הוני</option></select></label></div><label><span className="label">קטגוריה</span><input name="category" className="input" placeholder="ניקיון / דמי ועד" required /></label><label><span className="label">תיאור</span><input name="description" className="input" placeholder="פירוט לתנועה" /></label><label><span className="label">סכום</span><input name="amount" className="input" type="number" min="1" inputMode="numeric" required /></label><SubmitButton>שמירת תנועה</SubmitButton></form></Card>
    <section className="fade-up"><SectionHeader title="יומן תנועות" />{rows.length ? <div className="space-y-2">{rows.map((l)=><Card key={l.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-black">{l.description}</p><p className="mt-1 text-xs text-muted">{fmtDate(l.date)} · {l.category}{l.vendor ? ` · ${l.vendor}` : ""}</p><div className="mt-2 flex gap-1"><FlowBadge kind={l.kind}/><ExpenseTypeBadge type={l.type}/>{l.recurring && <Badge tone="muted">קבוע</Badge>}</div></div><p className={l.kind === "income" ? "font-black text-success" : "font-black text-danger"}>{l.kind === "income" ? "+" : "-"}{fmtILS(l.amount)}</p></div></Card>)}</div> : <EmptyState icon={<ReceiptText size={24}/>} title="אין תנועות" sub="הוסיפו תנועה ראשונה." />}</section>
  </div>;
}
