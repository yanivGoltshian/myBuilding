import type { CSSProperties } from "react";

/**
 * ועד — brand logo system.
 * A premium building skyline: a broadcasting rooftop beacon (smart, connected),
 * warm amber lit windows (inviting / "home is on"), and an arch community
 * entrance — on the indigo→violet brand gradient. White-label safe.
 *
 * Two tile variants:
 *  - "brand": gradient tile + white skyline. For light backgrounds.
 *  - "glass": translucent white tile. For placement on the brand gradient.
 */

type Variant = "brand" | "glass";

function Skyline({ idp }: { idp: string }) {
  return (
    <g>
      {/* ground platform */}
      <rect x="100" y="402" width="312" height="13" rx="6.5" fill="#ffffff" opacity="0.42" />

      {/* side towers */}
      <rect x="124" y="220" width="86" height="186" rx="16" fill={`url(#${idp}-tower)`} opacity="0.92" />
      <rect x="304" y="256" width="86" height="150" rx="16" fill={`url(#${idp}-tower)`} opacity="0.85" />

      {/* center tower */}
      <rect x="196" y="132" width="120" height="274" rx="22" fill={`url(#${idp}-tower)`} />

      {/* rooftop broadcasting beacon (smart building) */}
      <path d="M232 90 Q256 66 280 90" stroke="#ffd27a" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M242 92 Q256 77 270 92" stroke="#ffd27a" strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="252" y="100" width="8" height="36" rx="4" fill={`url(#${idp}-tower)`} />
      <circle cx="256" cy="98" r="17" fill={`url(#${idp}-warm)`} opacity="0.28" />
      <circle cx="256" cy="98" r="9" fill={`url(#${idp}-warm)`} />

      {/* warm lit windows — center tower (3 × 4) */}
      <g fill={`url(#${idp}-warm)`}>
        <rect x="209" y="158" width="26" height="26" rx="7" />
        <rect x="243" y="158" width="26" height="26" rx="7" />
        <rect x="277" y="158" width="26" height="26" rx="7" />
        <rect x="209" y="198" width="26" height="26" rx="7" opacity="0.5" />
        <rect x="243" y="198" width="26" height="26" rx="7" />
        <rect x="277" y="198" width="26" height="26" rx="7" />
        <rect x="209" y="238" width="26" height="26" rx="7" />
        <rect x="243" y="238" width="26" height="26" rx="7" />
        <rect x="277" y="238" width="26" height="26" rx="7" opacity="0.5" />
        <rect x="209" y="278" width="26" height="26" rx="7" />
        <rect x="243" y="278" width="26" height="26" rx="7" opacity="0.5" />
        <rect x="277" y="278" width="26" height="26" rx="7" />
      </g>

      {/* side tower windows */}
      <g fill={`url(#${idp}-warm)`}>
        <rect x="155" y="252" width="24" height="22" rx="6" opacity="0.9" />
        <rect x="155" y="292" width="24" height="22" rx="6" opacity="0.9" />
        <rect x="155" y="332" width="24" height="22" rx="6" opacity="0.55" />
        <rect x="335" y="288" width="24" height="22" rx="6" opacity="0.85" />
        <rect x="335" y="328" width="24" height="22" rx="6" opacity="0.65" />
      </g>

      {/* arch community entrance */}
      <path d="M232 406 L232 364 A24 24 0 0 1 280 364 L280 406 Z" fill={`url(#${idp}-warm)`} />
    </g>
  );
}

export function BrandMark({
  size = 40,
  variant = "brand",
  className,
  style,
}: {
  size?: number;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
}) {
  const idp = `vaad-${variant}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      role="img"
      aria-label="ועד"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={`${idp}-tile`} x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="0.55" stopColor="#6d28d9" />
          <stop offset="1" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id={`${idp}-tower`} x1="0" y1="120" x2="0" y2="414" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e8eafe" />
        </linearGradient>
        <linearGradient id={`${idp}-warm`} x1="0" y1="88" x2="0" y2="410" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffe08a" />
          <stop offset="1" stopColor="#ff9d2f" />
        </linearGradient>
        <radialGradient id={`${idp}-glow`} cx="170" cy="150" r="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${idp}-vig`} cx="300" cy="480" r="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1b0b3a" stopOpacity="0.16" />
          <stop offset="1" stopColor="#1b0b3a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {variant === "brand" ? (
        <>
          <rect width="512" height="512" rx="112" fill={`url(#${idp}-tile)`} />
          <rect width="512" height="512" rx="112" fill={`url(#${idp}-glow)`} />
          <rect width="512" height="512" rx="112" fill={`url(#${idp}-vig)`} />
        </>
      ) : (
        <>
          <rect width="512" height="512" rx="132" fill="#ffffff" fillOpacity="0.16" />
          <rect x="6" y="6" width="500" height="500" rx="126" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="6" />
        </>
      )}

      <Skyline idp={idp} />
    </svg>
  );
}

export function BrandLogo({
  size = 36,
  variant = "brand",
  wordmark = true,
  className,
}: {
  size?: number;
  variant?: Variant;
  wordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-black ${className ?? ""}`}>
      <BrandMark size={size} variant={variant} className="rounded-[26%] shadow-sm" />
      {wordmark ? (
        <span className="leading-none tracking-tight" style={{ fontSize: size * 0.5 }}>
          ועד
        </span>
      ) : null}
    </span>
  );
}
