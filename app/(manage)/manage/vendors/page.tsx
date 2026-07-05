import Link from "next/link";
import { Phone, Plus, Star, Trash2, Wrench } from "lucide-react";
import { addVendorAction, deleteVendorAction } from "@/app/actions";
import { Badge, Card, EmptyState, IconTile, SectionHeader } from "@/components/ui/base";
import { repo } from "@/lib/repo";
import { getManageContext, telHref } from "../../_components/manage-ui";
import { SubmitButton } from "../../_components/SubmitButton";

export const metadata = { title: "ספקים" };

export default async function Page() {
  const { session } = await getManageContext();
  const vendors = await repo.getVendorsByBuilding(session.buildingId);
  const preferred = vendors.filter((v) => v.preferred).length;

  const groups = new Map<string, typeof vendors>();
  for (const v of vendors) {
    const arr = groups.get(v.category) ?? [];
    arr.push(v);
    groups.set(v.category, arr);
  }

  return (
    <div className="space-y-5">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">ספר ספקים</h1>
        <p className="mt-1 text-sm text-muted">כל בעלי המקצוע של הבניין במקום אחד — חיוג בקליק, דירוג וספקים מועדפים.</p>
      </section>

      <div className="grid grid-cols-2 gap-3 fade-up">
        <Card className="p-4"><div className="text-xs text-muted">סה״כ ספקים</div><div className="mt-1 text-2xl font-black text-brand">{vendors.length}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted">ספקים מועדפים</div><div className="mt-1 text-2xl font-black text-warning">{preferred}</div></Card>
      </div>

      <Card className="fade-up p-4">
        <SectionHeader title="הוספת ספק" action={<Plus size={18} className="text-brand" />} />
        <form action={addVendorAction} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">שם הספק</span><input name="name" className="input" placeholder="אינסטלציה 24/7" required /></label>
            <label><span className="label">תחום</span><input name="category" className="input" placeholder="אינסטלציה" required /></label>
            <label><span className="label">טלפון</span><input name="phone" dir="ltr" className="input" placeholder="050-0000000" required /></label>
            <label><span className="label">איש קשר</span><input name="contactName" className="input" placeholder="דוד" /></label>
          </div>
          <label><span className="label">הערות</span><input name="notes" className="input" placeholder="חירום 24/7, חוזה אחזקה..." /></label>
          <label className="flex items-center gap-2 rounded-2xl bg-surface-2 p-3 text-sm font-bold"><input type="checkbox" name="preferred" /> סמן כספק מועדף</label>
          <SubmitButton>הוסף ספק</SubmitButton>
        </form>
      </Card>

      {vendors.length ? (
        [...groups.entries()].map(([category, list]) => (
          <section key={category} className="fade-up">
            <SectionHeader title={category} />
            <div className="space-y-2">
              {list.map((v) => (
                <Card key={v.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <IconTile tone={v.preferred ? "warning" : "brand"}><Wrench size={17} /></IconTile>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-black">{v.name}</h2>
                        {v.preferred && <Badge tone="warning" className="inline-flex items-center gap-1"><Star size={12} /> מועדף</Badge>}
                      </div>
                      <p className="mt-0.5 text-xs text-muted">{v.contactName ? `${v.contactName} · ` : ""}{v.category}{v.rating ? ` · דירוג ${v.rating}/5` : ""}</p>
                      {v.notes && <p className="mt-1 text-sm text-muted">{v.notes}</p>}
                      <div className="mt-3 flex items-center gap-2">
                        <a href={telHref(v.phone)} dir="ltr" className="btn btn-outline"><Phone size={15} /> {v.phone}</a>
                        <form action={deleteVendorAction}>
                          <input type="hidden" name="id" value={v.id} />
                          <button type="submit" className="btn btn-ghost text-danger" aria-label="מחיקה"><Trash2 size={15} /></button>
                        </form>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        ))
      ) : (
        <EmptyState icon={<Wrench size={24} />} title="עדיין אין ספקים" sub="הוסיפו את בעלי המקצוע של הבניין כדי לחייג אליהם בקליק." />
      )}

      <Link href="/manage" className="btn btn-outline w-full">חזרה ללוח הניהול</Link>
    </div>
  );
}
