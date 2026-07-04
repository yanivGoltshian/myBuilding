// Ready-made survey templates the committee can launch in one tap,
// plus agenda templates for residents' assemblies.

export interface PollTemplate {
  id: string;
  icon: string; // lucide icon name
  title: string;
  question: string;
  description?: string;
  options: string[];
}

export const POLL_TEMPLATES: PollTemplate[] = [
  {
    id: "renovation",
    icon: "PaintRoller",
    title: "שיפוץ / חידוש",
    question: "האם לאשר את השיפוץ המוצע?",
    description: "פרטו את היקף השיפוץ והעלות המשוערת מקרן הבניין.",
    options: ["כן, בעד", "לא", "צריך עוד מידע"],
  },
  {
    id: "cleaning",
    icon: "Sparkles",
    title: "החלפת חברת ניקיון",
    question: "האם להחליף את חברת הניקיון?",
    description: "הצעת מחיר חדשה מול השירות הנוכחי.",
    options: ["בעד החלפה", "להישאר עם הנוכחית", "לבקש הצעות נוספות"],
  },
  {
    id: "security",
    icon: "Cctv",
    title: "התקנת מצלמות אבטחה",
    question: "האם להתקין מערכת מצלמות אבטחה בשטחים המשותפים?",
    description: "עלות התקנה חד-פעמית + תחזוקה חודשית.",
    options: ["כן", "לא", "רק בלובי ובחניון"],
  },
  {
    id: "dues",
    icon: "Wallet",
    title: "עדכון דמי ועד",
    question: "האם לאשר עדכון בגובה דמי הוועד?",
    description: "נמקו את הצורך (קרן שיפוצים, עלויות תחזוקה).",
    options: ["בעד", "נגד", "בעד עדכון מדורג"],
  },
  {
    id: "meeting-day",
    icon: "CalendarDays",
    title: "מועד אסיפת דיירים",
    question: "באיזה יום נוח לקיים את אסיפת הדיירים?",
    options: ["יום שני", "יום שלישי", "יום רביעי", "יום חמישי"],
  },
  {
    id: "garden",
    icon: "Trees",
    title: "שדרוג הגינה / חצר",
    question: "מה תעדיפו להוסיף לחצר המשותפת?",
    options: ["פינת ישיבה", "מתקן משחקים לילדים", "צמחייה ותאורה", "להשאיר כמו שהוא"],
  },
  {
    id: "committee",
    icon: "Users",
    title: "בחירת ועד בית",
    question: "האם לאשר את הרכב הוועד המוצע?",
    options: ["מאשר/ת", "מתנגד/ת", "נמנע/ת"],
  },
  {
    id: "custom",
    icon: "Plus",
    title: "סקר חדש",
    question: "",
    options: ["", ""],
  },
];

export const AGENDA_TEMPLATES: { id: string; title: string; items: string[] }[] = [
  {
    id: "annual",
    title: "אסיפה שנתית",
    items: [
      "אישור הדוח הכספי השנתי",
      "אישור התקציב לשנה הקרובה",
      "בחירת / אישור ועד בית",
      "נושאי תחזוקה ושיפוצים",
      "שונות ופתוח לשאלות",
    ],
  },
  {
    id: "special",
    title: "אסיפה מיוחדת",
    items: ["הצגת הנושא לדיון", "הצגת הצעות מחיר", "הצבעה והחלטה"],
  },
  {
    id: "budget",
    title: "אישור הוצאה חריגה",
    items: ["רקע והצורך", "מקור המימון (קרן שיפוצים)", "הצבעה"],
  },
];
