"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";

export type AssistantKB = {
  buildingName: string;
  residentFirst: string;
  whatsappUrl?: string;
  codes: { label: string; code: string; note?: string }[];
  phones: { name: string; role?: string; phone: string }[];
  facilities: { name: string; hours?: string; responsible?: string; description?: string; bookable?: boolean }[];
  gates: { name: string; dialerPhone: string }[];
  nextMeeting?: { title: string; date: string; time: string; location: string };
  upcomingMaintenance: { title: string; nextDue: string }[];
  roomBookingEnabled: boolean;
  roomBookingFee?: number;
  balance: number;
};

type Link2 = { href: string; label: string; external?: boolean };
type Reply = { text: string; links?: Link2[] };
type Msg = { id: number; role: "user" | "bot"; text: string; links?: Link2[] };

const has = (t: string, ...keys: string[]) => keys.some((k) => t.includes(k));
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

function answer(raw: string, kb: AssistantKB): Reply {
  const t = raw.trim().toLowerCase();

  if (has(t, "קוד", "צופן", "סיסמ")) {
    const room = kb.codes.find((c) => t.includes(c.label.replace("כניסה ", "").slice(0, 4)));
    const list = room ? [room] : kb.codes;
    if (!list.length) return { text: "עדיין לא הוגדרו קודים לבניין. אפשר לפנות לוועד." };
    return {
      text: "הנה הקודים העדכניים:\n" + list.map((c) => `• ${c.label}: ${c.code}${c.note ? ` (${c.note})` : ""}`).join("\n"),
      links: [{ href: "/app/more/info", label: "כל הקודים והמידע" }],
    };
  }

  if (has(t, "וואטסאפ", "ואטסאפ", "קבוצה", "whatsapp")) {
    return kb.whatsappUrl
      ? { text: "קבוצת הוואטסאפ של הבניין:", links: [{ href: kb.whatsappUrl, label: "פתיחת קבוצת הבניין", external: true }] }
      : { text: "לא הוגדר קישור לקבוצת וואטסאפ. אפשר לבקש מהוועד להוסיף אותו." };
  }

  if (has(t, "טלפון", "מספר", "חשמלאי", "אינסטלט", "חירום", "ועד", "שרברב", "קשר")) {
    if (!kb.phones.length) return { text: "אין כרגע טלפונים שמורים. נסו את דף המידע." };
    return {
      text: "טלפונים שימושיים:\n" + kb.phones.map((p) => `• ${p.name}${p.role ? ` (${p.role})` : ""}: ${p.phone}`).join("\n"),
      links: [{ href: "/app/more/info", label: "כל אנשי הקשר" }],
    };
  }

  if (has(t, "חניון", "חניה", "שער", "חיוג", "גרג")) {
    if (kb.gates.length) {
      return {
        text: "לפתיחת השער חייגו מהטלפון שלכם:\n" + kb.gates.map((g) => `• ${g.name}: ${g.dialerPhone}`).join("\n"),
        links: [{ href: "/app/more", label: "שער חניה" }],
      };
    }
    return { text: "לא הוגדר שער חניה עם חיוג. אפשר לפנות לוועד." };
  }

  if (has(t, "חדר", "כושר", "אירוע", "הזמנה", "להזמין", "הזמין", "מסיבה")) {
    const parts: string[] = [];
    if (kb.facilities.length) parts.push("החללים בבניין:\n" + kb.facilities.map((f) => `• ${f.name}${f.hours ? ` — ${f.hours}` : ""}${f.responsible ? ` (אחראי: ${f.responsible})` : ""}`).join("\n"));
    const links: Link2[] = [{ href: "/app/more/info", label: "פרטי החללים" }];
    if (kb.roomBookingEnabled) {
      parts.push(kb.roomBookingFee ? `להזמנת חדר הדיירים — עלות ${kb.roomBookingFee} ₪ להזמנה.` : "אפשר להזמין את חדר הדיירים ביומן, ללא תשלום.");
      links.unshift({ href: "/app/more/room", label: "הזמנת חדר דיירים" });
    }
    return { text: parts.join("\n\n") || "לא הוגדרו חללים משותפים.", links };
  }

  if (has(t, "אסיפ", "פגיש", "כינוס")) {
    return kb.nextMeeting
      ? { text: `האסיפה הקרובה: ${kb.nextMeeting.title}\n${fmtDate(kb.nextMeeting.date)} בשעה ${kb.nextMeeting.time}\nמיקום: ${kb.nextMeeting.location}`, links: [{ href: "/app/community", label: "אסיפות דיירים" }] }
      : { text: "אין כרגע אסיפה מתוכננת. נעדכן כאן ברגע שתיקבע.", links: [{ href: "/app/community", label: "ארכיון אסיפות" }] };
  }

  if (has(t, "תשלום", "חוב", "חייב", "לשלם", "דמי ועד", "כסף", "יתרה", "כמה אני")) {
    return kb.balance > 0
      ? { text: `יש לך חוב פתוח של ${kb.balance.toLocaleString("he-IL")} ₪. אפשר לשלם אונליין בכמה שניות.`, links: [{ href: "/app/payments", label: "מעבר לתשלום" }] }
      : { text: "אין לך חובות פתוחים — הכול משולם. כל הכבוד! 👏", links: [{ href: "/app/payments", label: "היסטוריית תשלומים" }] };
  }

  if (has(t, "תחזוק", "אחזק", "מעלית", "משאב", "כיבוי")) {
    return kb.upcomingMaintenance.length
      ? { text: "עבודות התחזוקה הקרובות בבניין:\n" + kb.upcomingMaintenance.map((m) => `• ${m.title} — ${fmtDate(m.nextDue)}`).join("\n") }
      : { text: "אין כרגע עבודות תחזוקה מתוכננות בקרוב." };
  }

  if (has(t, "תקל", "לדווח", "דיווח", "שירות", "נזיל", "תיקון", "תקוע", "שבור", "לא עובד")) {
    return { text: "אפשר לפתוח קריאת שירות לוועד עם תיאור ותמונה — ולעקוב אחרי הסטטוס.", links: [{ href: "/app/service", label: "פתיחת קריאת שירות" }] };
  }

  if (has(t, "שלום", "היי", "הי ", "מה נשמע", "בוקר", "ערב", "תודה")) {
    return { text: `${has(t, "תודה") ? "בשמחה" : "שלום"} ${kb.residentFirst}! אני העוזר החכם של ${kb.buildingName}. במה אפשר לעזור?` };
  }

  return {
    text: "לא בטוח שהבנתי 🤔 אני יכול לעזור עם קודים לכניסה, טלפונים שימושיים, שער חניה, הזמנת חדר, אסיפות, תשלומים, תחזוקה ודיווח תקלות. נסו אחת מההצעות למטה.",
  };
}

