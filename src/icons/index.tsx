/**
 * Nordic Analytics — Custom SVG Icon Library
 * All icons: 16×16 viewport, 1.5px stroke, round caps/joins, no fill unless noted.
 */

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

const defaults: IconProps = { size: 16, color: 'currentColor', 'aria-hidden': true };

// ── Trend / Performance ──────────────────────────────────────────────

export function IconTrendUp({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <polyline points="1,11 5,6 9,8.5 15,3" />
      <polyline points="10.5,3 15,3 15,7.5" />
    </svg>
  );
}

export function IconTrendDown({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <polyline points="1,5 5,10 9,7.5 15,13" />
      <polyline points="10.5,13 15,13 15,8.5" />
    </svg>
  );
}

export function IconTrendFlat({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <line x1="1" y1="8" x2="12" y2="8" />
      <polyline points="9,5 12,8 9,11" />
    </svg>
  );
}

// ── Finance / Metrics ────────────────────────────────────────────────

export function IconLayers({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <polygon points="8,1.5 14.5,5 8,8.5 1.5,5" />
      <polyline points="1.5,9 8,12.5 14.5,9" />
      <polyline points="1.5,12 8,15.5 14.5,12" />
    </svg>
  );
}

export function IconDollarCircle({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5v7M6 6.5c0-1 .9-2 2-2s2 .9 2 2c0 1.5-4 1.5-4 3s.9 2 2 2 2-.9 2-2" />
    </svg>
  );
}

export function IconDistribution({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <rect x="1.5" y="2.5" width="4" height="11" rx="1" />
      <rect x="6" y="5.5" width="4" height="8" rx="1" />
      <rect x="10.5" y="8" width="4" height="5.5" rx="1" />
      <polyline points="3.5,2.5 3.5,1 12.5,1 12.5,8" />
    </svg>
  );
}

export function IconResidual({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 8 L8 4.5" />
      <path d="M8 8 L11 10.5" />
      <circle cx="8" cy="8" r="1" fill={color} stroke="none" />
    </svg>
  );
}

export function IconNavValue({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <polyline points="1,12 4,7 7,9 10,5 13,7 15,4" />
      <line x1="1" y1="14" x2="15" y2="14" />
    </svg>
  );
}

// ── Status / Alerts ──────────────────────────────────────────────────

export function IconWarningTriangle({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <path d="M8 1.5 L14.5 13.5 H1.5 Z" />
      <line x1="8" y1="6.5" x2="8" y2="9.5" />
      <circle cx="8" cy="11.5" r="0.5" fill={color} stroke="none" />
    </svg>
  );
}

export function IconDangerCircle({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="5" x2="8" y2="9" />
      <circle cx="8" cy="11" r="0.5" fill={color} stroke="none" />
    </svg>
  );
}

// ── UI / Controls ────────────────────────────────────────────────────

export function IconSearch({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <circle cx="7" cy="7" r="5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" />
    </svg>
  );
}

export function IconCompare({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <path d="M4 2.5 C4 2.5 2 5 2 8s2 5.5 2 5.5" />
      <path d="M12 2.5 C12 2.5 14 5 14 8s-2 5.5-2 5.5" />
      <line x1="8" y1="1.5" x2="8" y2="14.5" strokeDasharray="2 2" />
    </svg>
  );
}

export function IconCalendar({ size = 16, color = 'currentColor', className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden={rest['aria-hidden'] ?? defaults['aria-hidden']}>
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
      <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" />
      <line x1="5" y1="1" x2="5" y2="4" />
      <line x1="11" y1="1" x2="11" y2="4" />
      <rect x="4.5" y="9" width="2.5" height="2.5" rx="0.5" fill={color} stroke="none" opacity="0.7" />
      <rect x="9" y="9" width="2.5" height="2.5" rx="0.5" fill={color} stroke="none" opacity="0.4" />
    </svg>
  );
}

// ── Logo / Brand ─────────────────────────────────────────────────────

/**
 * Nordic Analytics nav mark — diagonal arrow pointing northeast,
 * matching the slash/arrow icon visible in the site's nav bar.
 */
export function IconNavMark({ size = 16, color = '#6ab0d4' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {/* Diagonal shaft bottom-left → top-right */}
      <line x1="3.5" y1="12.5" x2="12.5" y2="3.5" />
      {/* Arrow head (top-right corner) */}
      <polyline points="7,3.5 12.5,3.5 12.5,9" />
    </svg>
  );
}

/** Animated live pulse dot */
export function IconLiveDot({ size = 8 }: { size?: number }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }} aria-hidden="true">
      <span
        className="absolute inline-flex rounded-full opacity-75 animate-ping"
        style={{ width: size, height: size, background: '#4caf82' }}
      />
      <span
        className="relative inline-flex rounded-full"
        style={{ width: size, height: size, background: '#4caf82' }}
      />
    </span>
  );
}
