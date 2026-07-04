import { Wrench } from "lucide-react";
import { setCallStatusAction } from "@/app/actions";
import { Card, EmptyState, SectionHeader } from "@/components/ui/base";
import { relativeTime } from "@/lib/format";
import { repo } from "@/lib/repo";
import { callStatuses, CallStatusBadge, getManageContext, statusRank } from "../../_components/manage-ui";
import type { CallStatus } from "@/lib/types";

export const metadata = { title: "קריאות שירות" };

export default async function Page(){
 const {session}=await getManageContext();
 const calls=(await repo.getCallsByBuilding(session.buildingId)).sort((a,b)=>statusRank(a.status)-statusRank(b.status) || b.createdAt.localeCompare(a.createdAt));
 return <div className="space-y-5"><section className="fade-up"><h1 className="text-3xl font-black tracking-tight">קריאות שירות</h1><p className="mt-1 text-sm text-muted">תור עבודה לפי סטטוס, עם מעבר מהיר בין פתוחה, בטיפול וסגורה.</p></section><section className="fade-up"><SectionHeader title="תור טיפול" />{calls.length ? <div className="space-y-3">{calls.map(call=><Card key={call.id} className="p-4" as="article"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><h2 className="text-lg font-black">{call.subject}</h2><CallStatusBadge status={call.status}/></div><p className="mt-1 text-sm font-bold text-muted">{call.category} · {call.residentName}</p><p className="mt-2 text-sm leading-6 text-muted">{call.description}</p><p className="mt-2 text-xs text-faint">נפתחה {relativeTime(call.createdAt)} · עודכנה {relativeTime(call.updatedAt)}</p></div></div><div className="mt-4 grid grid-cols-3 gap-2">{callStatuses.map(([status,label])=><form key={status} action={setCallStatusAction}><input type="hidden" name="id" value={call.id}/><input type="hidden" name="status" value={status}/><button type="submit" disabled={call.status===status} className={call.status===status ? "btn w-full bg-surface-2 text-faint" : "btn btn-outline w-full"}>{label}</button></form>)}</div></Card>)}</div> : <EmptyState icon={<Wrench size={24}/>} title="אין קריאות" sub="קריאות מדיירים יופיעו כאן לניהול." />}</section></div>
}
