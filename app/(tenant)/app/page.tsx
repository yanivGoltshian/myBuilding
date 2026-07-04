import Link from "next/link";
import { CalendarDays, CheckCircle, Landmark, MessageCircle, PhoneCall, Vote, Wrench } from "lucide-react";
import { payDuesAction, reactAction } from "@/app/actions";
import { Badge, Card, IconTile, SectionHeader } from "@/components/ui/base";
import { ProgressRing } from "@/components/ui/charts";
import { fmtILS, greeting, relativeTime } from "@/lib/format";
import { repo } from "@/lib/repo";
import { unitBalance } from "@/lib/finance";
import { AnnouncementBadge, dateTimeValue, getTenantContext, telHref, yearlyProgress } from "../_components/tenant-ui";

export const metadata = { title: "בית" };

export default async function Page() {
  const { session, building } = await getTenantContext();
  const [payments, announcements, meetings, events, polls, gates] = await Promise.all([
    session.unitId ? repo.getPaymentsByUnit(session.unitId) : Promise.resolve([]),
    repo.getAnnouncementsByBuilding(session.buildingId),
    repo.getMeetingsByBuilding(session.buildingId),
    repo.getEventsByBuilding(session.buildingId),
    repo.getPollsByBuilding(session.buildingId),
    repo.getGatesByBuilding(session.buildingId),
  ]);

  const balance = unitBalance(payments);
  const progress = yearlyProgress(payments);
  const openPayment = payments.find((p) => p.status !== "paid");
  const announcement = announcements[0];
  const now = Date.now();
  const nextMeeting = meetings.filter((m) => m.status === "scheduled" && dateTimeValue(m.date, m.time) >= now).sort((a, b) => dateTimeValue(a.date, a.time) - dateTimeValue(b.date, b.time))[0];
  const nextEvent = events.filter((e) => dateTimeValue(e.date, e.time) >= now).sort((a, b) => dateTimeValue(a.date, a.time) - dateTimeValue(b.date, b.time))[0];
  const nextThing = [
    nextMeeting && { title: nextMeeting.title, date: `${nextMeeting.date}T${nextMeeting.time}:00`, location: nextMeeting.location, href: `/app/community/meetings/${nextMeeting.id}` },
    nextEvent && { title: nextEvent.title, date: `${nextEvent.date}T${nextEvent.time}:00`, location: nextEvent.location, href: "/app/community" },
  ].filter(Boolean).sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime())[0];
  const activePoll = polls.find((p) => new Date(p.closesAt).getTime() > now);
  const gate = gates[0];

  return (
    <div className="space-y-4">
      <section className="fade-up pt-1">
        <p className="text-sm text-muted">{building?.name}</p>
        <h1 className="text-3xl font-black tracking-tight">{greeting(session.name)}</h1>
      </section>

      <Card className="fade-up overflow-hidden p-5 brand-gradient text-brand-ink" as="section">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm/6 opacity-85">המצב שלי בוועד</p>
            <h2 className="mt-1 text-3xl font-black">{balance > 0 ? fmtILS(balance) : "הכול שולם"}</h2>
            <p className="mt-1 text-sm opacity-85">{balance > 0 ? "יתרה פתוחה לדירה שלך" : "תודה, הדירה שלך מעודכנת"}</p>
          </div>
          <ProgressRing value={progress} color="white" size={74} thickness={8}>
            {Math.round(progress * 100)}%
          </ProgressRing>
        </div>
        <div className="mt-5 flex items-center gap-2">
          {balance > 0 && openPayment ? (
            <form action={payDuesAction} className="flex-1">
              <input type="hidden" name="period" value={openPayment.period} />
              <button className="btn w-full bg-white text-text shadow-sm" type="submit">שלם עכשיו</button>
            </form>
          ) : (
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/16 px-4 py-3 text-sm font-bold"><CheckCircle size={18} /> אין חובות פתוחים</div>
          )}
          <Link href="/app/payments" className="btn bg-white/16 text-brand-ink">פירוט</Link>
        </div>
      </Card>

      <section className="fade-up">
        <SectionHeader title="פעולות מהירות" />
        <div className="grid grid-cols-2 gap-3">
          <Link href="/app/service" className="card card-hover tap p-4"><IconTile tone="warning"><Wrench size={18} /></IconTile><p className="mt-3 font-bold">קריאת שירות</p><p className="text-xs text-muted">דיווח מהיר לוועד</p></Link>
          <Link href="/app/community" className="card card-hover tap p-4"><IconTile tone="brand"><MessageCircle size={18} /></IconTile><p className="mt-3 font-bold">קהילה</p><p className="text-xs text-muted">עדכונים והצבעות</p></Link>
          {building?.roomBookingEnabled && <Link href="/app/more/room" className="card card-hover tap p-4"><IconTile tone="info"><CalendarDays size={18} /></IconTile><p className="mt-3 font-bold">הזמנת חדר</p><p className="text-xs text-muted">חדר הדיירים</p></Link>}
          <Link href="/app/more/transparency" className="card card-hover tap p-4"><IconTile tone="success"><Landmark size={18} /></IconTile><p className="mt-3 font-bold">לאן הכסף</p><p className="text-xs text-muted">שקיפות מלאה</p></Link>
        </div>
      </section>

      {announcement && (
        <Card className="fade-up p-4" as="article">
          <div className="mb-3 flex items-center justify-between"><AnnouncementBadge category={announcement.category} />{announcement.pinned && <Badge tone="brand">נעוץ</Badge>}</div>
          <Link href="/app/community" className="tap block">
            <h2 className="text-lg font-black">{announcement.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted">{announcement.body}</p>
          </Link>
          <form action={reactAction} className="mt-4 flex items-center justify-between text-xs text-muted">
            <span>{announcement.author} · {relativeTime(announcement.date)}</span>
            <input type="hidden" name="id" value={announcement.id} />
            <button className="tap inline-flex items-center gap-1 font-bold text-brand" type="submit">❤ {announcement.reactions}</button>
          </form>
        </Card>
      )}

      {nextThing && (
        <Link href={nextThing.href} className="card card-hover tap fade-up flex items-center gap-3 p-4">
          <IconTile tone="info"><CalendarDays size={18} /></IconTile>
          <div className="min-w-0 flex-1"><p className="font-black">{nextThing.title}</p><p className="text-xs text-muted">{relativeTime(nextThing.date)} · {nextThing.location}</p></div>
        </Link>
      )}

      {activePoll && (
        <Link href="/app/community" className="card card-hover tap fade-up block p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand"><Vote size={16} /> הצבעה פתוחה</div>
          <p className="mt-2 text-lg font-black">{activePoll.question}</p>
          <p className="mt-1 text-xs text-muted">נסגרת {relativeTime(activePoll.closesAt)}</p>
        </Link>
      )}

      {gate && (
        <Card className="fade-up p-4" as="section">
          <div className="flex items-center justify-between gap-3">
            <div><p className="font-black">פתיחת {gate.name}</p><p className="text-xs text-muted">חיוג מהיר מהטלפון הרשום</p></div>
            <a href={telHref(gate.dialerPhone)} className="btn btn-brand"><PhoneCall size={16} /> חייג</a>
          </div>
        </Card>
      )}
    </div>
  );
}
