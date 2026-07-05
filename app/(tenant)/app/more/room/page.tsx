import { CalendarDays } from "lucide-react";
import { Card, EmptyState, SectionHeader } from "@/components/ui/base";
import { fmtDate, fmtILS } from "@/lib/format";
import { repo } from "@/lib/repo";
import { dateTimeValue, getTenantContext } from "../../../_components/tenant-ui";
import { RoomCalendar } from "./RoomCalendar";

export const metadata = { title: "הזמנת חדר" };

function parseHours(hours?: string): { start: number; end: number } {
  const m = hours?.match(/(\d{1,2}):\d{2}\D+(\d{1,2}):\d{2}/);
  if (m) return { start: Number(m[1]), end: Number(m[2]) };
  return { start: 8, end: 22 };
}

export default async function Page() {
  const { session, building } = await getTenantContext();
  const [allBookings, info] = await Promise.all([
    repo.getBookingsByBuilding(session.buildingId),
    repo.getBuildingInfo(session.buildingId),
  ]);
  const upcoming = allBookings
    .filter((b) => dateTimeValue(b.date, b.time) >= Date.now())
    .sort((a, b) => dateTimeValue(a.date, a.time) - dateTimeValue(b.date, b.time));

  if (!building?.roomBookingEnabled) {
    return <Card className="fade-up p-5"><EmptyState icon={<CalendarDays size={24} />} title="חדר דיירים לא מופעל" sub="בבניין הזה עדיין לא הופעלה מערכת הזמנת חדרים." /></Card>;
  }

  const bookable = info?.facilities.find((f) => f.bookable);
  const { start, end } = parseHours(bookable?.hours);
  const fee = building.roomBookingFee ?? 0;

  return (
    <div className="space-y-4">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">הזמנת חדר דיירים</h1>
        <p className="mt-1 text-sm text-muted">בוחרים יום ושעה פנויים ביומן ומשריינים בקליק{fee > 0 ? ` · עלות ${fmtILS(fee)}` : " · ללא עלות"}.</p>
      </section>

      <Card className="fade-up p-4" as="section">
        <SectionHeader title="יומן זמינות" />
        <RoomCalendar bookings={upcoming} fee={fee} startHour={start} endHour={end} />
      </Card>

      <section className="fade-up">
        <SectionHeader title="הזמנות קרובות" />
        {upcoming.length ? <div className="space-y-2">{upcoming.map((b) => <Card key={b.id} className="p-4"><div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-center"><span className="text-xs text-muted">{fmtDate(b.date).slice(0, 5)}</span><span className="text-sm font-black" dir="ltr">{b.time}</span></div><div className="min-w-0 flex-1"><p className="font-black">{b.subject}</p><p className="text-xs text-muted">{b.residentName}</p></div>{b.fee ? <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: b.paid ? "color-mix(in srgb, #16a34a 14%, transparent)" : "var(--surface-2)", color: b.paid ? "#16a34a" : "var(--muted)" }}>{b.paid ? "שולם" : "ממתין לתשלום"}</span> : null}</div></Card>)}</div> : <EmptyState icon={<CalendarDays size={24} />} title="אין הזמנות קרובות" sub="היומן פנוי כרגע." />}
      </section>
    </div>
  );
}
