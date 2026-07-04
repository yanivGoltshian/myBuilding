"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

export function CodeChip({ code }: { code: string }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="flex items-center gap-2" dir="ltr">
      <code className="rounded-xl bg-surface-2 px-3 py-2 text-sm font-black tracking-[0.18em] text-text">
        {shown ? code : "••••"}
      </code>
      <button type="button" onClick={() => setShown((v) => !v)} className="btn btn-ghost !px-3" aria-label={shown ? "הסתר קוד" : "הצג קוד"}>
        {shown ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button type="button" onClick={copy} className="btn btn-outline !px-3" aria-label="העתקת קוד">
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}
