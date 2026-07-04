// Hand-rolled charts (pure SVG/flex) — no chart library, SSR + RTL safe.

export function Donut({
  data,
  size = 148,
  thickness = 18,
  centerLabel,
  centerSub,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={thickness}
        />
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const seg = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            {centerLabel && (
              <div className="text-lg font-extrabold leading-none">{centerLabel}</div>
            )}
            {centerSub && (
              <div className="text-[11px] text-muted mt-1">{centerSub}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Bars({
  data,
  height = 128,
}: {
  data: { label: string; value: number; highlight?: boolean }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-lg transition-all"
            style={{
              height: `${Math.max((d.value / max) * (height - 26), 4)}px`,
              background: d.highlight ? "var(--brand)" : "var(--surface-2)",
            }}
          />
          <span className="text-[10px] text-faint">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({
  points,
  color = "var(--brand)",
  width = 120,
  height = 36,
}: {
  points: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => [
    i * step,
    height - ((p - min) / span) * (height - 4) - 2,
  ]);
  const d = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const area = `${d} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={area} fill={color} opacity={0.12} />
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProgressRing({
  value,
  size = 56,
  thickness = 6,
  color = "var(--brand)",
  children,
}: {
  value: number; // 0..1
  size?: number;
  thickness?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const len = Math.min(Math.max(value, 0), 1) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${len} ${c - len}`}
          strokeLinecap="round"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 grid place-items-center text-xs font-bold">
          {children}
        </div>
      )}
    </div>
  );
}
