import { memo, useMemo, useId } from 'react';
import { Switch } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { Fund } from '../types';
import { formatNav, formatMonth } from '../utils/formatters';
import { IconCalendar, IconCompare } from '../icons';

interface Props {
  funds:               Fund[];
  activeFund:          Fund;
  compareMode:         boolean;
  onCompareModeChange: (val: boolean) => void;
  navRange:            NavRange;
  onRangeChange:       (r: NavRange) => void;
}

export type NavRange = 1 | 3 | 6 | 12;

const RANGE_OPTIONS: { label: string; value: NavRange }[] = [
  { label: '1M', value: 1  },
  { label: '3M', value: 3  },
  { label: '6M', value: 6  },
  { label: '12M',value: 12 },
];

const FUND_COLORS: Record<string, string> = {
  'fund-001': '#6ab0d4',
  'fund-002': '#a78bfa',
  'fund-003': '#4caf82',
};

/* ── Tooltip ──────────────────────────────────────────────────────── */
interface TooltipEntry { name: string; value: number; color: string; dataKey: string }
interface TooltipProps  { active?: boolean; payload?: TooltipEntry[]; label?: string }

const DarkTooltip = memo(({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      role="tooltip"
      aria-live="polite"
      className="rounded-xl px-4 py-3 text-sm"
      style={{
        background:    'var(--na-card)',
        border:        '1px solid var(--na-border-strong)',
        backdropFilter:'blur(12px)',
        boxShadow:     'var(--na-shadow-card)',
        fontFamily:    "'DM Sans', sans-serif",
      }}
    >
      <p className="text-[10px] tracking-widest uppercase mb-2 m-0" style={{ color: 'var(--na-muted)' }}>
        {label ? formatMonth(label) : ''}
      </p>
      {payload.map((e) => (
        <div key={e.dataKey} className="flex items-center justify-between gap-6 mb-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: e.color }} aria-hidden="true" />
            <span className="text-[11px]" style={{ color: 'var(--na-muted)' }}>{e.name}</span>
          </div>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: e.color, fontFamily: "'DM Mono', monospace", fontVariantNumeric: 'tabular-nums' }}
          >
            {formatNav(e.value)}
          </span>
        </div>
      ))}
    </div>
  );
});
DarkTooltip.displayName = 'DarkTooltip';

/* ── Chart ────────────────────────────────────────────────────────── */
const NAVChart = memo(({ funds, activeFund, compareMode, onCompareModeChange, navRange, onRangeChange }: Props) => {
  const chartId    = useId();
  const descId     = `${chartId}-desc`;
  const switchId   = `${chartId}-switch`;

  /* Slice navHistory to the selected range */
  const singleData = useMemo(
    () => activeFund.navHistory.slice(-navRange).map((p) => ({ month: p.month, nav: p.nav })),
    [activeFund.navHistory, navRange]
  );

  const overlayData = useMemo(() => {
    const sliced = funds[0].navHistory.slice(-navRange);
    return sliced.map((_, i) => {
      const actualIndex = funds[0].navHistory.length - navRange + i;
      return Object.assign(
        { month: funds[0].navHistory[actualIndex].month },
        ...funds.map((f) => ({ [f.id]: f.navHistory[actualIndex]?.nav ?? 0 }))
      );
    });
  }, [funds, navRange]);

  const yDomain = useMemo((): [number, number] => {
    const vals = compareMode
      ? funds.flatMap((f) => f.navHistory.slice(-navRange).map((p) => p.nav))
      : activeFund.navHistory.slice(-navRange).map((p) => p.nav);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.12;
    return [Math.max(0, min - pad), max + pad];
  }, [compareMode, funds, activeFund.navHistory, navRange]);

  const chartData  = compareMode ? overlayData : singleData;
  const rangeLabel = navRange === 12 ? '12-Month' : navRange === 6 ? '6-Month' : navRange === 3 ? '3-Month' : '1-Month';

  /* Accessible summary for screen readers */
  const firstVal = chartData[0];
  const lastVal  = chartData[chartData.length - 1];
  const srDesc   = compareMode
    ? `Multi-fund NAV comparison chart over the last ${navRange} month${navRange > 1 ? 's' : ''}.`
    : `NAV chart for ${activeFund.name} over the last ${navRange} month${navRange > 1 ? 's' : ''}. ` +
      `Starting value ${firstVal ? formatNav(('nav' in firstVal ? firstVal.nav : 0) as number) : ''}, ` +
      `ending value ${lastVal ? formatNav(('nav' in lastVal ? lastVal.nav : 0) as number) : ''}.`;

  return (
    <section
      aria-label={`NAV performance chart — ${rangeLabel} trend`}
      className="na-card-static rounded-xl mb-6"
      style={{ padding: '20px 24px 16px' }}
    >
      {/* ── Card header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="kpi-label m-0 mb-1">NAV Performance</p>
          <p className="text-base font-semibold m-0 tracking-tight" style={{ color: 'var(--na-text)', fontFamily: "'DM Sans', sans-serif" }}>
            {rangeLabel} Trend{compareMode ? ' — All Funds' : ` — ${activeFund.name}`}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* ── Date range pills ── */}
          <div role="group" aria-label="Select NAV history range" className="flex items-center gap-1">
            <IconCalendar size={13} color="var(--na-faint)" aria-hidden="true" />
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r.value}
                type="button"
                className="range-btn"
                aria-pressed={navRange === r.value}
                aria-label={`Show ${r.label} of NAV history`}
                onClick={() => onRangeChange(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* ── Compare toggle ── */}
          <label htmlFor={switchId} className="flex items-center gap-2 cursor-pointer select-none">
            <IconCompare size={13} color="var(--na-faint)" aria-hidden="true" />
            <span className="text-[11px] tracking-wider uppercase" style={{ color: 'var(--na-faint)' }}>
              {compareMode ? 'All funds' : 'Single'}
            </span>
            <Switch
              id={switchId}
              size="small"
              checked={compareMode}
              onChange={onCompareModeChange}
              aria-label={`${compareMode ? 'Disable' : 'Enable'} multi-fund NAV comparison`}
              style={{ background: compareMode ? 'var(--na-ice)' : undefined }}
            />
          </label>
        </div>
      </div>

      {/* ── Screen-reader chart description ── */}
      <p id={descId} className="sr-only">{srDesc}</p>

      {/* ── Chart ── */}
      <div
        role="img"
        aria-label={`Line chart: ${srDesc}`}
        aria-describedby={descId}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fontSize: 11, fill: 'var(--na-faint)', fontFamily: "'DM Sans', sans-serif" }}
              axisLine={{ stroke: 'var(--na-border)' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatNav}
              tick={{ fontSize: 11, fill: 'var(--na-faint)', fontFamily: "'DM Mono', monospace" }}
              axisLine={false}
              tickLine={false}
              width={72}
              domain={yDomain}
            />
            <Tooltip content={<DarkTooltip />} />
            {compareMode && (
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12, fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.5)' }} />
            )}

            {compareMode
              ? funds.map((f) => (
                  <Line
                    key={f.id}
                    type="monotone"
                    dataKey={f.id}
                    name={f.name}
                    stroke={FUND_COLORS[f.id]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))
              : (
                <Line
                  type="monotone"
                  dataKey="nav"
                  name={activeFund.name}
                  stroke={FUND_COLORS[activeFund.id] ?? '#6ab0d4'}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: FUND_COLORS[activeFund.id] ?? '#6ab0d4' }}
                />
              )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
});

NAVChart.displayName = 'NAVChart';
export default NAVChart;
