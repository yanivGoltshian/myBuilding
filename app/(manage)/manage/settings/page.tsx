import Link from "next/link";
import { Building2, Palette, Settings, Users, WalletCards } from "lucide-react";
import { updateBrandingAction } from "@/app/actions";
import { Card, SectionHeader } from "@/components/ui/base";
import { repo } from "@/lib/repo";
import { getManageContext, MiniLink } from "../../_components/manage-ui";
import { SubmitButton } from "../../_components/SubmitButton";

export const metadata = { title: "הגדרות" };

export default async function Page(){
 const {session, building}=await getManageContext(); const company=await repo.getCompany(session.companyId);
 return <div className="space-y-5"><section className="fade-up"><h1 className="text-3xl font-black tracking-tight">הגדרות ניהול</h1><p className="mt-1 text-sm text-muted">מיתוג הבניין והגדרות תפעול שמוצגות גם באפליקציית הדיירים.</p></section><Card className="fade-up p-4"><SectionHeader title="מיתוג" action={<Palette size={18} className="text-brand"/>}/><form action={updateBrandingAction} className="space-y-3"><label><span className="label">צבע מותג</span><input name="brandColor" type="color" className="input h-12" defaultValue={building?.brandColor ?? company?.brandColor ?? "#4f46e5"}/></label><label><span className="label">טקסט לוגו</span><input name="logoText" className="input" defaultValue={building?.logoText ?? ""}/></label><label className="flex items-center gap-2 rounded-2xl bg-surface-2 p-3 text-sm font-bold"><input type="checkbox" name="roomBookingEnabled" defaultChecked={building?.roomBookingEnabled}/> הפעלת הזמנת חדר דיירים</label><SubmitButton>שמור מיתוג</SubmitButton></form><div className="brand-gradient mt-4 rounded-3xl p-4 text-brand-ink"><p className="text-sm opacity-80">תצוגה מקדימה</p><p className="text-2xl font-black">{building?.logoText}</p><p className="text-sm opacity-85">כרטיס ממותג לדיירים</p></div></Card><section className="fade-up"><SectionHeader title="ניהול תפעולי" /><div className="grid grid-cols-2 gap-3"><MiniLink href="/manage/info" icon={<Settings size={18}/>} title="מידע לבניין" sub="וואטסאפ, קודים ומתקנים"/><MiniLink href="/manage/buildings" icon={<Building2 size={18}/>} title="בניינים" sub="פורטפוליו החברה"/><MiniLink href="/manage/residents" icon={<Users size={18}/>} title="דיירים" sub="דירות ואנשי קשר"/><MiniLink href="/manage/debts" icon={<WalletCards size={18}/>} title="חייבים" sub="גבייה וטיפול"/></div></section><Link href="/manage" className="btn btn-outline w-full">חזרה ללוח הניהול</Link></div>
}
