import { Vote } from "lucide-react";
import { createPollAction } from "@/app/actions";
import { Card, EmptyState, SectionHeader } from "@/components/ui/base";
import { relativeTime } from "@/lib/format";
import { repo } from "@/lib/repo";
import { POLL_TEMPLATES } from "@/lib/templates";
import { getManageContext } from "../../_components/manage-ui";
import { PollTemplatePicker } from "../../_components/PollTemplatePicker";
import { SubmitButton } from "../../_components/SubmitButton";

export const metadata = { title: "סקרים" };

export default async function Page(){
 const {session}=await getManageContext(); const polls=(await repo.getPollsByBuilding(session.buildingId)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
 const templates=POLL_TEMPLATES.map(({id,title,question,description,options})=>({id,title,question,description,options}));
 return <div className="space-y-5"><section className="fade-up"><h1 className="text-3xl font-black tracking-tight">סקרים והצבעות</h1><p className="mt-1 text-sm text-muted">יצירת הצבעה מתבנית מוכנה ומעקב תוצאות בזמן אמת.</p></section><Card className="fade-up p-4"><SectionHeader title="יצירת סקר מתבנית" /><form action={createPollAction} className="space-y-4"><PollTemplatePicker templates={templates}/><div className="grid grid-cols-2 gap-3"><label><span className="label">פתוח לימים</span><input name="days" className="input" type="number" min="1" defaultValue={7}/></label></div><SubmitButton>פתח הצבעה</SubmitButton></form></Card><section className="fade-up"><SectionHeader title="סקרים פעילים והיסטוריה" />{polls.length ? <div className="space-y-3">{polls.map(p=>{const total=p.options.reduce((s,o)=>s+o.votes,0)||1; return <Card key={p.id} className="p-4"><h2 className="text-lg font-black">{p.question}</h2>{p.description&&<p className="mt-1 text-sm text-muted">{p.description}</p>}<p className="mt-2 text-xs text-brand">נסגר {relativeTime(p.closesAt)} · {total} הצבעות</p><div className="mt-4 space-y-2">{(()=>{const top=p.options.reduce((a,b)=>b.votes>a.votes?b:a,p.options[0]); return p.options.map(o=>{const pct=Math.round((o.votes/total)*100); const win=o.id===top?.id&&top.votes>0; return <div key={o.id} className={`poll-opt ${win?"poll-opt-chosen":""}`}><span className="poll-fill" style={{width:`${pct}%`}} aria-hidden/><span className="poll-opt-row"><span className="font-bold">{o.label}</span><span className="text-sm font-bold tabular-nums" style={{color:win?"var(--brand)":"var(--muted)"}}>{o.votes} · {pct}%</span></span></div>})})()}</div></Card>})}</div> : <EmptyState icon={<Vote size={24}/>} title="אין סקרים" sub="סקרים חדשים יוצגו כאן עם תוצאות." />}</section></div>
}
