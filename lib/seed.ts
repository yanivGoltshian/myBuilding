import type { Database } from "./types";

// Rich, believable Hebrew demo data. Fresh object each call so the in-memory
// repo can clone it without mutating the source.
export function seedDatabase(): Database {
  const company = {
    id: "c1",
    name: "ניהול פרו",
    logoText: "ניהול פרו",
    brandColor: "#4f46e5",
    plan: "pro" as const,
    monthlyFee: 149,
    phone: "03-5551234",
  };

  return {
    companies: [company],

    buildings: [
      {
        id: "b1",
        companyId: "c1",
        name: "מגדלי פיכמן",
        address: "פיכמן 25",
        city: "חולון",
        brandColor: "#4f46e5",
        logoText: "מגדלי פיכמן",
        roomBookingEnabled: true,
        roomBookingFee: 120,
        bankName: "בנק הפועלים",
        bankLast4: "4821",
      },
      {
        id: "b2",
        companyId: "c1",
        name: "פארק רוטשילד",
        address: "רוטשילד 12",
        city: "תל אביב",
        brandColor: "#0d9488",
        logoText: "פארק רוטשילד",
        roomBookingEnabled: true,
        roomBookingFee: 150,
        bankName: "בנק לאומי",
        bankLast4: "1190",
      },
      {
        id: "b3",
        companyId: "c1",
        name: "נווה הים",
        address: "הרצל 40",
        city: "בת ים",
        brandColor: "#db2777",
        logoText: "נווה הים",
        roomBookingEnabled: false,
        bankName: "בנק דיסקונט",
        bankLast4: "7733",
      },
    ],

    units: [
      { id: "u11", buildingId: "b1", number: "11", floor: 1, ownerName: "משפחת כהן", isRented: false, monthlyDues: 320 },
      { id: "u12", buildingId: "b1", number: "12", floor: 1, ownerName: "דוד לוי", isRented: true, monthlyDues: 320 },
      { id: "u23", buildingId: "b1", number: "23", floor: 2, ownerName: "משפחת אזולאי", isRented: false, monthlyDues: 350 },
      { id: "u31", buildingId: "b1", number: "31", floor: 3, ownerName: "רונית לוי", isRented: false, monthlyDues: 350 },
      { id: "u42", buildingId: "b1", number: "42", floor: 4, ownerName: "משפחת פרץ", isRented: true, monthlyDues: 380 },
      { id: "u55", buildingId: "b1", number: "55", floor: 5, ownerName: "יניב גולטשיאן", isRented: false, monthlyDues: 380 },
      { id: "u63", buildingId: "b1", number: "63", floor: 6, ownerName: "משפחת ביטון", isRented: false, monthlyDues: 400 },
      { id: "u71", buildingId: "b1", number: "71", floor: 7, ownerName: "משפחת שרון", isRented: true, monthlyDues: 420 },
    ],

    residents: [
      { id: "r55", unitId: "u55", buildingId: "b1", name: "יניב גולטשיאן", phone: "0524734788", role: "tenant", isOwner: true },
      { id: "r31", unitId: "u31", buildingId: "b1", name: "רונית לוי", phone: "0501112233", role: "committee", isOwner: true },
      { id: "r11", unitId: "u11", buildingId: "b1", name: "משה כהן", phone: "0522223344", role: "tenant", isOwner: true },
      { id: "r12", unitId: "u12", buildingId: "b1", name: "שירה מזרחי", phone: "0533334455", role: "tenant", isOwner: false },
      { id: "r42", unitId: "u42", buildingId: "b1", name: "עומר פרץ", phone: "0544445566", role: "tenant", isOwner: false },
      { id: "mgr", unitId: "", buildingId: "b1", name: "מאיה מנהלת", phone: "0509998877", role: "manager", isOwner: false },
    ],

    payments: buildPayments(),

    ledger: buildLedger(),

    calls: [
      { id: "sc1", buildingId: "b1", unitId: "u42", residentName: "עומר פרץ", subject: "נזילה בחניון", category: "אינסטלציה", description: "יש נזילת מים ליד החניה של דירה 42, המים מצטברים על הרצפה.", status: "open", createdAt: iso(-1), updatedAt: iso(-1) },
      { id: "sc2", buildingId: "b1", unitId: "u11", residentName: "משה כהן", subject: "תאורה שרופה בלובי", category: "חשמל", description: "שתי נורות בלובי הכניסה שרופות כבר שבוע.", status: "in_progress", createdAt: iso(-4), updatedAt: iso(-2) },
      { id: "sc3", buildingId: "b1", unitId: "u23", residentName: "רות אזולאי", subject: "דלת כניסה לא ננעלת", category: "מסגרות", description: "המנעול של דלת הכניסה הראשית לא תופס.", status: "closed", createdAt: iso(-20), updatedAt: iso(-16) },
    ],

    bookings: [
      { id: "bk1", buildingId: "b1", unitId: "u31", residentName: "רונית לוי", date: iso(9).slice(0, 10), time: "18:00", endTime: "19:00", subject: "יום הולדת", fee: 120, paid: true },
      { id: "bk2", buildingId: "b1", unitId: "u63", residentName: "משפחת ביטון", date: iso(16).slice(0, 10), time: "20:00", endTime: "21:00", subject: "ערב משחקים", fee: 120, paid: false },
    ],

    docs: [
      { id: "d1", buildingId: "b1", name: "תקנון הבית המשותף", kind: "bylaws", date: iso(-200).slice(0, 10) },
      { id: "d2", buildingId: "b1", name: "פוליסת ביטוח מבנה 2026", kind: "general", date: iso(-60).slice(0, 10) },
      { id: "d3", buildingId: "b1", name: "טופס ייפוי כוח לאסיפה", kind: "form", date: iso(-15).slice(0, 10) },
      { id: "d4", buildingId: "b1", unitId: "u55", name: "אישור תשלום שנתי — דירה 55", kind: "unit", date: iso(-30).slice(0, 10) },
    ],

    announcements: [
      { id: "an1", buildingId: "b1", title: "ניתוק מים מתוכנן ביום ג׳", body: "עקב עבודות תחזוקה במערכת המים, המים ינותקו ביום שלישי בין 09:00 ל-13:00. מומלץ לאגור מים מראש.", date: iso(-1), author: "ועד הבית", category: "urgent", pinned: true, reactions: 12, comments: 4 },
      { id: "an2", buildingId: "b1", title: "בדיקת מעליות שנתית", body: "ביום חמישי תתבצע בדיקת התקינות השנתית של המעליות. ייתכנו השבתות קצרות.", date: iso(-3), author: "ניהול פרו", category: "maintenance", pinned: false, reactions: 5, comments: 1 },
      { id: "an3", buildingId: "b1", title: "אסיפת דיירים — הזמנה", body: "אסיפת הדיירים השנתית תתקיים בחדר הדיירים. על סדר היום: תקציב, שיפוץ הלובי ובחירת ועד.", date: iso(-5), author: "ועד הבית", category: "event", pinned: false, reactions: 8, comments: 6 },
      { id: "an4", buildingId: "b1", title: "פורסם הדוח הכספי הרבעוני", body: "הדוח הכספי לרבעון האחרון זמין כעת בלשונית 'שקיפות'. תודה על שיתוף הפעולה בתשלומים.", date: iso(-8), author: "ניהול פרו", category: "finance", pinned: false, reactions: 3, comments: 0 },
    ],

    polls: [
      {
        id: "p1",
        buildingId: "b1",
        question: "האם לשפץ את לובי הכניסה?",
        description: "עלות משוערת: 24,000 ₪ מקרן השיפוצים. השיפוץ כולל ריצוף, תאורה וצביעה.",
        options: [
          { id: "o1", label: "כן, בעד השיפוץ", votes: 14 },
          { id: "o2", label: "לא כרגע", votes: 5 },
          { id: "o3", label: "צריך עוד מידע", votes: 3 },
        ],
        closesAt: iso(5),
        createdAt: iso(-4),
      },
      {
        id: "p2",
        buildingId: "b1",
        question: "באיזה יום לקיים את אסיפת הדיירים?",
        options: [
          { id: "o1", label: "יום שני", votes: 6 },
          { id: "o2", label: "יום רביעי", votes: 11 },
          { id: "o3", label: "יום חמישי", votes: 4 },
        ],
        closesAt: iso(3),
        createdAt: iso(-2),
      },
    ],

    events: [
      { id: "ev1", buildingId: "b1", title: "אסיפת דיירים שנתית", date: iso(7).slice(0, 10), time: "19:30", location: "חדר דיירים", kind: "meeting", description: "תקציב, שיפוץ לובי ובחירת ועד." },
      { id: "ev2", buildingId: "b1", title: "ניקיון יסודי במחסנים", date: iso(12).slice(0, 10), time: "08:00", location: "קומת מחסנים", kind: "cleaning" },
      { id: "ev3", buildingId: "b1", title: "בדיקת מעליות", date: iso(4).slice(0, 10), time: "10:00", location: "לובי", kind: "maintenance" },
    ],

    market: [
      { id: "m0", buildingId: "b1", residentId: "r55", sellerName: "יניב גולטשיאן", unit: "55", title: "אופניים חשמליים", description: "שנתיים בשימוש, סוללה חדשה. אפשר לראות בדירה 55.", price: 1800, isFree: false, category: "other", date: iso(-1) },
      { id: "m1", buildingId: "b1", residentId: "r12", sellerName: "שירה מזרחי", unit: "12", title: "ספה תלת-מושבית אפורה", description: "במצב מצוין, פינוי עצמי מדירה 12.", price: 400, isFree: false, category: "furniture", date: iso(-2) },
      { id: "m2", buildingId: "b1", sellerName: "משפחת ביטון", unit: "63", title: "אופני ילדים — חינם", description: "מידה 20, מתאים לגיל 6-9. מחכים בחניון.", price: 0, isFree: true, category: "kids", date: iso(-3) },
      { id: "m3", buildingId: "b1", residentId: "r11", sellerName: "משה כהן", unit: "11", title: "מקרר קטן למשרד", description: "מקרר בר 90 ליטר, עובד מצוין.", price: 250, isFree: false, category: "appliance", date: iso(-6) },
    ],

    gates: [
      { id: "g1", buildingId: "b1", name: "חניון", gatePhone: "0537778899", dialerPhone: "0524734788", isPrivate: true, color: "#4f46e5" },
    ],

    meetings: [
      {
        id: "mt1",
        buildingId: "b1",
        title: "אסיפת דיירים שנתית 2026",
        date: iso(7).slice(0, 10),
        time: "19:30",
        location: "חדר דיירים",
        status: "scheduled",
        agenda: [
          "אישור התקציב השנתי",
          "שיפוץ לובי הכניסה — הצבעה",
          "בחירת ועד בית",
          "עדכון בנושא חניות אורחים",
        ],
        quorum: 5,
        decisions: [],
        pollId: "p1",
      },
      {
        id: "mt2",
        buildingId: "b1",
        title: "אסיפה מיוחדת — החלפת משאבת מים",
        date: iso(-35).slice(0, 10),
        time: "20:00",
        location: "לובי",
        status: "held",
        agenda: ["אישור החלפת משאבת המים הראשית", "אישור הוצאה מקרן השיפוצים"],
        attendance: 11,
        quorum: 5,
        summary:
          "הוצג מצב המשאבה שהתקלקלה. הוחלט פה אחד להחליף למשאבה חדשה בעלות 3,800 ₪ מתוך קרן השיפוצים. העבודה בוצעה בהצלחה.",
        decisions: [
          { topic: "החלפת משאבת מים", outcome: "אושר פה אחד (11 בעד)" },
          { topic: "מימון מקרן השיפוצים", outcome: "אושר" },
        ],
      },
      {
        id: "mt3",
        buildingId: "b1",
        title: "אסיפת דיירים שנתית 2025",
        date: iso(-320).slice(0, 10),
        time: "19:00",
        location: "חדר דיירים",
        status: "held",
        agenda: ["סקירת שנה", "אישור דוח כספי 2025", "העלאת דמי ועד", "בחירת ועד"],
        attendance: 14,
        quorum: 5,
        summary:
          "אושר הדוח הכספי לשנת 2025. הוחלט על העלאת דמי הוועד ב-30 ₪ לחודש לצורך חיזוק קרן השיפוצים. נבחר ועד חדש בהרכב: רונית לוי (יו״ר), משה כהן, ומשפחת ביטון.",
        decisions: [
          { topic: "דוח כספי 2025", outcome: "אושר (14 בעד)" },
          { topic: "העלאת דמי ועד ב-30 ₪", outcome: "אושר ברוב קולות (11 בעד, 3 נגד)" },
          { topic: "בחירת ועד", outcome: "נבחר ועד חדש" },
        ],
      },
    ],

    buildingInfo: [
      {
        buildingId: "b1",
        whatsappUrl: "https://chat.whatsapp.com/EXAMPLEexampleEXA",
        contacts: [
          { id: "ct1", name: "רונית לוי", role: "יו״ר ועד הבית", phone: "0501112233", category: "committee" },
          { id: "ct2", name: "משה כהן", role: "גזבר הוועד", phone: "0522223344", category: "committee" },
          { id: "ct3", name: "מאיה — ניהול פרו", role: "מנהלת הבניין", phone: "0509998877", category: "management" },
          { id: "ct4", name: "אינסטלציה 24/7", role: "אינסטלטור חירום", phone: "0537778890", category: "emergency" },
          { id: "ct5", name: "חשמלאי הבניין", role: "תקלות חשמל", phone: "0536664455", category: "service" },
          { id: "ct6", name: "מוקד מעליות שינדלר", role: "תקלות מעלית", phone: "1-800-000-000", category: "emergency" },
          { id: "ct7", name: "חברת הניקיון", role: "ניקיון שוטף", phone: "0535556677", category: "service" },
        ],
        codes: [
          { id: "cd1", label: "כניסה ראשית", code: "1975#", icon: "DoorOpen", note: "לחצו # לאחר הקוד" },
          { id: "cd2", label: "חדר זבל", code: "2468", icon: "Trash2" },
          { id: "cd3", label: "חדר מיחזור", code: "1357", icon: "Recycle" },
          { id: "cd4", label: "חדר אופניים / עגלות", code: "4321", icon: "Bike" },
          { id: "cd5", label: "חדר דיירים", code: "0000", icon: "Sofa", note: "פתוח לאחר הזמנה ביומן" },
          { id: "cd6", label: "חדר גז", code: "9110", icon: "Flame", note: "לשימוש בעלי מקצוע בלבד" },
        ],
        facilities: [
          { id: "fc1", name: "חדר דיירים", icon: "Sofa", description: "חדר אירועים משותף עם מטבחון", hours: "08:00–22:00", responsible: "רונית לוי", bookable: true },
          { id: "fc2", name: "חדר כושר", icon: "Dumbbell", description: "הליכון, אופני כושר ומשקולות", hours: "06:00–23:00", responsible: "ועד הבית", bookable: false },
          { id: "fc3", name: "חדר מיחזור", icon: "Recycle", description: "קרטון, בקבוקים, אריזות ואלקטרוניקה", hours: "24/7", bookable: false },
          { id: "fc4", name: "חדר זבל", icon: "Trash2", description: "פינוי בימים א׳, ג׳, ה׳", hours: "24/7", bookable: false },
          { id: "fc5", name: "חניון אורחים", icon: "Car", description: "4 חניות אורחים בקומה -1", hours: "24/7", responsible: "ועד הבית", bookable: false },
          { id: "fc6", name: "מחסנים", icon: "Package", description: "קומת מחסנים -2", hours: "24/7", bookable: false },
        ],
      },
      {
        buildingId: "b2",
        whatsappUrl: "https://chat.whatsapp.com/EXAMPLE2example2EX",
        contacts: [
          { id: "ct1", name: "ועד פארק רוטשילד", role: "ועד הבית", phone: "0501234567", category: "committee" },
          { id: "ct2", name: "מאיה — ניהול פרו", role: "מנהלת הבניין", phone: "0509998877", category: "management" },
        ],
        codes: [
          { id: "cd1", label: "כניסה ראשית", code: "5580#", icon: "DoorOpen" },
          { id: "cd2", label: "חדר זבל", code: "1212", icon: "Trash2" },
        ],
        facilities: [
          { id: "fc1", name: "לובי כניסה", icon: "Building2", description: "עמדת שומר", hours: "24/7", bookable: false },
          { id: "fc2", name: "חדר מיחזור", icon: "Recycle", hours: "24/7", bookable: false },
        ],
      },
      {
        buildingId: "b3",
        contacts: [
          { id: "ct1", name: "ועד נווה הים", role: "ועד הבית", phone: "0507654321", category: "committee" },
        ],
        codes: [
          { id: "cd1", label: "כניסה ראשית", code: "4040", icon: "DoorOpen" },
        ],
        facilities: [
          { id: "fc1", name: "חדר זבל", icon: "Trash2", hours: "24/7", bookable: false },
        ],
      },
    ],
  };
}

