import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  BarChart3,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ClipboardCheck,
  DoorOpen,
  Landmark,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  Vote,
  Wrench,
} from "lucide-react";
import { getSession } from "@/lib/session";
import { BrandLogo } from "./_components/brand";
import { LandingMotion } from "./_components/landing-motion";
import { WhatsAppButton, WhatsAppFab } from "./_components/whatsapp";

export const metadata = {
  title: "ניהול בניינים חכם לחברות ניהול ולדיירים",
  description:
    "ועד היא פלטפורמת SaaS לניהול בניינים: מיתוג לבן לחברת הניהול, גבייה אונליין, קריאות שירות, סקרים, אסיפות דיירים, אחזקה מונעת ושקיפות כספית — הכל באפליקציה אחת.",
};

const residentFeatures = [
  { icon: Banknote, title: "תשלומי ועד אונליין", desc: "גבייה בכרטיס אשראי, הוראת קבע והעברה בנקאית — עם מעקב חובות אוטומטי." },
  { icon: Wrench, title: "קריאות שירות", desc: "דיווח תקלה עם תמונה ומעקב סטטוס בזמן אמת מול הוועד." },
  { icon: Vote, title: "סקרים והצבעות", desc: "החלטות קהילתיות בקליק, עם תוצאות חיות וטמפלייטים מוכנים." },
  { icon: CalendarDays, title: "אסיפות דיירים", desc: "זימון, פרוטוקול, החלטות וארכיון — מקושר להצבעה דיגיטלית." },
  { icon: Bot, title: "עוזר חכם לדייר", desc: "קודים, טלפונים, שער חניה והזמנות — בשיחה טבעית אחת." },
  { icon: Landmark, title: "שקיפות כספית", desc: "לאן הולך הכסף — הכנסות, הוצאות ומאזן הוועד בגרפים ברורים." },
  { icon: DoorOpen, title: "הזמנת חדר דיירים", desc: "יומן זמינות, ולידציה ותשלום — הכל מהטלפון." },
  { icon: ShoppingBag, title: "לוח יד2 שכונתי", desc: "קהילה חיה: מכירות, השאלות והמלצות בין השכנים." },
];

const companyValue = [
  { icon: Building2, title: "מיתוג לבן מלא", desc: "לוגו וצבע מותג לכל בניין — הדיירים רואים את המותג שלכם, לא שלנו." },
  { icon: Users, title: "ריבוי בניינים ודיירים", desc: "ניהול כל הפורטפוליו ממסך אחד, עם הפרדה מלאה בין הבניינים." },
  { icon: BarChart3, title: "כספים ומאזנים", desc: "הכנסות והוצאות, הפרדת שוטף/הוני, חובות דיירים ודוחות מוכנים." },
  { icon: ClipboardCheck, title: "אחזקה מונעת", desc: "לוח תחזוקה תקופתית, צ׳קליסטים תפעוליים וספר ספקים לכל בניין." },
];

const steps = [
  { n: "1", title: "מתחברים עם מספר טלפון", desc: "בלי סיסמאות. הזנת המספר מזהה מיד את הדייר." },
  { n: "2", title: "הבניין מזוהה אוטומטית", desc: "השיוך לבניין ולחברת הניהול נעשה בבק-אנד, עם המיתוג הנכון." },
  { n: "3", title: "מתחילים לנהל", desc: "תשלומים, קריאות, סקרים ומידע — הכל זמין מהרגע הראשון." },
];

