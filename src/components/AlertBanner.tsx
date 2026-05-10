import { memo, useMemo } from 'react';
import type { PortfolioCompany } from '../types';
import { formatPercent } from '../utils/formatters';
import { IconWarningTriangle } from '../icons';

interface Props { companies: PortfolioCompany[] }

const AlertBanner = memo(({ companies }: Props) => {
  const atRisk = useMemo(
    () => companies.filter((c) => c.ebitdaMargin < 0),
    [companies]
  );

  if (!atRisk.length) return null;

  const names = atRisk
    .map((c) => `${c.name} (${formatPercent(c.ebitdaMargin)})`)
    .join(' · ');

  const headline = `${atRisk.length} portfolio ${atRisk.length === 1 ? 'company' : 'companies'} with negative EBITDA margin`;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="flex items-start gap-3 rounded-xl px-5 py-4 mb-6"
      style={{
        background: 'rgba(245,158,11,0.07)',
        border: '1px solid rgba(245,158,11,0.20)',
      }}
    >
      <IconWarningTriangle
        size={15}
        color="var(--na-amber)"
        aria-hidden="true"
        className="mt-0.5 shrink-0"
      />
      <div>
        <p className="m-0 text-sm font-semibold" style={{ color: 'var(--na-amber)', fontFamily: "'DM Sans', sans-serif" }}>
          {headline}
        </p>
        <p className="m-0 mt-1 text-xs" style={{ color: 'rgba(245,158,11,0.65)', fontFamily: "'DM Sans', sans-serif" }}>
          {names}
        </p>
      </div>
    </div>
  );
});

AlertBanner.displayName = 'AlertBanner';
export default AlertBanner;
