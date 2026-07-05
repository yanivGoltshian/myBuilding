"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Check, Vote } from "lucide-react";
import { votePollAction } from "@/app/actions";
import { Card, IconTile } from "@/components/ui/base";
import { relativeTime } from "@/lib/format";
import type { Poll } from "@/lib/types";

export function PollCard({ poll }: { poll: Poll }) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, addVote] = useOptimistic(
    poll.options,
    (opts, optionId: string) =>
      opts.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
  );
  const [chosen, setChosen] = useState<string | null>(null);
  const voted = chosen !== null;
  const total = optimistic.reduce((s, o) => s + o.votes, 0) || 1;

  function vote(optionId: string) {
    if (voted || isPending) return;
    const fd = new FormData();
    fd.set("pollId", poll.id);
    fd.set("optionId", optionId);
    setChosen(optionId);
    startTransition(async () => {
      addVote(optionId);
      await votePollAction(fd);
    });
  }

  return (
    <Card className="p-4" as="article">
      <div className="flex items-start gap-3">
        <IconTile tone="brand"><Vote size={18} /></IconTile>
        <div className="min-w-0 flex-1">
          <h2 className="font-black">{poll.question}</h2>
          {poll.description && <p className="mt-1 text-sm text-muted">{poll.description}</p>}
          <p className="mt-2 text-xs text-brand">נסגר {relativeTime(poll.closesAt)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {optimistic.map((option) => {
          const pct = Math.round((option.votes / total) * 100);
          const isChosen = chosen === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => vote(option.id)}
              disabled={voted}
              aria-pressed={isChosen}
              className={`poll-opt tap ${isChosen ? "poll-opt-chosen poll-pop" : ""}`}
            >
              <span
                className="poll-fill"
                style={{ width: voted ? `${pct}%` : "0%" }}
                aria-hidden
              />
              <span className="poll-opt-row">
                <span className="flex items-center gap-2 font-bold">
                  {isChosen && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-ink">
                      <Check size={13} />
                    </span>
                  )}
                  {option.label}
                </span>
                <span
                  className="text-sm font-bold tabular-nums transition-opacity duration-500"
                  style={{ opacity: voted ? 1 : 0.35, color: isChosen ? "var(--brand)" : "var(--muted)" }}
                >
                  {voted ? `${pct}%` : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        {voted ? `תודה על ההצבעה · ${total} מצביעים` : "בחרו תשובה כדי לראות תוצאות"}
      </p>
    </Card>
  );
}
