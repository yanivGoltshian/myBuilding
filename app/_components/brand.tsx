import type { CSSProperties } from "react";

/**
 * ועד — brand logo system.
 * A realistic 3D glass tower: steel-blue curtain-wall glass with a shadowed
 * side face, thin mullions + floor lines, a diagonal specular glint, a slim
 * rooftop antenna and a soft ground shadow — on a clean light tile.
 * Premium, hi-tech, white-label safe.
 *
 * `uid` makes gradient/clip ids unique so several marks can render on one page.
 * No hooks / no "use client" → safe in both Server and Client Components.
 */

export function BrandMark({
  size = 40,
  uid = "",
  className,
  style,
}: {
  size?: number;
  uid?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const p = uid ? `-${uid}` : "";
  const glass = `glass${p}`;
  const side = `side${p}`;
  const gnd = `gnd${p}`;
  const tile = `tile${p}`;
  const fclip = `fclip${p}`;

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
        <linearGradient id={tile} x1="0" y1="0" x2="0" y2="512" gradientUnits="userSpaceOnUse">
          <stop stopColor="#eaf3ff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={glass} x1="0" y1="112" x2="0" y2="432" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f2f8ff" />
          <stop offset="0.32" stopColor="#bcdcff" />
          <stop offset="0.64" stopColor="#6fa8e6" />
          <stop offset="1" stopColor="#3f83cf" />
        </linearGradient>
        <linearGradient id={side} x1="300" y1="112" x2="334" y2="432" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2b5ea3" />
          <stop offset="1" stopColor="#123163" />
        </linearGradient>
        <radialGradient id={gnd} cx="262" cy="440" r="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#294a7a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#294a7a" stopOpacity="0" />
        </radialGradient>
        <clipPath id={fclip}>
          <rect x="182" y="112" width="118" height="320" />
        </clipPath>
      </defs>

      {/* clean light tile */}
      <rect width="512" height="512" rx="112" fill={`url(#${tile})`} />
      <rect data-edge="1" x="3" y="3" width="506" height="506" rx="109" fill="none" stroke="#dbe6f7" strokeWidth="3" />

      {/* faint skyline depth behind the tower */}
      <rect x="150" y="196" width="30" height="236" fill="#9ec2ee" opacity="0.35" />
      <rect x="330" y="168" width="26" height="264" fill="#b7d3f4" opacity="0.5" />

      {/* soft ground shadow */}
      <ellipse cx="262" cy="440" rx="150" ry="15" fill={`url(#${gnd})`} />

      {/* shadowed side (receding) face */}
      <path d="M300 112 L334 134 L334 412 L300 432 Z" fill={`url(#${side})`} />
      <path d="M300 112 L334 134 L334 146 L300 124 Z" fill="#9db6d8" opacity="0.85" />

      {/* front glass face */}
      <rect x="182" y="112" width="118" height="320" fill={`url(#${glass})`} />
      <rect x="180" y="105" width="122" height="10" rx="3" fill="#cdddf3" />

      {/* mullions + floor lines + specular glint (clipped to the front face) */}
      <g clipPath={`url(#${fclip})`}>
        {[1, 2, 3, 4].map((k) => (
          <line
            key={k}
            x1={182 + (118 * k) / 5}
            y1="115"
            x2={182 + (118 * k) / 5}
            y2="432"
            stroke="#ffffff"
            strokeOpacity="0.28"
            strokeWidth="1.4"
          />
        ))}
        {Array.from({ length: 15 }, (_, i) => 132 + i * 19).map((y) => (
          <line key={y} x1="182" y1={y} x2="300" y2={y} stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.2" />
        ))}
        <path d="M182 250 L300 140 L300 200 L182 310 Z" fill="#ffffff" opacity="0.14" />
      </g>

      {/* slim rooftop antenna */}
      <line x1="241" y1="106" x2="241" y2="65" stroke="#b9cbe6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="241" cy="62" r="4.5" fill="#2563eb" />
    </svg>
  );
}

export function BrandLogo({
  size = 36,
  uid = "logo",
  wordmark = true,
  className,
}: {
  size?: number;
  uid?: string;
  wordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-black ${className ?? ""}`}>
      <BrandMark size={size} uid={uid} className="rounded-[26%] shadow-sm" />
      {wordmark ? (
        <span className="leading-none tracking-tight" style={{ fontSize: size * 0.5 }}>
          ועד
        </span>
      ) : null}
    </span>
  );
}
