import { CalendarDays, Plus } from "lucide-react";
import { createBookingAction } from "@/app/actions";
import { Card, EmptyState, SectionHeader } from "@/components/ui/base";
import { fmtDate } from "@/lib/format";
import { repo } from "@/lib/repo";
import { dateTimeValue, getTenantContext } from "../../../_components/tenant-ui";

export const metadata = { title: "הזמנת חדר" };

export default async function Page() {
  const { session, building } = await getTenantContext();
  const bookings = (await repo.getBookingsByBuilding(session.buildingId)).filter((b) => dateTimeValue(b.date, b.time) >= Date.now()).sort((a, b) => dateTimeValue(a.date, a.time) - dateTimeValue(b.date, b.time));

  if (!building?.roomBookingEnabled) {
    return <Card className="fade-up p-5"><EmptyState icon={<CalendarDays size={24} />} title="חדר דיירים לא מופעל" sub="בבניין הזה עדיין לא הופעלה מערכת הזמנת חדרים." /></Card>;
  }

  return (
    <div className="space-y-4">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">הזמנת חדר דיירים</h1>
        <p className="mt-1 text-sm text-muted">בודקים זמינות ומשריינים שימוש בחדר המשותף.</p>
      </section>

      <Card className="fade-up p-4" as="section">
        <SectionHeader title="בקשת הזמנה" />
        <form action={createBookingAction} className="space-y-3">
          <div className="grid grid-cols-2 gap-3"><div><label className="label" htmlFor="date">תאריך</label><input id="date" name="date" type="date" className="input" required dir="ltr" /></div><div><label className="label" htmlFor="time">שעה</label><input id="time" name="time" type="time" className="input" required dir="ltr" /></div></div>
          <div><label className="label" htmlFor="subject">מטרת ההזמנה</label><input id="subject" name="subject" className="input" placeholder="יום הולדת, ישיבת ועד, מפגש שכנים" /></div>
          <button className="btn btn-brand w-full" type="submit"><Plus size={16} /> שריין חדר</button>
        </form>
      </Card>

      <section className="fade-up">
        <SectionHeader title="הזמנות קרובות" />
        {bookings.length ? <div className="space-y-2">{bookings.map((b) => <Card key={b.id} className="p-4"><div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-center"><span className="text-xs text-muted">{fmtDate(b.date).slice(0, 5)}</span><span className="text-sm font-black" dir="ltr">{b.time}</span></div><div><p className="font-black">{b.subject}</p><p className="text-xs text-muted">{b.residentName}</p></div></div></Card>)}</div> : <EmptyState icon={<CalendarDays size={24} />} title="אין הזמנות קרובות" sub="היומן פנוי כרגע." />}
      </section>
    </div>
  );
}
