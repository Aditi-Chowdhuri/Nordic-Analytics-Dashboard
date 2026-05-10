# Nordic Analytics — Fund Intelligence Dashboard

Portfolio performance dashboard built for the Nordic Analytics Round 2 technical case study.

## Running locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`. No environment variables required.

To build for production:
```bash
npm run build
npm run preview
```

---

## Key technical decisions

### Stack
| Concern | Choice | Reason |
|---|---|---|
| UI components | Ant Design v5 | Rich data-table primitives (sorting, filtering, column config) with CSS-in-JS — no stylesheet import conflicts with Tailwind |
| Charts | Recharts | Composable, TypeScript-native, works well for time-series line data |
| Styling | Tailwind CSS v4 | Utility-first layout and spacing; Ant Design's `ConfigProvider` handles component theming |
| Build | Vite + React Compiler | Sub-second HMR; the React Compiler (`babel-plugin-react-compiler`) auto-memoizes most components |
| Data fetching | TanStack Query v5 | Stale-while-revalidate caching, background refetch on window focus, 2-retry policy |

### Performance
- **Lazy loading** — `NAVChart` is loaded via `React.lazy` + `Suspense`. Recharts (~360 KB minified) only downloads after the page shell renders, keeping initial TTI low.
- **Memoization** — `useMemo` is used for derived data: KPI definitions, chart datasets, filtered table rows, Y-axis domain, and sector filter options. `useCallback` stabilises event handlers passed as props.
- **Debouncing** — the portfolio table search input debounces at 300 ms via a custom `useDebounce` hook, preventing a filter recompute on every keystroke.
- **`memo` boundaries** — every component is wrapped in `React.memo`. The React Compiler also applies automatic memoization; the explicit `memo` calls serve as a clear contract that these components are pure with respect to their props.
- **Stale-while-revalidate** — `useFunds` wraps the data fetch in a TanStack Query with `staleTime: 5 min` and `gcTime: 10 min`. The `fetchFunds` function is a single-line swap from JSON import to `fetch('/api/funds')` when a real API is available.

### Architecture
Data flows one way: `funds.json` → `App` (state: `activeFundId`, `compareMode`, `isDark`) → pure presentational components. No context or global store was needed for three funds.

---

## Bonus features implemented

- **Dark / Light mode toggle** — a sliding pill in the nav bar switches between dark and light themes. Ant Design's `ConfigProvider` swaps algorithms (`darkAlgorithm` ↔ `defaultAlgorithm`); CSS custom properties on `[data-theme]` retheme all non-Ant elements simultaneously.
- **Multi-fund NAV overlay** — a Switch above the chart toggles all three funds onto a single line chart for comparison.
- **Date range filter** — pill buttons ([1M][3M][6M][12M]) above the NAV chart slice the history window in real time.
- **Column sorting & filtering** — every column in the portfolio table is sortable; the Sector column includes a dropdown filter.
- **Threshold alert** — a warning banner appears when any portfolio company has a negative EBITDA margin, listing the affected companies with their margins.
- **Stale-while-revalidate data layer** — TanStack Query caches fund data with background revalidation on window focus.
- **Custom SVG icon library** — all icons are hand-authored 16×16 SVGs (`src/icons/index.tsx`), no third-party icon font.
- **Full ARIA accessibility** — `role="alert"` on banners, `role="img"` + `.sr-only` description on the chart, `aria-pressed` on range buttons, `aria-label` on all interactive elements, skip-to-content link, and suppressed focus outline only for mouse users (`:focus:not(:focus-visible)`).
- **Responsive layout** — KPI cards reflow from 5 → 3 → 2 columns; table scrolls horizontally on narrow viewports.

---

## What I would improve given more time

1. **Virtualised table** — for large portfolios, replace the Ant Design Table with a virtualised grid (TanStack Virtual) to keep scroll performance at 60 fps with thousands of rows.
2. **Persisted theme preference** — store the dark/light choice in `localStorage` and honour the OS `prefers-color-scheme` on first visit.
3. **Real API integration** — swap `fetchFunds` from a JSON import to `fetch('/api/funds')`. The TanStack Query layer is already in place; no other changes needed.
4. **E2E tests** — Playwright smoke tests for fund switching, chart tooltip, table sort, and theme toggle.
5. **Drill-down company view** — clicking a portfolio company row could open a slide-over panel with full historical EBITDA, revenue trend, and valuation multiples.

---

## Known limitations

- **Static data only** — all data is sourced from `funds.json` at build time. There are no real-time updates; the animated "Live" pulse in the nav is decorative.
- **12-month history cap** — NAV history in the dataset covers only 2024. The date range filter (1M/3M/6M/12M) slices that window; there is no data beyond December 2024.
- **Three funds only** — the fund selector and comparison chart are built for the three funds in the provided dataset. Adding a fourth fund requires only a data change, but the tab layout has not been tested beyond three.
- **No authentication** — the dashboard is intentionally public as specified by Track A constraints.
- **Light mode on Ant Design** — Ant Design's `defaultAlgorithm` computes some derived tokens (sort-active column background, tooltip colour) differently from the hand-tuned dark theme. These are overridden explicitly in `ConfigProvider`, but edge-case Ant Design components may not yet adapt perfectly.
