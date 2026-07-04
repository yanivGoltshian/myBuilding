import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle, ClipboardList, MapPin, Vote } from "lucide-react";
import { Badge, Card, IconTile, SectionHeader } from "@/components/ui/base";
import { ProgressRing } from "@/components/ui/charts";
import { fmtDate } from "@/lib/format";
import { repo } from "@/lib/repo";
import { MeetingStatusBadge } from "../../../../_components/tenant-ui";

export const metadata = { title: "פרוטוקול אסיפה" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meeting = await repo.getMeeting(id);
  if (!meeting) notFound();
  const ratio = meeting.attendance && meeting.quorum ? Math.min(meeting.attendance / meeting.quorum, 1) : 0;

  return (
    <div className="space-y-4">
      <Card className="fade-up p-5" as="section">
        <div className="flex items-start justify-between gap-3">
          <div>
            <MeetingStatusBadge status={meeting.status} />
            <h1 className="mt-3 text-3xl font-black tracking-tight">{meeting.title}</h1>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted"><CalendarDays size={15} /> {fmtDate(meeting.date)} · {meeting.time}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin size={15} /> {meeting.location}</p>
          </div>
          {meeting.status === "held" && meeting.quorum && meeting.attendance && (
            <ProgressRing value={ratio} size={78} thickness={8}>{meeting.attendance}/{meeting.quorum}</ProgressRing>
          )}
        </div>
      </Card>

      <Card className="fade-up p-4" as="section">
        <SectionHeader title="סדר היום" />
        <ol className="space-y-2">
          {meeting.agenda.map((item, i) => (
            <li key={item} className="flex gap-3 rounded-2xl bg-surface-2 p-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-sm font-black text-brand-ink">{i + 1}</span><span className="pt-1 text-sm font-semibold">{item}</span></li>
          ))}
        </ol>
      </Card>

      {meeting.status === "held" && (
        <>
          <Card className="fade-up p-4" as="section">
            <SectionHeader title="נוכחות וקוורום" />
            <div className="rounded-2xl bg-surface-2 p-4">
              <div className="flex items-center justify-between text-sm font-bold"><span>{meeting.attendance ?? 0} דירות נכחו</span><span>קוורום: {meeting.quorum ?? "לא הוגדר"}</span></div>
              {meeting.quorum && <div className="progress-track mt-3"><div className="progress-fill" style={{ width: `${Math.min(((meeting.attendance ?? 0) / meeting.quorum) * 100, 100)}%` }} /></div>}
            </div>
          </Card>

          {meeting.summary && (
            <Card className="fade-up p-4" as="section">
              <SectionHeader title="פרוטוקול" />
              <p className="text-sm leading-7 text-muted">{meeting.summary}</p>
            </Card>
          )}

          <Card className="fade-up p-4" as="section">
            <SectionHeader title="החלטות שהתקבלו" />
            {meeting.decisions.length ? <div className="space-y-2">{meeting.decisions.map((d) => <div key={d.topic} className="flex gap-3 rounded-2xl bg-surface-2 p-3"><IconTile tone="success" className="!h-9 !w-9"><CheckCircle size={17} /></IconTile><div><p className="font-bold">{d.topic}</p><p className="text-sm text-muted">{d.outcome}</p></div></div>)}</div> : <p className="text-sm text-muted">לא תועדו החלטות.</p>}
          </Card>
        </>
      )}

      {meeting.status === "scheduled" && (
        <Card className="fade-up p-4" as="section">
          <div className="flex items-center gap-3"><IconTile tone="info"><ClipboardList size={18} /></IconTile><div><p className="font-black">האסיפה טרם התקיימה</p><p className="text-sm text-muted">לאחר האסיפה יופיע כאן הפרוטוקול וההחלטות.</p></div></div>
        </Card>
      )}

      {meeting.pollId && (
        <Link href="/app/community" className="card card-hover tap fade-up flex items-center justify-between p-4">
          <span className="flex items-center gap-3"><IconTile tone="brand"><Vote size={18} /></IconTile><span><span className="block font-black">הצבעה דיגיטלית קשורה</span><span className="text-xs text-muted">עברו לקהילה כדי להצביע או לראות תוצאות</span></span></span>
          <Badge tone="brand">פתיחה</Badge>
        </Link>
      )}
    </div>
  );
}
