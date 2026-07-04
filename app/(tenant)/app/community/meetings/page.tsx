import Link from "next/link";
import { CalendarDays, ChevronLeft, ClipboardList } from "lucide-react";
import { Card, EmptyState, IconTile, SectionHeader } from "@/components/ui/base";
import { fmtDate } from "@/lib/format";
import { repo } from "@/lib/repo";
import { dateTimeValue, getTenantContext, MeetingStatusBadge } from "../../../_components/tenant-ui";

export const metadata = { title: "אסיפות דיירים" };

export default async function Page() {
  const { session } = await getTenantContext();
  const meetings = await repo.getMeetingsByBuilding(session.buildingId);
  const now = Date.now();
  const upcoming = meetings.filter((m) => m.status === "scheduled" && dateTimeValue(m.date, m.time) >= now).sort((a, b) => dateTimeValue(a.date, a.time) - dateTimeValue(b.date, b.time));
  const archive = meetings.filter((m) => m.status === "held" || dateTimeValue(m.date, m.time) < now).sort((a, b) => dateTimeValue(b.date, b.time) - dateTimeValue(a.date, a.time));

  return (
    <div className="space-y-5">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">אסיפות דיירים</h1>
        <p className="mt-1 text-sm text-muted">כל הזימונים, סדרי היום והפרוטוקולים במקום אחד.</p>
      </section>

      <MeetingList title="אסיפות קרובות" meetings={upcoming} empty="אין אסיפות קרובות כרגע" />
      <MeetingList title="ארכיון אסיפות" meetings={archive} empty="אין פרוטוקולים בארכיון" />
    </div>
  );
}

function MeetingList({ title, meetings, empty }: { title: string; meetings: Awaited<ReturnType<typeof repo.getMeetingsByBuilding>>; empty: string }) {
  return (
    <section className="fade-up">
      <SectionHeader title={title} />
      {meetings.length ? (
        <div className="space-y-2">
          {meetings.map((m) => (
            <Link key={m.id} href={`/app/community/meetings/${m.id}`} className="card card-hover tap flex items-center gap-3 p-4">
              <IconTile tone={m.status === "held" ? "success" : "info"}><CalendarDays size={18} /></IconTile>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate font-black">{m.title}</p><MeetingStatusBadge status={m.status} /></div><p className="mt-1 text-xs text-muted">{fmtDate(m.date)} · {m.time} · {m.location}</p><p className="mt-1 text-xs text-faint">{m.attendance ? `${m.attendance} דירות השתתפו` : m.quorum ? `קוורום נדרש: ${m.quorum} דירות` : "סדר יום זמין"}</p></div>
              <ChevronLeft className="text-faint" size={18} />
            </Link>
          ))}
        </div>
      ) : <Card><EmptyState icon={<ClipboardList size={24} />} title={empty} /></Card>}
    </section>
  );
}
