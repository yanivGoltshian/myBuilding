import { CalendarDays, DoorOpen, FileText, Landmark, LogOut, MessageCircle, PhoneCall, Sparkles, UserRound } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { Avatar, Card, IconTile, SectionHeader } from "@/components/ui/base";
import { repo } from "@/lib/repo";
import { ActionTile, getTenantContext, NamedIcon, telHref } from "../../_components/tenant-ui";

export const metadata = { title: "עוד" };

export default async function Page() {
  const { session, building } = await getTenantContext();
  const [info, gates] = await Promise.all([repo.getBuildingInfo(session.buildingId), repo.getGatesByBuilding(session.buildingId)]);

  return (
    <div className="space-y-5">
      <Card className="fade-up p-4" as="section">
        <div className="flex items-center gap-3">
          <Avatar name={session.name} size={56} />
          <div className="min-w-0 flex-1"><h1 className="text-xl font-black">{session.name}</h1><p className="text-sm text-muted" dir="ltr">{session.phone}</p><p className="text-xs text-muted">{building?.name}</p></div>
          <IconTile tone="plain"><UserRound size={18} /></IconTile>
        </div>
      </Card>

      <section className="fade-up">
        <SectionHeader title="כלים ושירותים" />
        <div className="grid grid-cols-2 gap-3">
          <ActionTile href="/app/assistant" icon={<Sparkles size={18} />} label="עוזר חכם" sub="שאלו כל דבר על הבניין" />
          <ActionTile href="/app/more/info" icon={<PhoneCall size={18} />} label="מידע ואנשי קשר" sub="טלפונים וקודים" />
          {info?.whatsappUrl && <ActionTile href={info.whatsappUrl} icon={<MessageCircle size={18} />} label="קבוצת WhatsApp" sub="פתיחה חיצונית" external />}
          {building?.roomBookingEnabled && <ActionTile href="/app/more/room" icon={<CalendarDays size={18} />} label="הזמנת חדר" sub="יומן דיירים" />}
          <ActionTile href="/app/more/transparency" icon={<Landmark size={18} />} label="שקיפות כספית" sub="דוחות ועד" />
          <ActionTile href="/app/more/docs" icon={<FileText size={18} />} label="מסמכים" sub="תקנון וטפסים" />
          {gates.map((gate) => <ActionTile key={gate.id} href={telHref(gate.dialerPhone)} icon={<DoorOpen size={18} />} label={`פתיחת ${gate.name}`} sub="חיוג מהיר" external />)}
        </div>
      </section>

      {info?.facilities?.length ? (
        <section className="fade-up">
          <SectionHeader title="מתקני הבניין" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {info.facilities.slice(0, 6).map((f) => (
              <a key={f.id} href="/app/more/info" className="tap flex shrink-0 items-center gap-2 rounded-full bg-surface-2 px-3 py-2 text-sm font-bold"><NamedIcon name={f.icon} size={15} /> {f.name}</a>
            ))}
          </div>
        </section>
      ) : null}

      <Card className="fade-up p-4" as="section">
        <form action={logoutAction}>
          <button className="btn w-full border border-danger/25 bg-surface text-danger" type="submit"><LogOut size={16} /> התנתקות</button>
        </form>
      </Card>
    </div>
  );
}
