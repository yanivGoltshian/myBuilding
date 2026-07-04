import { Landmark, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import { Card, EmptyState, SectionHeader, StatCard } from "@/components/ui/base";
import { Bars, Donut } from "@/components/ui/charts";
import { balance, CATEGORY_COLORS, currentVsCapital, expenseByCategory, monthlyFlow, totals } from "@/lib/finance";
import { fmtILS } from "@/lib/format";
import { repo } from "@/lib/repo";
import { getTenantContext } from "../../../_components/tenant-ui";

export const metadata = { title: "שקיפות כספית" };

export default async function Page() {
  const { session, building } = await getTenantContext();
  const ledger = await repo.getLedgerByBuilding(session.buildingId);
  const total = totals(ledger);
  const bal = balance(ledger);
  const split = currentVsCapital(ledger);
  const categories = expenseByCategory(ledger).slice(0, 6).map((row, i) => ({ label: row.category, value: row.amount, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }));
  const flow = monthlyFlow(ledger, 6);
  const currentKey = new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-5">
      <Card className="fade-up overflow-hidden p-5 brand-gradient text-brand-ink" as="section">
        <p className="text-sm opacity-85">יתרת ועד הבית</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">{fmtILS(bal)}</h1>
        <p className="mt-2 text-sm opacity-85">{building?.name} · נתונים חיים מתוך ספר התנועות</p>
      </Card>

      <div className="grid grid-cols-2 gap-3 fade-up">
        <StatCard label="הכנסות" value={fmtILS(total.income)} tone="success" icon={<TrendingUp size={16} />} hint="גביית דמי ועד ועוד" />
        <StatCard label="הוצאות" value={fmtILS(total.expense)} tone="warning" icon={<TrendingDown size={16} />} hint="תחזוקה ושיפורים" />
      </div>

      {ledger.length ? (
        <>
          <Card className="fade-up p-4" as="section">
            <SectionHeader title="הוצאות לפי חודשים" />
            <Bars data={flow.map((f) => ({ label: f.label, value: f.expense, highlight: f.key === currentKey }))} height={150} />
            <p className="mt-3 text-xs text-muted">העמודה המודגשת היא החודש הנוכחי.</p>
          </Card>

          <Card className="fade-up p-4" as="section">
            <SectionHeader title="לאן הולך הכסף" />
            <div className="flex items-center gap-5">
              <Donut data={categories} centerLabel={fmtILS(total.expense)} centerSub="הוצאות" />
              <div className="min-w-0 flex-1 space-y-2">
                {categories.map((c) => <div key={c.label} className="flex items-center justify-between gap-2 text-sm"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.label}</span><span className="font-bold">{fmtILS(c.value)}</span></div>)}
              </div>
            </div>
          </Card>

          <Card className="fade-up p-4" as="section">
            <SectionHeader title="שוטף מול הוני" />
            <div className="space-y-3">
              <SplitRow label="שוטף" value={split.current} total={split.total} note="חל על כל הדיירים כולל שוכרים: ניקיון, חשמל, מעלית ומים." />
              <SplitRow label="הוני" value={split.capital} total={split.total} note="חל על הבעלים: שיפוצים, החלפות ותשתיות ארוכות טווח." />
            </div>
          </Card>
        </>
      ) : <EmptyState icon={<Landmark size={24} />} title="אין תנועות כספיות" sub="ספר התנועות יופיע כאן לאחר שיוזנו הכנסות והוצאות." />}
    </div>
  );
}

function SplitRow({ label, value, total, note }: { label: string; value: number; total: number; note: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-2xl bg-surface-2 p-3">
      <div className="flex items-center justify-between gap-2"><span className="font-black">{label}</span><span className="font-black">{fmtILS(value)} · {pct}%</span></div>
      <div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
      <p className="mt-2 text-xs leading-5 text-muted">{note}</p>
    </div>
  );
}
