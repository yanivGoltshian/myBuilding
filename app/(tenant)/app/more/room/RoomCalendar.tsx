"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, CreditCard, Loader2 } from "lucide-react";
import { createBookingAction } from "@/app/actions";
import { fmtILS } from "@/lib/format";
import type { RoomBooking } from "@/lib/types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const HE_WEEKDAY = new Intl.DateTimeFormat("he-IL", { weekday: "short" });

export function RoomCalendar({
  bookings,
  fee,
  startHour = 8,
  endHour = 22,
}: {
  bookings: RoomBooking[];
  fee: number;
  startHour?: number;
  endHour?: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const days = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, i) => startHour + i),
    [startHour, endHour]
  );

  const [selectedDate, setSelectedDate] = useState(() => ymd(days[0]));
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [pay, setPay] = useState(fee > 0);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const takenHours = useMemo(() => {
    const set = new Set<number>();
    for (const b of bookings) {
      if (b.date === selectedDate) set.add(parseInt(b.time.slice(0, 2), 10));
    }
    return set;
  }, [bookings, selectedDate]);

  const now = new Date();
  const todayYmd = ymd(now);

  function submit() {
    if (selectedHour == null) return;
    const fd = new FormData();
    fd.set("date", selectedDate);
    fd.set("time", `${pad(selectedHour)}:00`);
    fd.set("subject", subject.trim());
    if (pay && fee > 0) fd.set("pay", "on");
    startTransition(async () => {
      const res = await createBookingAction(fd);
      if (res.ok) {
        setMsg({
          ok: true,
          text: res.paid
            ? "החדר שוריין והתשלום נקלט. נתראה!"
            : "החדר שוריין בהצלחה!",
        });
        setSelectedHour(null);
        setSubject("");
        router.refresh();
      } else {
        setMsg({ ok: false, text: res.error });
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* day strip */}
      <div>
        <p className="label mb-2">בחירת יום</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {days.map((d, i) => {
            const key = ymd(d);
            const active = key === selectedDate;
            const label = i === 0 ? "היום" : i === 1 ? "מחר" : HE_WEEKDAY.format(d);
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedDate(key);
                  setSelectedHour(null);
                  setMsg(null);
                }}
                className="tap flex min-w-[3.5rem] flex-col items-center gap-0.5 rounded-2xl border px-2 py-2 transition-colors"
                style={{
                  borderColor: active ? "var(--brand)" : "var(--border)",
                  background: active
                    ? "color-mix(in srgb, var(--brand) 13%, transparent)"
                    : "var(--surface)",
                  color: active ? "var(--brand)" : "var(--text)",
                }}
              >
                <span className="text-[11px] font-medium text-muted">{label}</span>
                <span className="text-lg font-black leading-none">{d.getDate()}</span>
                <span className="text-[10px] text-faint">{pad(d.getMonth() + 1)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* time slots */}
      <div>
        <p className="label mb-2">בחירת שעה</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {hours.map((h) => {
            const taken = takenHours.has(h);
            const past =
              selectedDate === todayYmd && h <= now.getHours();
            const disabled = taken || past;
            const active = selectedHour === h;
            return (
              <button
                key={h}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setSelectedHour(h);
                  setMsg(null);
                }}
                className="tap rounded-xl border py-2.5 text-sm font-bold transition-all"
                style={{
                  borderColor: active ? "var(--brand)" : "var(--border)",
                  background: active
                    ? "var(--brand)"
                    : disabled
                      ? "var(--surface-2)"
                      : "var(--surface)",
                  color: active
                    ? "#fff"
                    : disabled
                      ? "var(--faint)"
                      : "var(--text)",
                  textDecoration: taken ? "line-through" : "none",
                  opacity: disabled ? 0.6 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                }}
              >
                {pad(h)}:00
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-faint">משבצת פנויה = לבן · תפוס/עבר = מושבת · כל שריון הוא לשעה.</p>
      </div>

      {/* subject */}
      <div>
        <label className="label" htmlFor="subject">מטרת ההזמנה</label>
        <input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input"
          placeholder="יום הולדת, ישיבת ועד, מפגש שכנים"
        />
      </div>

      {/* fee + pay */}
      {fee > 0 ? (
        <label
          className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border bg-surface-2 p-3"
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <CreditCard size={18} className="text-brand" />
            עלות שימוש: {fmtILS(fee)}
          </span>
          <span className="flex items-center gap-2 text-xs font-bold text-muted">
            לשלם עכשיו
            <input
              type="checkbox"
              checked={pay}
              onChange={(e) => setPay(e.target.checked)}
              className="h-5 w-5 accent-[var(--brand)]"
            />
          </span>
        </label>
      ) : (
        <p className="rounded-2xl bg-surface-2 p-3 text-center text-sm font-bold text-muted">השימוש בחדר ללא תשלום</p>
      )}

      {msg && (
        <div
          className="flex items-center gap-2 rounded-2xl p-3 text-sm font-bold"
          style={{
            background: msg.ok
              ? "color-mix(in srgb, #16a34a 14%, transparent)"
              : "color-mix(in srgb, #dc2626 14%, transparent)",
            color: msg.ok ? "#16a34a" : "#dc2626",
          }}
        >
          {msg.ok ? <Check size={16} /> : <CalendarDays size={16} />}
          {msg.text}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={pending || selectedHour == null}
        className="btn btn-brand w-full"
        style={{ opacity: selectedHour == null ? 0.6 : 1 }}
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : <CalendarDays size={16} />}
        {selectedHour == null
          ? "בחרו יום ושעה"
          : pay && fee > 0
            ? `שריון ותשלום ${fmtILS(fee)}`
            : "שריין חדר"}
      </button>
    </div>
  );
}
