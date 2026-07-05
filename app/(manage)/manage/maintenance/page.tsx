import Link from "next/link";
import { AlertTriangle, CalendarClock, CheckCircle2, ClipboardCheck, Plus, ShieldCheck, Wrench } from "lucide-react";
import { addMaintenanceAction, completeMaintenanceAction, toggleChecklistItemAction } from "@/app/actions";
import { Badge, Card, EmptyState, IconTile, SectionHeader, StatCard } from "@/components/ui/base";
import { ProgressRing } from "@/components/ui/charts";
import { fmtDateShort, fmtILS } from "@/lib/format";
import { repo } from "@/lib/repo";
import type { MaintenanceCadence } from "@/lib/types";
import { getManageContext } from "../../_components/manage-ui";
import { SubmitButton } from "../../_components/SubmitButton";

export const metadata = { title: "אחזקה מונעת" };

const CADENCE: Record<MaintenanceCadence, string> = {
  weekly: "שבועי",
  monthly: "חודשי",
  quarterly: "רבעוני",
  biannual: "חצי-שנתי",
  yearly: "שנתי",
};

function daysUntil(dateISO: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateISO).getTime() - today.getTime()) / 86400000);
}

export default async function Page() {
  const { session } = await getManageContext();
  const [tasks, checklists, vendors] = await Promise.all([
    repo.getMaintenanceByBuilding(session.buildingId),
    repo.getChecklistsByBuilding(session.buildingId),
    repo.getVendorsByBuilding(session.buildingId),
  ]);

  const enriched = tasks
    .map((t) => ({ ...t, days: daysUntil(t.nextDue) }))
    .sort((a, b) => a.days - b.days);
  const overdue = enriched.filter((t) => t.days < 0).length;
  const soon = enriched.filter((t) => t.days >= 0 && t.days <= 14).length;
  const annualCost = tasks.reduce((s, t) => {
    const perYear = { weekly: 52, monthly: 12, quarterly: 4, biannual: 2, yearly: 1 }[t.cadence];
    return s + (t.cost ?? 0) * perYear;
  }, 0);

  return (
    <div className="space-y-5">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">אחזקה מונעת</h1>
        <p className="mt-1 text-sm text-muted">תוכנית תחזוקה יזומה לבניין — בדיקות תקופתיות, צ׳קליסטים וניהול עלויות.</p>
      </section>

      <div className="grid grid-cols-3 gap-3 fade-up">
        <StatCard label="באיחור" value={overdue} tone={overdue ? "danger" : "success"} icon={<AlertTriangle size={16} />} />
        <StatCard label="ב-14 יום" value={soon} tone={soon ? "warning" : "success"} icon={<CalendarClock size={16} />} />
        <StatCard label="עלות שנתית" value={fmtILS(annualCost)} tone="brand" icon={<ShieldCheck size={16} />} />
      </div>

      <section className="fade-up">
        <SectionHeader title="משימות תחזוקה" />
        {enriched.length ? (
          <div className="space-y-2">
            {enriched.map((t) => {
              const isOverdue = t.days < 0;
              return (
                <Card key={t.id} className={`p-4 ${isOverdue ? "border-danger/30" : ""}`}>
                  <div className="flex items-start gap-3">
                    <IconTile tone={isOverdue ? "danger" : "brand"}><Wrench size={17} /></IconTile>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="font-black">{t.title}</h2>
                        {isOverdue ? <Badge tone="danger">באיחור</Badge> : t.days <= 14 ? <Badge tone="warning">קרוב</Badge> : <Badge tone="success">בזמן</Badge>}
                      </div>
                      <p className="mt-0.5 text-xs text-muted">{t.category} · {CADENCE[t.cadence]}{t.vendorName ? ` · ${t.vendorName}` : ""}{t.cost ? ` · ${fmtILS(t.cost)}` : ""}</p>
                      <p className="mt-1 text-sm">
                        <span className={isOverdue ? "font-bold text-danger" : "text-muted"}>
                          מועד הבא: {fmtDateShort(t.nextDue)} {isOverdue ? `(${Math.abs(t.days)} ימי איחור)` : t.days === 0 ? "(היום)" : `(עוד ${t.days} ימים)`}
                        </span>
                        {t.lastDone && <span className="text-muted"> · בוצע לאחרונה {fmtDateShort(t.lastDone)}</span>}
                      </p>
                      <form action={completeMaintenanceAction} className="mt-3">
                        <input type="hidden" name="id" value={t.id} />
                        <button type="submit" className="btn btn-outline"><CheckCircle2 size={15} /> סמן כבוצע</button>
                      </form>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={<Wrench size={24} />} title="אין משימות תחזוקה" sub="הוסיפו משימות תחזוקה תקופתיות כדי לא לפספס בדיקות חשובות." />
        )}
      </section>

      <Card className="fade-up p-4">
        <SectionHeader title="משימת תחזוקה חדשה" action={<Plus size={18} className="text-brand" />} />
        <form action={addMaintenanceAction} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">שם המשימה</span><input name="title" className="input" placeholder="בדיקת מעליות" required /></label>
            <label><span className="label">קטגוריה</span><input name="category" className="input" placeholder="מעלית" required /></label>
            <label><span className="label">תדירות</span><select name="cadence" className="select" defaultValue="quarterly">{(Object.keys(CADENCE) as MaintenanceCadence[]).map((c) => <option key={c} value={c}>{CADENCE[c]}</option>)}</select></label>
            <label><span className="label">מועד ביצוע הבא</span><input name="nextDue" type="date" dir="ltr" className="input" required /></label>
            <label><span className="label">ספק</span><select name="vendorId" className="select" defaultValue=""><option value="">— ללא —</option>{vendors.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.category})</option>)}</select></label>
            <label><span className="label">עלות משוערת (₪)</span><input name="cost" type="number" min="0" dir="ltr" className="input" placeholder="0" /></label>
          </div>
          <SubmitButton>הוסף משימה</SubmitButton>
        </form>
      </Card>

      <section className="fade-up">
        <SectionHeader title="צ׳קליסטים תפעוליים" />
        {checklists.length ? (
          <div className="space-y-3">
            {checklists.map((cl) => {
              const done = cl.items.filter((i) => i.done).length;
              const ratio = cl.items.length ? done / cl.items.length : 0;
              return (
                <Card key={cl.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <ProgressRing value={ratio} size={54} thickness={7}>{Math.round(ratio * 100)}%</ProgressRing>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2"><ClipboardCheck size={16} className="text-brand" /><h2 className="font-black">{cl.title}</h2></div>
                      <p className="text-xs text-muted">{cl.category ?? ""}{cl.period ? ` · ${cl.period}` : ""} · {done}/{cl.items.length} הושלמו</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {cl.items.map((item) => (
                      <form key={item.id} action={toggleChecklistItemAction}>
                        <input type="hidden" name="checklistId" value={cl.id} />
                        <input type="hidden" name="itemId" value={item.id} />
                        <button type="submit" className={`check-row tap ${item.done ? "check-row-on" : ""}`}>
                          <span className={`check-box ${item.done ? "check-box-on" : ""}`}>{item.done && <CheckCircle2 size={14} />}</span>
                          <span className={item.done ? "text-muted line-through" : ""}>{item.text}</span>
                        </button>
                      </form>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={<ClipboardCheck size={24} />} title="אין צ׳קליסטים" sub="צ׳קליסטים תפעוליים יעזרו לוודא שכל בדיקה בוצעה." />
        )}
      </section>

      <Link href="/manage" className="btn btn-outline w-full">חזרה ללוח הניהול</Link>
    </div>
  );
}
