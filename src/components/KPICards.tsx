import { memo, useMemo } from 'react';
import { Row, Col } from 'antd';
import type { Fund } from '../types';
import { formatNav, formatMultiple, formatPercent } from '../utils/formatters';
import {
  IconTrendUp, IconTrendDown,
  IconLayers, IconDistribution, IconResidual, IconNavValue,
} from '../icons';

interface Props { fund: Fund }

interface KPI {
  id:          string;
  label:       string;
  value:       string;
  description: string;
  badge?:      string;
  badgePositive?: boolean;
  accent:      string;
  icon:        React.ReactNode;
  ariaLabel:   string;
  delay:       number;
}

const KPICards = memo(({ fund }: Props) => {
  const kpis = useMemo<KPI[]>(() => {
    const m = fund.metrics;
    return [
      {
        id: 'irr', label: 'IRR', value: formatPercent(m.irr),
        description: 'Internal Rate of Return',
        badge: m.irr >= 15 ? 'Strong' : m.irr >= 8 ? 'Moderate' : 'Below target',
        badgePositive: m.irr >= 15,
        accent: m.irr >= 15 ? 'var(--na-green)' : m.irr >= 8 ? 'var(--na-amber)' : 'var(--na-red)',
        icon: m.irr >= 10
          ? <IconTrendUp  size={15} color={m.irr >= 15 ? 'var(--na-green)' : 'var(--na-amber)'} />
          : <IconTrendDown size={15} color="var(--na-red)" />,
        ariaLabel: `IRR: ${formatPercent(m.irr)} — ${m.irr >= 15 ? 'Strong performance' : m.irr >= 8 ? 'Moderate performance' : 'Below target'}`,
        delay: 0,
      },
      {
        id: 'tvpi', label: 'TVPI', value: formatMultiple(m.tvpi),
        description: 'Total Value to Paid-In',
        badge: m.tvpi >= 1.5 ? 'Strong' : 'Growing',
        badgePositive: m.tvpi >= 1.5,
        accent: m.tvpi >= 1.5 ? 'var(--na-green)' : 'var(--na-ice)',
        icon: <IconLayers size={15} color={m.tvpi >= 1.5 ? 'var(--na-green)' : 'var(--na-ice)'} />,
        ariaLabel: `TVPI: ${formatMultiple(m.tvpi)} — Total value to paid-in capital`,
        delay: 60,
      },
      {
        id: 'dpi', label: 'DPI', value: formatMultiple(m.dpi),
        description: 'Distributions to Paid-In',
        badge: m.dpi >= 1.0 ? 'Capital returned' : 'Unrealised',
        badgePositive: m.dpi >= 1.0,
        accent: m.dpi >= 1.0 ? 'var(--na-green)' : 'var(--na-ice)',
        icon: <IconDistribution size={15} color={m.dpi >= 1.0 ? 'var(--na-green)' : 'var(--na-ice)'} />,
        ariaLabel: `DPI: ${formatMultiple(m.dpi)} — Distributions to paid-in capital`,
        delay: 120,
      },
      {
        id: 'rvpi', label: 'RVPI', value: formatMultiple(m.rvpi),
        description: 'Residual Value to Paid-In',
        accent: 'var(--na-ice)',
        icon: <IconResidual size={15} color="var(--na-ice)" />,
        ariaLabel: `RVPI: ${formatMultiple(m.rvpi)} — Residual value to paid-in capital`,
        delay: 180,
      },
      {
        id: 'nav', label: 'NAV', value: formatNav(m.nav),
        description: 'Net Asset Value',
        accent: 'var(--na-ice)',
        icon: <IconNavValue size={15} color="var(--na-ice)" />,
        ariaLabel: `NAV: ${formatNav(m.nav)} — Current net asset value`,
        delay: 240,
      },
    ];
  }, [fund.metrics]);

  return (
    <section aria-label="Key performance indicators">
      <Row gutter={[16, 16]} className="mb-6">
        {kpis.map((kpi) => (
          <Col key={kpi.id} xs={12} sm={8} md={8} lg={4} xl={4}>
            <article
              className="na-card kpi-animate rounded-xl h-full"
              style={{ padding: '18px 20px', animationDelay: `${kpi.delay}ms` }}
              aria-label={kpi.ariaLabel}
            >
              {/* Label row */}
              <div className="flex items-center justify-between mb-3">
                <span className="kpi-label">{kpi.label}</span>
                <span aria-hidden="true">{kpi.icon}</span>
              </div>

              {/* Value */}
              <p
                className="m-0 font-bold leading-none tabular-nums num"
                style={{
                  fontSize: 22,
                  color: kpi.accent,
                  fontFamily: "'DM Mono', monospace",
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {kpi.value}
              </p>

              {/* Description */}
              <p className="m-0 mt-2 leading-snug" style={{ fontSize: 11, color: 'var(--na-faint)' }}>
                {kpi.description}
              </p>

              {/* Badge */}
              {kpi.badge && (
                <div className="mt-3">
                  <span
                    className="inline-block text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded"
                    style={{
                      background: kpi.badgePositive
                        ? 'rgba(76,175,130,0.12)' : 'rgba(106,176,212,0.10)',
                      color: kpi.badgePositive ? 'var(--na-green)' : 'var(--na-ice)',
                    }}
                  >
                    {kpi.badge}
                  </span>
                </div>
              )}

              {/* Bottom accent bar */}
              <div
                aria-hidden="true"
                className="mt-3 h-px rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${kpi.accent} 0%, transparent 100%)`,
                  opacity: 0.35,
                }}
              />
            </article>
          </Col>
        ))}
      </Row>
    </section>
  );
});

KPICards.displayName = 'KPICards';
export default KPICards;
