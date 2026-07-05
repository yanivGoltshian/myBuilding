import { Plus, ShoppingBag } from "lucide-react";
import { addMarketAction } from "@/app/actions";
import { Card, EmptyState, SectionHeader } from "@/components/ui/base";
import { repo } from "@/lib/repo";
import { getTenantContext } from "../../../_components/tenant-ui";
import { MarketItemCard } from "./MarketItemCard";

export const metadata = { title: "לוח יד2" };

export default async function Page() {
  const { session } = await getTenantContext();
  const items = await repo.getMarketByBuilding(session.buildingId);

  const canManage = (item: (typeof items)[number]) =>
    item.residentId
      ? item.residentId === session.residentId
      : item.sellerName === session.name;

  return (
    <div className="space-y-4">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">לוח יד2 של הבניין</h1>
        <p className="mt-1 text-sm text-muted">מוכרים, מוסרים ומעבירים בין שכנים.</p>
      </section>

      <Card className="fade-up p-4" as="section">
        <SectionHeader title="פרסום מודעה" />
        <form action={addMarketAction} className="space-y-3">
          <div><label className="label" htmlFor="title">מה מפרסמים?</label><input id="title" name="title" className="input" placeholder="לדוגמה: כיסא אוכל לתינוק" required /></div>
          <div><label className="label" htmlFor="description">תיאור קצר</label><textarea id="description" name="description" className="textarea" rows={3} placeholder="מצב, איסוף, פרטים חשובים" /></div>
          <div><label className="label" htmlFor="category">קטגוריה</label><select id="category" name="category" className="select" defaultValue="other"><option value="furniture">ריהוט</option><option value="appliance">מוצרי חשמל</option><option value="kids">ילדים</option><option value="other">כללי</option></select></div>
          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <div><label className="label" htmlFor="price">מחיר</label><input id="price" name="price" className="input" type="number" inputMode="numeric" min="0" placeholder="0" dir="ltr" /></div>
            <label className="mb-3 flex items-center gap-2 text-sm font-bold"><input type="checkbox" name="isFree" /> חינם</label>
          </div>
          <button className="btn btn-brand w-full" type="submit"><Plus size={16} /> פרסם בבניין</button>
        </form>
      </Card>

      <section className="fade-up">
        <SectionHeader title="מודעות אחרונות" />
        {items.length ? (
          <div className="space-y-3">
            {items.map((item) => (
              <MarketItemCard key={item.id} item={item} canManage={canManage(item)} />
            ))}
          </div>
        ) : <EmptyState icon={<ShoppingBag size={24} />} title="הלוח עדיין ריק" sub="היו הראשונים לפרסם משהו לשכנים." />}
      </section>
    </div>
  );
}