function iso(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

function ym(monthsAgo: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Demo unit u55 (Yaniv): paid history + current month due => a meaningful "pay now".
// Other units seed the management debts view.
function buildPayments() {
  const rows: Database["payments"] = [];
  const push = (
    unitId: string,
    amount: number,
    monthsAgo: number,
    status: "paid" | "due" | "overdue"
  ) =>
    rows.push({
      id: `pay-${unitId}-${ym(monthsAgo)}`,
      unitId,
      buildingId: "b1",
      period: ym(monthsAgo),
      amount,
      status,
      paidAt: status === "paid" ? iso(-monthsAgo * 30 + 3) : undefined,
      method: status === "paid" ? "כרטיס אשראי" : undefined,
    });

  // u55 — Yaniv: last 5 months paid, current month due
  for (let m = 5; m >= 1; m--) push("u55", 380, m, "paid");
  push("u55", 380, 0, "due");

  // u42 — two months overdue (management debt highlight)
  push("u42", 380, 2, "overdue");
  push("u42", 380, 1, "overdue");
  push("u42", 380, 0, "due");

  // u71 — one month overdue
  push("u71", 420, 1, "overdue");
  push("u71", 420, 0, "due");

  // healthy units paid up
  for (const u of ["u11", "u12", "u23", "u31", "u63"]) {
    for (let m = 2; m >= 0; m--) push(u, 350, m, "paid");
  }

  return rows;
}

function buildLedger(): Database["ledger"] {
  const d = (monthsAgo: number, day = 5) => {
    const dt = new Date();
    dt.setMonth(dt.getMonth() - monthsAgo);
    dt.setDate(day);
    return dt.toISOString().slice(0, 10);
  };
  const rows: Database["ledger"] = [];
  let i = 0;
  const add = (
    monthsAgo: number,
    category: string,
    description: string,
    amount: number,
    kind: "expense" | "income",
    type: "current" | "capital",
    vendor?: string,
    recurring?: boolean
  ) =>
    rows.push({
      id: `l${i++}`,
      buildingId: "b1",
      date: d(monthsAgo),
      category,
      description,
      amount,
      kind,
      type,
      vendor,
      recurring,
    });

  for (let m = 5; m >= 0; m--) {
    add(m, "דמי ועד", "גביית דמי ועד חודשיים", 2760, "income", "current", undefined, true);
    add(m, "חשמל", "חשמל שטחים משותפים", 640, "expense", "current", "חברת חשמל", true);
    add(m, "מים", "צריכת מים משותפת", 210, "expense", "current", "מי חולון", true);
    add(m, "ניקיון", "שירותי ניקיון חודשי", 900, "expense", "current", "ניקיון הבזק", true);
    add(m, "מעלית", "חוזה אחזקת מעליות", 480, "expense", "current", "מעליות שינדלר", true);
    add(m, "גינון", "תחזוקת גינה", 300, "expense", "current", "גינון ירוק", true);
  }
  add(2, "ביטוח", "ביטוח מבנה שנתי (חלק)", 1200, "expense", "current", "הראל ביטוח");
  add(3, "שיפוצים", "צביעת חדר מדרגות", 4200, "expense", "capital", "צבע וגמר בע\"מ");
  add(1, "שיפוצים", "החלפת משאבת מים ראשית", 3800, "expense", "capital", "אינסטלציה 24/7");
  add(4, "חניון", "תיקון מחסום חניון", 950, "expense", "capital", "מחסומי ישראל");

  return rows;
}
