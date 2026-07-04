import Link from "next/link";
import { CloudOff } from "lucide-react";

export const metadata = { title: "אין חיבור" };

export default function OfflinePage() {
  return (
    <main className="min-h-dvh grid place-items-center px-6 text-center">
      <div className="max-w-sm">
        <span className="mx-auto grid place-items-center size-16 rounded-2xl bg-surface-2 text-muted">
          <CloudOff className="size-8" />
        </span>
        <h1 className="text-xl font-bold mt-5">אין חיבור לאינטרנט</h1>
        <p className="text-muted mt-2 leading-relaxed">
          נראה שאתם במצב לא מקוון. חלק מהמסכים זמינים גם ללא רשת, אבל לפעולה זו
          צריך חיבור. נסו שוב כשהחיבור יחזור.
        </p>
        <Link href="/app" className="btn btn-brand mt-6 inline-flex">
          לניסיון חוזר
        </Link>
      </div>
    </main>
  );
}
