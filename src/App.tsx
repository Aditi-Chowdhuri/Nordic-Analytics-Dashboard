import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { ConfigProvider, Tabs, Tag, theme as antTheme } from 'antd';
import type { TabsProps } from 'antd';
import type { Fund } from './types';
import type { NavRange } from './components/NAVChart';
import { useFunds } from './hooks/useFunds';
import KPICards from './components/KPICards';
import AlertBanner from './components/AlertBanner';
import PortfolioTable from './components/PortfolioTable';
import { IconNavMark } from './icons';

const NAVChart = lazy(() => import('./components/NAVChart'));

const FUND_TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  'Private Equity': { bg: 'rgba(106,176,212,0.12)', text: '#6ab0d4' },
  'Venture Capital': { bg: 'rgba(167,139,250,0.12)', text: '#a78bfa' },
  'Growth Equity':  { bg: 'rgba(76,175,130,0.12)',  text: '#4caf82' },
};

/* ── Skeleton ─────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-40 pb-12" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-7 w-64 skeleton rounded mb-6" />
      <div className="grid grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 skeleton rounded-xl" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="h-90 skeleton rounded-xl mb-6" />
      <div className="h-64 skeleton rounded-xl" />
    </div>
  );
}

/* ── App ──────────────────────────────────────────────────────────── */
export default function App() {
  const { data: funds, isLoading, isError } = useFunds();

  const [isDark, setIsDark]             = useState(true);
  const [activeFundId, setActiveFundId] = useState<string>('fund-001');
  const [compareMode, setCompareMode]   = useState(false);
  const [navRange, setNavRange]         = useState<NavRange>(12);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.style.backgroundColor = isDark ? '#040914' : '#f0f4f8';
  }, [isDark]);

  const activeFund = useMemo(
    () => funds?.find((f) => f.id === activeFundId) ?? funds?.[0],
    [activeFundId, funds]
  );

  const handleFundChange        = useCallback((key: string) => setActiveFundId(key), []);
  const handleCompareModeChange = useCallback((val: boolean) => setCompareMode(val), []);
  const handleRangeChange       = useCallback((r: NavRange) => setNavRange(r), []);

  const tabItems = useMemo<TabsProps['items']>(
    () =>
      (funds ?? []).map((f: Fund) => {
        const tc = FUND_TYPE_COLOR[f.type] ?? { bg: 'rgba(255,255,255,0.1)', text: '#fff' };
        return {
          key: f.id,
          label: (
            <div className="flex flex-col items-start py-0.5 text-left">
              <span className="text-sm font-semibold leading-snug tracking-tight">{f.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded"
                  style={{ background: tc.bg, color: tc.text }}
                >
                  {f.type}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--na-faint)' }}>
                  Vintage {f.vintage}
                </span>
              </div>
            </div>
          ),
        };
      }),
    [funds]
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary:        isDark ? '#6ab0d4' : '#2b7aaa',
          colorBgBase:         isDark ? '#040914' : '#f0f4f8',
          colorBorder:         isDark ? 'rgba(106,176,212,0.15)' : 'rgba(43,122,170,0.20)',
          colorBorderSecondary:isDark ? 'rgba(106,176,212,0.08)' : 'rgba(43,122,170,0.10)',
          fontFamily:          "'DM Sans', system-ui, sans-serif",
          borderRadius:        10,
          colorLink:           isDark ? '#6ab0d4' : '#2b7aaa',
          colorLinkHover:      isDark ? '#4B7A9E' : '#1e5e85',
          colorText:           isDark ? 'rgba(255,255,255,0.90)' : 'rgba(15,23,42,0.90)',
          colorTextSecondary:  isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.55)',
          colorTextTertiary:   isDark ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.35)',
          colorFillAlter:      isDark ? 'rgba(255,255,255,0.04)' : 'rgba(43,122,170,0.04)',
        },
        components: {
          Card:  {
            colorBgContainer:    isDark ? 'rgba(13,27,46,0.60)'   : 'rgba(255,255,255,0.80)',
            colorBorderSecondary:isDark ? 'rgba(106,176,212,0.10)': 'rgba(43,122,170,0.12)',
            paddingLG: 20,
          },
          Table: {
            colorBgContainer:      'transparent',
            headerBg:              isDark ? 'rgba(8,17,32,0.60)'     : 'rgba(226,234,242,0.80)',
            headerColor:           isDark ? 'rgba(255,255,255,0.40)' : 'rgba(15,23,42,0.50)',
            headerSortActiveBg:    isDark ? 'rgba(5,13,30,0.85)'     : 'rgba(210,222,232,0.90)',
            headerSortHoverBg:     isDark ? 'rgba(8,17,32,0.75)'     : 'rgba(218,228,238,0.85)',
            bodySortBg:            'transparent',
            fixedHeaderSortActiveBg: isDark ? 'rgba(5,13,30,0.85)'  : 'rgba(210,222,232,0.90)',
            rowHoverBg:            isDark ? 'rgba(106,176,212,0.04)' : 'rgba(43,122,170,0.04)',
            borderColor:           isDark ? 'rgba(106,176,212,0.08)' : 'rgba(43,122,170,0.08)',
            fontSize: 13,
          },
          Tooltip: {
            colorBgSpotlight:   isDark ? 'rgba(8,17,32,0.97)'    : 'rgba(15,23,42,0.88)',
            colorTextLightSolid:isDark ? 'rgba(255,255,255,0.85)': 'rgba(255,255,255,0.90)',
          },
          Tabs: {
            inkBarColor:         '#6ab0d4',
            itemSelectedColor:   isDark ? '#6ab0d4' : '#2b7aaa',
            itemColor:           isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.45)',
            itemHoverColor:      isDark ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.75)',
            colorBorderSecondary:isDark ? 'rgba(106,176,212,0.10)' : 'rgba(43,122,170,0.12)',
          },
          Input: {
            colorBgContainer:    isDark ? 'rgba(13,27,46,0.60)'   : 'rgba(255,255,255,0.90)',
            colorBorder:         isDark ? 'rgba(106,176,212,0.15)': 'rgba(43,122,170,0.22)',
            activeBorderColor:   isDark ? '#6ab0d4' : '#2b7aaa',
            hoverBorderColor:    isDark ? 'rgba(106,176,212,0.40)': 'rgba(43,122,170,0.45)',
            colorText:           isDark ? 'rgba(255,255,255,0.85)': 'rgba(15,23,42,0.90)',
            colorTextPlaceholder:isDark ? 'rgba(255,255,255,0.25)': 'rgba(15,23,42,0.30)',
          },
          Switch:{ colorPrimary: isDark ? '#6ab0d4' : '#2b7aaa', colorPrimaryHover: isDark ? '#4B7A9E' : '#1e5e85' },
          Tag:   { defaultBg: isDark ? 'rgba(106,176,212,0.10)' : 'rgba(43,122,170,0.10)', defaultColor: isDark ? '#6ab0d4' : '#2b7aaa' },
          Badge: { colorSuccess: '#4caf82' },
          Alert: { colorWarningBg: 'rgba(245,158,11,0.07)', colorWarningBorder: 'rgba(245,158,11,0.20)' },
          Select:{ colorBgContainer: isDark ? 'rgba(13,27,46,0.80)' : 'rgba(255,255,255,0.90)' },
        },
      }}
    >
      <div className="min-h-screen" data-theme={isDark ? 'dark' : 'light'}>

        {/* ── Skip link ── */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        {/* ── Nav — fixed ── */}
        <header
          role="banner"
          className="fixed top-0 left-0 right-0 z-50 flex items-center px-12 h-17"
          style={{
            background:          isDark ? 'rgba(4,9,20,0.98)' : 'rgba(240,244,248,0.98)',
            borderBottom:        '1px solid var(--na-border)',
            backdropFilter:      'blur(20px) saturate(1.4)',
            WebkitBackdropFilter:'blur(20px) saturate(1.4)',
            boxShadow:           isDark ? '0 1px 0 #0F172A' : '0 1px 0 rgba(43,122,170,0.10)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <IconNavMark size={20} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1 }}>
              <span style={{ fontWeight: 700, letterSpacing: '0.08em', color: 'var(--na-text)', textTransform: 'uppercase' }}>Nordic</span>
              <span style={{ fontWeight: 300, letterSpacing: '0.14em', color: 'var(--na-muted)', textTransform: 'uppercase' }}>&thinsp;Analytics</span>
            </span>
          </div>

          <div className="flex-1" />

          {/* ── Dark / Light sliding pill ── */}
          <button
            type="button"
            onClick={() => setIsDark((d) => !d)}
            aria-pressed={isDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="hidden sm:flex items-center cursor-pointer"
            style={{
              position:   'relative',
              border:     '1px solid var(--na-border)',
              background: isDark ? 'rgba(13,27,46,0.60)' : 'rgba(255,255,255,0.70)',
              borderRadius: 20,
              padding:    '3px 4px',
              gap:        0,
              transition: 'background 0.25s, border-color 0.25s',
            }}
          >
            {/* Sliding thumb */}
            <span
              aria-hidden="true"
              style={{
                position:     'absolute',
                top:          3,
                left:         isDark ? 3 : 'calc(50% + 1px)',
                width:        'calc(50% - 4px)',
                bottom:       3,
                borderRadius: 16,
                background:   isDark ? 'rgba(106,176,212,0.18)' : 'rgba(43,122,170,0.15)',
                border:       isDark ? '1px solid rgba(106,176,212,0.35)' : '1px solid rgba(43,122,170,0.30)',
                transition:   'left 0.22s cubic-bezier(0.4,0,0.2,1), background 0.25s',
              }}
            />
            {/* Moon label */}
            <span
              style={{
                position:     'relative',
                zIndex:       1,
                display:      'flex',
                alignItems:   'center',
                gap:          5,
                padding:      '3px 10px',
                fontFamily:   "'DM Sans', sans-serif",
                fontSize:     11,
                fontWeight:   500,
                letterSpacing:'0.09em',
                textTransform:'uppercase',
                color:        isDark ? 'var(--na-ice)' : 'var(--na-faint)',
                transition:   'color 0.2s',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M14.5 10.5A7 7 0 0 1 5.5 1.5a.5.5 0 0 0-.6-.6A8 8 0 1 0 15.1 11.1a.5.5 0 0 0-.6-.6z"/>
              </svg>
              Dark
            </span>
            {/* Sun label */}
            <span
              style={{
                position:     'relative',
                zIndex:       1,
                display:      'flex',
                alignItems:   'center',
                gap:          5,
                padding:      '3px 10px',
                fontFamily:   "'DM Sans', sans-serif",
                fontSize:     11,
                fontWeight:   500,
                letterSpacing:'0.09em',
                textTransform:'uppercase',
                color:        !isDark ? 'var(--na-ice)' : 'var(--na-faint)',
                transition:   'color 0.2s',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="8" cy="8" r="3.2"/>
                <line x1="8" y1="1" x2="8" y2="2.5"/>
                <line x1="8" y1="13.5" x2="8" y2="15"/>
                <line x1="1" y1="8" x2="2.5" y2="8"/>
                <line x1="13.5" y1="8" x2="15" y2="8"/>
                <line x1="3.05" y1="3.05" x2="4.1" y2="4.1"/>
                <line x1="11.9" y1="11.9" x2="12.95" y2="12.95"/>
                <line x1="12.95" y1="3.05" x2="11.9" y2="4.1"/>
                <line x1="4.1" y1="11.9" x2="3.05" y2="12.95"/>
              </svg>
              Light
            </span>
          </button>
        </header>

        {/* ── Fund Selector — fixed below nav ── */}
        <nav
          aria-label="Fund selector"
          className="fixed top-17 left-0 right-0 z-40 px-12"
          style={{
            background:          isDark ? 'rgba(8,17,32,0.97)' : 'rgba(240,244,248,0.97)',
            borderBottom:        '1px solid var(--na-border)',
            backdropFilter:      'blur(16px)',
            WebkitBackdropFilter:'blur(16px)',
          }}
        >
          <div className="max-w-7xl mx-auto">
            <Tabs
              activeKey={activeFundId}
              onChange={handleFundChange}
              items={tabItems}
              size="large"
              className="fund-tabs"
              aria-label="Select fund"
            />
          </div>
        </nav>

        {/* ── Main content ── */}
        <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>

          {isLoading && <DashboardSkeleton />}

          {isError && (
            <div className="max-w-7xl mx-auto px-12 pt-40" role="alert" aria-live="assertive">
              <p style={{ color: 'var(--na-red)' }}>Failed to load fund data. Please refresh the page.</p>
            </div>
          )}

          {!isLoading && !isError && activeFund && funds && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-40 pb-12">

              {/* Fund heading */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h1
                  className="text-xl font-semibold tracking-tight m-0"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--na-text)' }}
                >
                  {activeFund.name}
                </h1>
                {(() => {
                  const tc = FUND_TYPE_COLOR[activeFund.type] ?? { bg: 'rgba(255,255,255,0.1)', text: '#fff' };
                  return (
                    <Tag
                      className="text-[10px] font-medium tracking-wider uppercase"
                      style={{ background: tc.bg, color: tc.text, border: 'none' }}
                    >
                      {activeFund.type}
                    </Tag>
                  );
                })()}
                <span className="text-xs" style={{ color: 'var(--na-faint)', letterSpacing: '0.04em' }}>
                  Vintage {activeFund.vintage}
                  &nbsp;·&nbsp;
                  <span style={{ color: 'var(--na-ice)' }}>
                    ${(activeFund.totalCommitments / 1_000_000).toFixed(0)}M
                  </span>
                  &nbsp;committed
                </span>
              </div>

              <AlertBanner companies={activeFund.portfolioCompanies} />

              <KPICards fund={activeFund} />

              <Suspense
                fallback={
                  <div className="h-90 skeleton rounded-xl mb-6" aria-busy="true" aria-label="Loading chart" />
                }
              >
                <NAVChart
                  funds={funds}
                  activeFund={activeFund}
                  compareMode={compareMode}
                  onCompareModeChange={handleCompareModeChange}
                  navRange={navRange}
                  onRangeChange={handleRangeChange}
                />
              </Suspense>

              <PortfolioTable companies={activeFund.portfolioCompanies} />
            </div>
          )}
        </main>

        <footer role="contentinfo" className="max-w-7xl mx-auto px-12 py-5 border-t" style={{ borderColor: 'var(--na-border)' }}>
          <p
            style={{
              fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase',
              textAlign: 'center', margin: 0, color: 'var(--na-faint)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Nordic Analytics · Confidential · Mock data · {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </ConfigProvider>
  );
}