export default async function LandingPage() {
  const session = await getSession();
  const appHref = session ? (session.role === "manager" || session.role === "admin" ? "/manage" : "/app") : "/login";
  const primaryCta = session ? "המשך לאפליקציה" : "כניסה לאפליקציה";

  return (
    <main className="landing">
      <LandingMotion>
      <header className="landing-nav">
        <div className="landing-wrap flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black" aria-label="ועד — דף הבית">
            <BrandLogo size={38} uid="nav" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-muted md:flex">
            <a href="#residents" className="hover:text-text">לדיירים</a>
            <a href="#companies" className="hover:text-text">לחברות ניהול</a>
            <a href="#how" className="hover:text-text">איך זה עובד</a>
          </nav>
          <Link href={appHref} className="btn btn-brand">{session ? "לאפליקציה" : "כניסה"}</Link>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-glow" aria-hidden />
        <div className="landing-wrap grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span data-hero className="badge-brand inline-flex items-center gap-1.5"><Sparkles size={13} /> פלטפורמת ניהול הבניינים החכמה</span>
            <h1 data-hero className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              הבניין שלכם,<br />מנוהל כמו שצריך.
            </h1>
            <p data-hero className="mt-4 max-w-lg text-lg text-muted">
              אפליקציה אחת לחברות ניהול ולדיירים: גבייה אונליין, קריאות שירות, סקרים, אסיפות דיירים,
              אחזקה מונעת ושקיפות כספית מלאה — במיתוג שלכם.
            </p>
            <div data-hero className="mt-7 flex flex-wrap items-center gap-3">
              <Link href={appHref} className="btn btn-brand h-12 px-6 text-base">{primaryCta} <ArrowLeft size={18} /></Link>
              <WhatsAppButton />
              <a href="#residents" className="btn btn-outline h-12 px-6 text-base">גלו את הפיצ׳רים</a>
            </div>
            <div data-hero className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-success" /> ללא סיסמאות — כניסה בטלפון</span>
              <span className="inline-flex items-center gap-1.5"><Check size={15} className="text-success" /> מותאם להתקנה בנייד</span>
            </div>
          </div>

          <div data-hero className="flex justify-center lg:justify-start">
            <div className="phone-mock" data-float>
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-pay">
                  <p className="text-xs opacity-90">יתרה לתשלום · ינואר</p>
                  <p className="mt-1 text-3xl font-black">₪380</p>
                  <div className="mt-3 flex gap-2">
                    <span className="phone-btn-white">שלם עכשיו</span>
                    <span className="phone-btn-ghost">פירוט</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { icon: Wrench, label: "קריאת שירות" },
                    { icon: Vote, label: "סקרים" },
                    { icon: CalendarDays, label: "הזמנת חדר" },
                    { icon: Bot, label: "עוזר חכם" },
                  ].map((t) => (
                    <div key={t.label} className="phone-tile">
                      <span className="phone-tile-icon"><t.icon size={15} /></span>
                      <span className="text-[11px] font-bold">{t.label}</span>
                    </div>
                  ))}
                </div>
                <div className="phone-note">
                  <MessageCircle size={14} className="text-brand" />
                  <span className="text-[11px] font-bold">אסיפת דיירים · יום ג׳ 20:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal-group className="landing-wrap grid grid-cols-2 gap-4 py-4 md:grid-cols-4">
        {[
          { v: "5 דק׳", l: "להעלאת בניין חדש" },
          { v: "100%", l: "מיתוג לבן לחברה" },
          { v: "אונליין", l: "גבייה ומעקב חובות" },
          { v: "PWA", l: "התקנה בכל נייד" },
        ].map((s) => (
          <div key={s.l} className="card p-4 text-center">
            <div className="text-2xl font-black text-brand">{s.v}</div>
            <div className="mt-1 text-xs text-muted">{s.l}</div>
          </div>
        ))}
      </section>

      <section id="residents" className="landing-wrap py-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge-info">לדיירים</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight">כל מה שהופך את החיים בבניין לפשוטים</h2>
          <p className="mt-3 text-muted">חוויית משתמש ברמה של האפליקציות הטובות בעולם — שכל דייר ירצה להתקין בטלפון.</p>
        </div>
        <div data-reveal-group className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {residentFeatures.map((f) => (
            <div key={f.title} className="card card-hover p-5">
              <span className="icon-tile"><f.icon size={19} /></span>
              <h3 className="mt-4 font-black">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="companies" className="landing-band">
        <div className="landing-wrap grid items-center gap-10 py-14 lg:grid-cols-2">
          <div>
            <span className="badge-brand">לחברות ניהול</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight">פלטפורמה אחת לכל הפורטפוליו שלכם</h2>
            <p className="mt-3 text-muted">
              משלמים סכום קבוע קטן ומקבלים מערכת מלאה במיתוג שלכם — ניהול כספי, אחזקה, ספקים ותקשורת מול הדיירים.
              אפליקציית ניהול נפרדת לחלוטין מזו שהדיירים רואים.
            </p>
            <ul data-reveal-group className="mt-6 space-y-3">
              {companyValue.map((c) => (
                <li key={c.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl bg-surface text-brand shadow-sm"><c.icon size={17} /></span>
                  <div>
                    <p className="font-bold">{c.title}</p>
                    <p className="text-sm text-muted">{c.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/login" className="btn btn-brand mt-7 h-12 px-6 text-base">התחילו עכשיו <ArrowLeft size={18} /></Link>
          </div>
          <div data-reveal-group className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, t: "הרשאות ותפקידים", d: "ועד, מנהל וחברה — כל אחד רואה את מה שרלוונטי לו." },
              { icon: Bell, t: "תקשורת יזומה", d: "עדכונים, נעיצות והתראות ישירות לדיירים." },
              { icon: BarChart3, t: "גרפים ודוחות", d: "תמונת מצב כספית מיידית לכל בניין." },
              { icon: Star, t: "חוויית פרימיום", d: "עיצוב מודרני RTL שמייצר אמון ושביעות רצון." },
            ].map((x) => (
              <div key={x.t} className="card p-5">
                <span className="icon-tile"><x.icon size={19} /></span>
                <h3 className="mt-3 font-black">{x.t}</h3>
                <p className="mt-1 text-sm text-muted">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="landing-wrap py-14">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge-success">איך זה עובד</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight">מתחברים בטלפון — והכל מוכן</h2>
        </div>
        <div data-reveal-group className="mt-9 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full brand-gradient text-lg font-black text-white">{s.n}</span>
              <h3 className="mt-4 text-lg font-black">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-wrap pb-16">
        <div data-reveal className="landing-cta">
          <div className="landing-glow" aria-hidden />
          <div className="relative">
            <Phone size={30} className="mx-auto text-white/90" />
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white">מוכנים לשדרג את ניהול הבניין?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">הצטרפו לחברות ניהול ולדיירים שכבר עברו לניהול חכם, שקוף ופשוט.</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href={appHref} className="btn h-12 bg-white px-6 text-base text-brand-ink">{primaryCta} <ArrowLeft size={18} /></Link>
              <WhatsAppButton label="דברו איתנו" />
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-foot">
        <div className="landing-wrap flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
          <BrandLogo size={34} uid="foot" />
          <p className="text-sm text-muted">© {new Date().getFullYear()} ועד · ניהול בניינים חכם</p>
          <Link href={appHref} className="text-sm font-bold text-brand">{session ? "לאפליקציה" : "כניסה"} ←</Link>
        </div>
      </footer>

      <WhatsAppFab />
      </LandingMotion>
    </main>
  );
}
