import { ReceiptText, WalletCards } from "lucide-react";
import { payDuesAction } from "@/app/actions";
import { Card, EmptyState, SectionHeader, StatCard } from "@/components/ui/base";
import { ProgressRing } from "@/components/ui/charts";
import { fmtDate, fmtILS, periodLabel } from "@/lib/format";
import { unitBalance } from "@/lib/finance";
import { repo } from "@/lib/repo";
import { currentPeriod, getTenantContext, PaymentStatusBadge, yearlyProgress } from "../../_components/tenant-ui";
import { PayForm } from "./PayForm";

export const metadata = { title: "תשלומים" };

export default async function Page() {
  const { session, building } = await getTenantContext();
  if (!session.unitId) {
    return <EmptyState icon={<WalletCards size={24} />} title="אין דירה משויכת" sub="לא נמצאו תשלומים עבור המשתמש הזה." />;
  }
  const payments = await repo.getPaymentsByUnit(session.unitId);
  const balance = unitBalance(payments);
  const open = payments.filter((p) => p.status !== "paid");
  const paid = payments.filter((p) => p.status === "paid");
  const progress = yearlyProgress(payments);
  const methods = building?.paymentMethods ?? ["credit"];

  return (
    <div className="space-y-4">
      <Card className="fade-up p-5" as="section">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted">יתרה נוכחית</p>
            <h1 className="mt-1 text-4xl font-black tracking-tight">{fmtILS(balance)}</h1>
            <p className="mt-1 text-sm text-muted">{open.length ? `${open.length} תקופות פתוחות לתשלום` : "הדירה מעודכנת ללא חובות"}</p>
          </div>
          <ProgressRing value={progress} size={82} thickness={8}>{Math.round(progress * 100)}%</ProgressRing>
        </div>
        <PayForm period={open[0]?.period ?? currentPeriod()} methods={methods} />
      </Card>

      <div className="grid grid-cols-2 gap-3 fade-up">
        <StatCard label="פתוח לתשלום" value={fmtILS(balance)} tone={balance ? "warning" : "success"} icon={<WalletCards size={16} />} hint={open.length ? `${open.length} חודשים` : "אין חובות"} />
        <StatCard label="שולם השנה" value={fmtILS(paid.reduce((s, p) => s + p.amount, 0))} tone="success" icon={<ReceiptText size={16} />} hint="כולל היסטוריה זמינה" />
      </div>

      {open.length > 0 && (
        <section className="fade-up">
          <SectionHeader title="תקופות פתוחות" />
          <div className="space-y-2">
            {open.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="font-black">{periodLabel(p.period)}</p><p className="text-sm text-muted">{fmtILS(p.amount)}</p></div>
                  <div className="flex items-center gap-2"><PaymentStatusBadge status={p.status} /><form action={payDuesAction}><input type="hidden" name="period" value={p.period} /><button className="btn btn-outline" type="submit">שלם</button></form></div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="fade-up">
        <SectionHeader title="היסטוריית תשלומים" />
        {payments.length ? (
          <div className="space-y-2">
            {payments.map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="font-bold">{periodLabel(p.period)}</p><p className="text-xs text-muted">{p.paidAt ? `${fmtDate(p.paidAt)} · ${p.method}` : "טרם שולם"}</p></div>
                  <div className="text-left"><p className="font-black">{fmtILS(p.amount)}</p><PaymentStatusBadge status={p.status} /></div>
                </div>
              </Card>
            ))}
          </div>
        ) : <EmptyState icon={<ReceiptText size={24} />} title="אין תשלומים להצגה" sub="כשתתווסף גבייה היא תופיע כאן." />}
      </section>
    </div>
  );
}
