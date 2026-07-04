"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { IconTile } from "@/components/ui/base";

export interface AgendaTemplateView { id: string; title: string; items: string[] }

export function AgendaTemplatePicker({ templates }: { templates: AgendaTemplateView[] }) {
  const [selected, setSelected] = useState(templates[0]);
  const agenda = [...selected.items, "", ""].slice(0, Math.max(5, selected.items.length));
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {templates.map((template) => (
          <button key={template.id} type="button" onClick={() => setSelected(template)} className="tap min-w-36 rounded-2xl border border-border bg-surface p-3 text-right">
            <div className="flex items-center gap-2"><IconTile tone={selected.id === template.id ? "brand" : "plain"} className="!h-9 !w-9"><CalendarDays size={16} /></IconTile><span className="text-sm font-bold">{template.title}</span></div>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {agenda.map((item, i) => <input key={`${selected.id}-${i}`} className="input" name="agenda" defaultValue={item} placeholder={`נושא ${i + 1}`} />)}
      </div>
    </div>
  );
}
