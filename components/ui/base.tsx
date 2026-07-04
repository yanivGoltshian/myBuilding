import type { ReactNode } from "react";
import { initials } from "@/lib/format";

export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return <Tag className={`card ${className}`}>{children}</Tag>;
}

type BadgeTone = "brand" | "success" | "warning" | "danger" | "info" | "muted";

export function Badge({
  children,
  tone = "muted",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>;
}

export function IconTile({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone | "plain";
  className?: string;
}) {
  const bg: Record<string, string> = {
    brand: "color-mix(in srgb, var(--brand) 14%, transparent)",
    success: "var(--success-soft)",
    warning: "var(--warning-soft)",
    danger: "var(--danger-soft)",
    info: "var(--info-soft)",
    muted: "var(--surface-2)",
    plain: "var(--surface-2)",
  };
  const fg: Record<string, string> = {
    brand: "var(--brand)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    info: "var(--info)",
    muted: "var(--muted)",
    plain: "var(--text)",
  };
  return (
    <span
      className={`icon-tile ${className}`}
      style={{ background: bg[tone], color: fg[tone] }}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  title,
  action,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      <h2 className="section-title">{title}</h2>
      {action}
    </div>
  );
}

export function Avatar({
  name,
  size = 40,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`grid place-items-center rounded-full font-bold text-brand-ink flex-none ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: "var(--brand)",
      }}
    >
      {initials(name)}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  sub,
}: {
  icon?: ReactNode;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {icon && (
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-surface-2 text-faint">
          {icon}
        </div>
      )}
      <p className="font-semibold">{title}</p>
      {sub && <p className="text-sm text-muted mt-1 max-w-xs">{sub}</p>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "muted",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-muted">{label}</span>
        {icon && <IconTile tone={tone} className="!h-8 !w-8 !rounded-lg">{icon}</IconTile>}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </Card>
  );
}
