"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { deleteMarketAction, updateMarketAction } from "@/app/actions";
import { Badge, Card } from "@/components/ui/base";
import { fmtILS, relativeTime } from "@/lib/format";
import type { MarketItem, MarketCategory } from "@/lib/types";

const CATEGORY_LABEL: Record<MarketCategory, string> = {
  furniture: "ריהוט",
  appliance: "מוצרי חשמל",
  kids: "ילדים",
  free: "חינם",
  other: "כללי",
};

function CategoryBadge({ category }: { category: MarketCategory }) {
  return (
    <Badge tone={category === "free" ? "success" : "muted"}>
      {CATEGORY_LABEL[category]}
    </Badge>
  );
}

export function MarketItemCard({
  item,
  canManage,
}: {
  item: MarketItem;
  canManage: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [free, setFree] = useState(item.isFree);

  if (editing) {
    return (
      <Card className="p-4" as="article">
        <form
          action={updateMarketAction}
          onSubmit={() => setEditing(false)}
          className="space-y-3"
        >
          <input type="hidden" name="id" value={item.id} />
          <div className="flex items-center justify-between">
            <span className="section-title">עריכת מודעה</span>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="tap grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-muted"
              aria-label="ביטול"
            >
              <X size={16} />
            </button>
          </div>
          <div>
            <label className="label" htmlFor={`t-${item.id}`}>כותרת</label>
            <input id={`t-${item.id}`} name="title" className="input" defaultValue={item.title} required />
          </div>
          <div>
            <label className="label" htmlFor={`d-${item.id}`}>תיאור</label>
            <textarea id={`d-${item.id}`} name="description" className="textarea" rows={3} defaultValue={item.description} />
          </div>
          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <div>
              <label className="label" htmlFor={`p-${item.id}`}>מחיר</label>
              <input
                id={`p-${item.id}`}
                name="price"
                className="input"
                type="number"
                inputMode="numeric"
                min="0"
                dir="ltr"
                defaultValue={item.price}
                disabled={free}
              />
            </div>
            <label className="mb-3 flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                name="isFree"
                checked={free}
                onChange={(e) => setFree(e.target.checked)}
              />{" "}
              חינם
            </label>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-brand flex-1" type="submit">שמירה</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEditing(false)}>ביטול</button>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Card className="p-4" as="article">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-black">{item.title}</h2>
          <p className="mt-1 text-sm text-muted">{item.description}</p>
        </div>
        <div className="rounded-2xl bg-surface-2 px-3 py-2 text-sm font-black text-brand whitespace-nowrap">
          {item.isFree ? "חינם" : fmtILS(item.price)}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span>
          {item.sellerName} · דירה {item.unit} · {relativeTime(item.date)}
        </span>
        <CategoryBadge category={item.category} />
      </div>
      {canManage && (
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="tap inline-flex items-center gap-1.5 rounded-xl bg-surface-2 px-3 py-1.5 text-xs font-bold text-text"
          >
            <Pencil size={14} /> עריכה
          </button>
          <form
            action={deleteMarketAction}
            onSubmit={(e) => {
              if (!confirm("למחוק את המודעה?")) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              className="tap inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold"
              style={{
                background: "var(--danger-soft)",
                color: "var(--danger)",
              }}
            >
              <Trash2 size={14} /> מחיקה
            </button>
          </form>
        </div>
      )}
    </Card>
  );
}
