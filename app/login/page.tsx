"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ShieldCheck, Sparkles } from "lucide-react";
import { loginPhoneAction, demoLoginAction } from "../actions";
import { BrandMark } from "../_components/brand";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-brand w-full" disabled={pending}>
      {pending ? "מתחבר…" : "כניסה"}
    </button>
  );
}

function DemoButton({
  residentId,
  label,
  sub,
}: {
  residentId: string;
  label: string;
  sub: string;
}) {
  const action = demoLoginAction.bind(null, residentId);
  return (
    <form action={action}>
      <button
        type="submit"
        className="w-full text-right card card-hover tap px-4 py-3 flex items-center justify-between"
      >
        <span>
          <span className="block font-semibold">{label}</span>
          <span className="block text-sm text-muted">{sub}</span>
        </span>
        <span className="text-muted">←</span>
      </button>
    </form>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginPhoneAction, {});

  return (
    <main className="min-h-dvh flex flex-col">
      {/* Brand hero */}
      <div className="brand-gradient text-white px-6 pt-16 pb-12 rounded-b-[2rem]">
        <div className="mx-auto w-full max-w-md">
          <div className="flex items-center gap-3">
            <BrandMark size={52} uid="login" />
            <div>
              <h1 className="text-2xl font-extrabold leading-tight">ועד</h1>
              <p className="text-white/80 text-sm">ניהול הבניין שלך, בכיס</p>
            </div>
          </div>
          <p className="mt-6 text-white/90 leading-relaxed">
            תשלומי ועד, קריאות שירות, סקרים, אסיפות דיירים ושקיפות כספית —
            הכל במקום אחד.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge bg-white/15 text-white border-white/20">
              <Sparkles className="size-3.5" /> קהילה
            </span>
            <span className="badge bg-white/15 text-white border-white/20">
              <ShieldCheck className="size-3.5" /> שקיפות מלאה
            </span>
          </div>
        </div>
      </div>

      {/* Login card */}
      <div className="flex-1 px-6 -mt-6">
        <div className="mx-auto w-full max-w-md">
          <div className="card p-5">
            <h2 className="section-title mb-1">כניסה עם מספר טלפון</h2>
            <p className="text-sm text-muted mb-4">
              נזהה את הבניין ואת חברת הניהול לפי המספר שלך.
            </p>
            <form action={formAction} className="space-y-3">
              <input
                type="tel"
                name="phone"
                inputMode="tel"
                dir="ltr"
                placeholder="050-000-0000"
                className="input w-full text-center tracking-wide"
                autoComplete="tel"
              />
              {state?.error ? (
                <p className="text-danger text-sm">{state.error}</p>
              ) : null}
              <SubmitButton />
            </form>
          </div>

          {/* Demo access */}
          <div className="mt-6">
            <p className="text-xs text-faint mb-2 px-1">כניסת דמו מהירה</p>
            <div className="space-y-2">
              <DemoButton
                residentId="r55"
                label="דייר — יניב גולטשיאן"
                sub="מגדלי פיכמן · דירה 55 · בעל דירה"
              />
              <DemoButton
                residentId="r31"
                label="חבר ועד — רונית לוי"
                sub="מגדלי פיכמן · יו״ר הוועד"
              />
              <DemoButton
                residentId="mgr"
                label="חברת ניהול — מאיה"
                sub="ניהול פרו · אפליקציית הניהול"
              />
            </div>
          </div>

          <p className="text-center text-xs text-faint mt-8 pb-8">
            ועד · אפליקציה אחת לכל הדיירים
          </p>
        </div>
      </div>
    </main>
  );
}
