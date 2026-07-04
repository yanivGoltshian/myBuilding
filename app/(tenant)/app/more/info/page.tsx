import { MessageCircle, PhoneCall, UnlockKeyhole } from "lucide-react";
import { Badge, Card, EmptyState, IconTile, SectionHeader } from "@/components/ui/base";
import { repo } from "@/lib/repo";
import type { ContactCategory } from "@/lib/types";
import { CategoryIcon, contactCategoryLabel, getTenantContext, NamedIcon, telHref } from "../../../_components/tenant-ui";
import { CodeChip } from "../../../_components/code-chip";

export const metadata = { title: "מידע ואנשי קשר" };

const categories: ContactCategory[] = ["committee", "management", "emergency", "service", "other"];

export default async function Page() {
  const { session } = await getTenantContext();
  const info = await repo.getBuildingInfo(session.buildingId);

  return (
    <div className="space-y-5">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">מידע הבניין</h1>
        <p className="mt-1 text-sm text-muted">כל מה שצריך לדעת: טלפונים, קודים, חדרים ומתקנים.</p>
        {info?.whatsappUrl && <a href={info.whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-brand mt-4 w-full"><MessageCircle size={16} /> הצטרפות לקבוצת WhatsApp</a>}
      </section>

      <section className="fade-up">
        <SectionHeader title="אנשי קשר" />
        {info?.contacts?.length ? (
          <div className="space-y-4">
            {categories.map((category) => {
              const contacts = info.contacts.filter((c) => c.category === category);
              if (!contacts.length) return null;
              return (
                <Card key={category} className="p-4" as="section">
                  <h2 className="mb-3 text-sm font-black text-muted">{contactCategoryLabel(category)}</h2>
                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <a href={telHref(contact.phone)} key={contact.id} className="tap flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
                        <CategoryIcon category={contact.category} />
                        <div className="min-w-0 flex-1"><p className="font-bold">{contact.name}</p><p className="text-xs text-muted">{contact.role}</p></div>
                        <span className="flex items-center gap-1 text-sm font-bold text-brand" dir="ltr"><PhoneCall size={14} /> {contact.phone}</span>
                      </a>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : <Card><EmptyState icon={<PhoneCall size={24} />} title="אין אנשי קשר" sub="חברת הניהול יכולה להוסיף אנשי קשר לכל קטגוריה." /></Card>}
      </section>

      <section className="fade-up">
        <SectionHeader title="קודים וכניסות" />
        {info?.codes?.length ? (
          <div className="space-y-3">
            {info.codes.map((code) => (
              <Card key={code.id} className="p-4" as="article">
                <div className="flex items-start gap-3">
                  <IconTile tone="brand"><NamedIcon name={code.icon} /></IconTile>
                  <div className="min-w-0 flex-1"><h2 className="font-black">{code.label}</h2>{code.note && <p className="mt-1 text-xs text-muted">{code.note}</p>}<div className="mt-3"><CodeChip code={code.code} /></div></div>
                </div>
              </Card>
            ))}
          </div>
        ) : <Card><EmptyState icon={<UnlockKeyhole size={24} />} title="אין קודים שמורים" sub="קודים יוצגו כאן לאחר שיוגדרו לנכס." /></Card>}
      </section>

      <section className="fade-up">
        <SectionHeader title="חדרים ומתקנים" />
        {info?.facilities?.length ? (
          <div className="space-y-3">
            {info.facilities.map((f) => (
              <Card key={f.id} className="p-4" as="article">
                <div className="flex items-start gap-3">
                  <IconTile tone={f.bookable ? "info" : "plain"}><NamedIcon name={f.icon} /></IconTile>
                  <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-black">{f.name}</h2>{f.bookable && <Badge tone="info">ניתן להזמנה</Badge>}</div>{f.description && <p className="mt-1 text-sm text-muted">{f.description}</p>}<div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">{f.hours && <span className="rounded-full bg-surface-2 px-2 py-1">שעות: {f.hours}</span>}{f.responsible && <span className="rounded-full bg-surface-2 px-2 py-1">אחראי: {f.responsible}</span>}</div></div>
                </div>
              </Card>
            ))}
          </div>
        ) : <Card><EmptyState icon={<NamedIcon name="Building2" size={24} />} title="אין מתקנים להצגה" /></Card>}
      </section>
    </div>
  );
}
