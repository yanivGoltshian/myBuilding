import { Plus, Wrench } from "lucide-react";
import { createCallAction } from "@/app/actions";
import { Card, EmptyState, SectionHeader } from "@/components/ui/base";
import { relativeTime } from "@/lib/format";
import { repo } from "@/lib/repo";
import { CallStatusBadge, getTenantContext } from "../../_components/tenant-ui";

export const metadata = { title: "קריאות שירות" };

export default async function Page() {
  const { session } = await getTenantContext();
  const calls = session.unitId ? await repo.getCallsByUnit(session.unitId) : (await repo.getCallsByBuilding(session.buildingId)).filter((c) => c.residentName === session.name);

  return (
    <div className="space-y-4">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">קריאות שירות</h1>
        <p className="mt-1 text-sm text-muted">פותחים תקלה ומקבלים תמונת מצב עד לטיפול.</p>
      </section>

      <Card className="fade-up p-4" as="section">
        <SectionHeader title="פתיחת קריאה חדשה" />
        <form action={createCallAction} className="space-y-3">
          <div><label className="label" htmlFor="subject">נושא</label><input id="subject" name="subject" className="input" placeholder="לדוגמה: תאורה שרופה בלובי" required /></div>
          <div><label className="label" htmlFor="category">קטגוריה</label><select id="category" name="category" className="select" defaultValue="כללי"><option>כללי</option><option>אינסטלציה</option><option>חשמל</option><option>מעלית</option><option>ניקיון</option><option>אחר</option></select></div>
          <div><label className="label" htmlFor="description">תיאור</label><textarea id="description" name="description" className="textarea" rows={4} placeholder="מה קרה, איפה, ומתי שמתם לב?" /></div>
          <button className="btn btn-brand w-full" type="submit"><Plus size={16} /> שלח לוועד</button>
        </form>
      </Card>

      <section className="fade-up">
        <SectionHeader title="הקריאות שלי" />
        {calls.length ? (
          <div className="space-y-3">
            {calls.map((call) => (
              <Card key={call.id} className="p-4" as="article">
                <div className="flex items-start justify-between gap-3"><div><h2 className="font-black">{call.subject}</h2><p className="mt-1 text-xs text-muted">{call.category} · נפתחה {relativeTime(call.createdAt)}</p></div><CallStatusBadge status={call.status} /></div>
                {call.description && <p className="mt-3 text-sm leading-6 text-muted">{call.description}</p>}
                <p className="mt-3 text-xs text-faint">עודכן {relativeTime(call.updatedAt)}</p>
              </Card>
            ))}
          </div>
        ) : <EmptyState icon={<Wrench size={24} />} title="אין קריאות פתוחות" sub="אם יש משהו בבניין שדורש טיפול, פתחו קריאה חדשה." />}
      </section>
    </div>
  );
}
