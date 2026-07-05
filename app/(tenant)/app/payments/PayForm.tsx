"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CalendarClock, CreditCard, Landmark, ScrollText, ShieldCheck } from "lucide-react";
import { payDuesAction } from "@/app/actions";
import { PAYMENT_METHOD_META } from "@/lib/payments";
import type { PaymentMethod } from "@/lib/types";

const ICONS: Record<PaymentMethod, typeof CreditCard> = {
  credit: CreditCard,
  standing_order: CalendarClock,
  check: ScrollText,
  bank_transfer: Landmark,
};

function PayButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-brand w-full" type="submit" disabled={pending}>
      {pending ? "מעבד תשלום..." : (<><CreditCard size={17} /> {label}</>)}
    </button>
  );
}

export function PayForm({
  period,
  methods,
  label = "שלם דמי ועד",
}: {
  period: string;
  methods: PaymentMethod[];
  label?: string;
}) {
  const list = methods.length ? methods : (["credit"] as PaymentMethod[]);
  const [selected, setSelected] = useState<PaymentMethod>(list[0]);

  return (
    <form action={payDuesAction} className="mt-5 space-y-3">
      <input type="hidden" name="period" value={period} />
      <input type="hidden" name="method" value={selected} />
      {list.length > 1 && (
        <div className="space-y-2">
          <span className="label">בחירת אמצעי תשלום</span>
          <div className="grid grid-cols-2 gap-2">
            {list.map((m) => {
              const meta = PAYMENT_METHOD_META[m];
              const Icon = ICONS[m];
              const active = selected === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelected(m)}
                  className={`pay-method tap ${active ? "pay-method-on" : ""}`}
                  aria-pressed={active}
                >
                  <span className="pay-method-icon"><Icon size={18} /></span>
                  <span className="min-w-0 text-right">
                    <span className="block truncate text-sm font-black">{meta.label}</span>
                    <span className="block truncate text-[11px] text-muted">{meta.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <PayButton label={label} />
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
        <ShieldCheck size={13} /> תשלום מאובטח · הנתונים אינם נשמרים במכשיר
      </p>
    </form>
  );
}
