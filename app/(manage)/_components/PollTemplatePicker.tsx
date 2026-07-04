"use client";

import { useState } from "react";
import { IconTile } from "@/components/ui/base";
import { Vote } from "lucide-react";

export interface PollTemplateView { id: string; title: string; question: string; description?: string; options: string[] }

export function PollTemplatePicker({ templates }: { templates: PollTemplateView[] }) {
  const [selected, setSelected] = useState(templates[0]);
  const options = [...selected.options, "", ""].slice(0, Math.max(4, selected.options.length));
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {templates.map((template) => (
          <button key={template.id} type="button" onClick={() => setSelected(template)} className="tap min-w-36 rounded-2xl border border-border bg-surface p-3 text-right">
            <div className="flex items-center gap-2"><IconTile tone={selected.id === template.id ? "brand" : "plain"} className="!h-9 !w-9"><Vote size={16} /></IconTile><span className="text-sm font-bold">{template.title}</span></div>
          </button>
        ))}
      </div>
      <label className="block"><span className="label">שאלה</span><input className="input" name="question" value={selected.question} onChange={(e) => setSelected({ ...selected, question: e.target.value })} placeholder="מה תרצו לשאול?" /></label>
      <label className="block"><span className="label">תיאור קצר</span><textarea className="textarea" name="description" value={selected.description ?? ""} onChange={(e) => setSelected({ ...selected, description: e.target.value })} rows={2} placeholder="רקע, עלות או הסבר לדיירים" /></label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((value, i) => <input key={`${selected.id}-${i}`} className="input" name="options" defaultValue={value} placeholder={`אפשרות ${i + 1}`} />)}
      </div>
    </div>
  );
}
