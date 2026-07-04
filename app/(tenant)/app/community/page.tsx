import Link from "next/link";
import { Heart, MessageCircle, Users, Vote } from "lucide-react";
import { reactAction, votePollAction } from "@/app/actions";
import { Card, EmptyState, IconTile, SectionHeader } from "@/components/ui/base";
import { relativeTime } from "@/lib/format";
import { repo } from "@/lib/repo";
import { AnnouncementBadge, getTenantContext } from "../../_components/tenant-ui";

export const metadata = { title: "קהילה" };

export default async function Page() {
  const { session } = await getTenantContext();
  const [polls, announcements] = await Promise.all([
    repo.getPollsByBuilding(session.buildingId),
    repo.getAnnouncementsByBuilding(session.buildingId),
  ]);
  const now = Date.now();
  const activePolls = polls.filter((p) => new Date(p.closesAt).getTime() > now);

  return (
    <div className="space-y-5">
      <section className="fade-up">
        <h1 className="text-3xl font-black tracking-tight">קהילת הבניין</h1>
        <p className="mt-1 text-sm text-muted">עדכונים, הצבעות ושיח דיירים במקום אחד.</p>
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          <Link href="/app/community/market" className="btn btn-outline whitespace-nowrap">לוח יד2</Link>
          <Link href="/app/community/meetings" className="btn btn-outline whitespace-nowrap">אסיפות דיירים</Link>
        </div>
      </section>

      <section className="fade-up">
        <SectionHeader title="הצבעות פתוחות" />
        {activePolls.length ? (
          <div className="space-y-3">
            {activePolls.map((poll) => {
              const total = poll.options.reduce((s, o) => s + o.votes, 0) || 1;
              return (
                <Card key={poll.id} className="p-4" as="article">
                  <div className="flex items-start gap-3">
                    <IconTile tone="brand"><Vote size={18} /></IconTile>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-black">{poll.question}</h2>
                      {poll.description && <p className="mt-1 text-sm text-muted">{poll.description}</p>}
                      <p className="mt-2 text-xs text-brand">נסגר {relativeTime(poll.closesAt)}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {poll.options.map((option) => {
                      const pct = Math.round((option.votes / total) * 100);
                      return (
                        <form action={votePollAction} key={option.id}>
                          <input type="hidden" name="pollId" value={poll.id} />
                          <input type="hidden" name="optionId" value={option.id} />
                          <button className="tap w-full rounded-2xl border border-border bg-surface p-3 text-right" type="submit">
                            <span className="flex items-center justify-between gap-3 text-sm font-bold"><span>{option.label}</span><span className="text-muted">{option.votes} · {pct}%</span></span>
                            <span className="progress-track mt-2 block"><span className="progress-fill block" style={{ width: `${pct}%` }} /></span>
                          </button>
                        </form>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : <EmptyState icon={<Vote size={24} />} title="אין הצבעות פתוחות" sub="כשוועד הבית יפתח הצבעה היא תופיע כאן." />}
      </section>

      <section className="fade-up">
        <SectionHeader title="עדכונים מהוועד" />
        {announcements.length ? (
          <div className="space-y-3">
            {announcements.map((a) => (
              <Card key={a.id} className="p-4" as="article">
                <div className="flex items-center justify-between gap-3"><AnnouncementBadge category={a.category} />{a.pinned && <span className="text-xs font-bold text-brand">נעוץ</span>}</div>
                <h2 className="mt-3 text-lg font-black">{a.title}</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{a.body}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                  <span>{a.author} · {relativeTime(a.date)}</span>
                  <div className="flex items-center gap-3">
                    <form action={reactAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="tap inline-flex items-center gap-1 font-bold text-brand" type="submit"><Heart size={14} /> {a.reactions}</button>
                    </form>
                    <span className="inline-flex items-center gap-1"><MessageCircle size={14} /> {a.comments}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : <EmptyState icon={<Users size={24} />} title="עדיין אין עדכונים" sub="העדכונים מהוועד יוצגו כאן." />}
      </section>
    </div>
  );
}