const CHIPS = ["קוד לחדר הזבל", "טלפון של הוועד", "איך פותחים את השער?", "הזמנת חדר דיירים", "מתי האסיפה הבאה?", "כמה אני חייב?", "דיווח על תקלה"];

export default function AssistantChat({ kb }: { kb: AssistantKB }) {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: "bot", text: `שלום ${kb.residentFirst}! 👋 אני העוזר החכם של ${kb.buildingName}. שאלו אותי כל דבר על הבניין — קודים, טלפונים, שער החניה, הזמנת חדר, אסיפות ותשלומים.` },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const userMsg: Msg = { id: idRef.current++, role: "user", text: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const reply = answer(q, kb);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: idRef.current++, role: "bot", text: reply.text, links: reply.links }]);
    }, 420);
  }

  return (
    <div className="assistant-shell">
      <div className="assistant-stream no-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={`chat-row ${m.role === "user" ? "chat-row-user" : ""}`}>
            {m.role === "bot" && <span className="chat-ava"><Bot size={16} /></span>}
            <div className={`chat-bubble ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}>
              <p className="whitespace-pre-line text-sm leading-relaxed">{m.text}</p>
              {m.links?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.links.map((l, i) =>
                    l.external ? (
                      <a key={i} href={l.href} target="_blank" rel="noreferrer" className="chat-link">{l.label}</a>
                    ) : (
                      <Link key={i} href={l.href} className="chat-link">{l.label}</Link>
                    )
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {typing && (
          <div className="chat-row">
            <span className="chat-ava"><Bot size={16} /></span>
            <div className="chat-bubble chat-bubble-bot"><span className="typing"><i /><i /><i /></span></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="assistant-chips no-scrollbar">
        {CHIPS.map((c) => (
          <button key={c} type="button" className="chat-chip tap" onClick={() => send(c)}><Sparkles size={12} /> {c}</button>
        ))}
      </div>

      <form
        className="assistant-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} className="input flex-1" placeholder="כתבו שאלה…" aria-label="שאלה לעוזר" />
        <button type="submit" className="btn btn-brand aspect-square !px-0" aria-label="שליחה" disabled={!input.trim()}><Send size={18} /></button>
      </form>
    </div>
  );
}
