import { memo, useMemo, useState, useCallback, useId } from 'react';
import { Table, Tag, Input, Badge } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { PortfolioCompany } from '../types';
import { formatMoney, formatPercent } from '../utils/formatters';
import { useDebounce } from '../hooks/useDebounce';
import { IconSearch, IconWarningTriangle, IconDangerCircle } from '../icons';

interface Props { companies: PortfolioCompany[] }

type SortOrder = 'ascend' | 'descend' | null;
interface TableSorter { columnKey?: string; order?: SortOrder }

/* ── Flag badge ──────────────────────────────────────────────────── */
const FlagBadge = memo(({ flag }: { flag: string }) => {
  if (flag === 'at-risk') return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded"
      style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--na-red)', border: '1px solid rgba(239,68,68,0.2)' }}
      aria-label="Status: at risk"
    >
      <IconDangerCircle size={10} color="var(--na-red)" aria-hidden="true" />
      At Risk
    </span>
  );
  if (flag === 'watch') return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded"
      style={{ background: 'rgba(245,158,11,0.10)', color: 'var(--na-amber)', border: '1px solid rgba(245,158,11,0.2)' }}
      aria-label="Status: watch"
    >
      <IconWarningTriangle size={10} color="var(--na-amber)" aria-hidden="true" />
      Watch
    </span>
  );
  return null;
});
FlagBadge.displayName = 'FlagBadge';

/* ── EBITDA cell ─────────────────────────────────────────────────── */
const EbitdaCell = memo(({ value, margin }: { value: number; margin: number }) => (
  <div
    className="tabular-nums"
    style={{ fontFamily: "'DM Mono', monospace", fontVariantNumeric: 'tabular-nums' }}
    aria-label={`EBITDA ${formatMoney(value)}, margin ${formatPercent(margin)}`}
  >
    <span style={{ color: margin < 0 ? 'var(--na-red)' : 'var(--na-text)' }}>
      {formatMoney(value)}
    </span>
    <span className="ml-1 text-[11px]" style={{ color: margin < 0 ? 'rgba(239,68,68,0.7)' : 'var(--na-faint)' }}>
      ({formatPercent(margin)})
    </span>
  </div>
));
EbitdaCell.displayName = 'EbitdaCell';

/* ── Table ───────────────────────────────────────────────────────── */
const PortfolioTable = memo(({ companies }: Props) => {
  const tableId            = useId();
  const captionId          = `${tableId}-caption`;
  const [search, setSearch]= useState('');
  const [, setSortState]   = useState<TableSorter>({});
  const debouncedSearch    = useDebounce(search, 300);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []
  );

  const handleTableChange = useCallback(
    (_: unknown, __: unknown, sorter: SorterResult<PortfolioCompany> | SorterResult<PortfolioCompany>[]) => {
      const s = Array.isArray(sorter) ? sorter[0] : sorter;
      setSortState({ columnKey: s.columnKey as string, order: s.order as SortOrder });
    }, []
  );

  const filteredData = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [companies, debouncedSearch]);

  const sectorFilters = useMemo(
    () => [...new Set(companies.map((c) => c.sector))].map((s) => ({ text: s, value: s })),
    [companies]
  );

  const columns = useMemo<ColumnsType<PortfolioCompany>>(() => [
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: PortfolioCompany) => (
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-sm" style={{ color: 'var(--na-text)' }}>{name}</span>
          <div className="flex gap-1.5 flex-wrap">
            {record.flags.map((f) => <FlagBadge key={f} flag={f} />)}
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
      sorter: (a, b) => a.sector.localeCompare(b.sector),
      filters: sectorFilters,
      onFilter: (value, record) => record.sector === value,
      render: (sector: string) => (
        <Tag
          className="text-[11px] font-medium tracking-wide"
          style={{ background: 'rgba(106,176,212,0.08)', color: 'var(--na-ice)', border: '1px solid rgba(106,176,212,0.15)' }}
        >
          {sector}
        </Tag>
      ),
      width: 140,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
      width: 110,
      render: (v: string) => <span style={{ color: 'var(--na-muted)' }}>{v}</span>,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v: number) => (
        <span
          className="tabular-nums"
          style={{ color: 'var(--na-text)', fontFamily: "'DM Mono', monospace", fontVariantNumeric: 'tabular-nums' }}
          aria-label={`Revenue: ${formatMoney(v)}`}
        >
          {formatMoney(v)}
        </span>
      ),
      align: 'right',
      width: 110,
    },
    {
      title: 'EBITDA',
      key: 'ebitda',
      sorter: (a, b) => a.ebitda - b.ebitda,
      render: (_: unknown, record: PortfolioCompany) => (
        <EbitdaCell value={record.ebitda} margin={record.ebitdaMargin} />
      ),
      align: 'right',
      width: 160,
    },
    {
      title: 'EBITDA Margin',
      dataIndex: 'ebitdaMargin',
      key: 'ebitdaMargin',
      sorter: (a, b) => a.ebitdaMargin - b.ebitdaMargin,
      render: (v: number) => (
        <span
          className="tabular-nums font-semibold"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontVariantNumeric: 'tabular-nums',
            color: v < 0 ? 'var(--na-red)' : v >= 20 ? 'var(--na-green)' : 'var(--na-muted)',
          }}
          aria-label={`EBITDA margin: ${formatPercent(v)}${v < 0 ? ', negative' : ''}`}
        >
          {formatPercent(v)}
        </span>
      ),
      align: 'right',
      width: 130,
    },
    {
      title: 'Current Value',
      dataIndex: 'currentValue',
      key: 'currentValue',
      sorter: (a, b) => a.currentValue - b.currentValue,
      render: (v: number) => (
        <span
          className="font-semibold tabular-nums"
          style={{ color: 'var(--na-ice)', fontFamily: "'DM Mono', monospace", fontVariantNumeric: 'tabular-nums' }}
          aria-label={`Current value: ${formatMoney(v)}`}
        >
          {formatMoney(v)}
        </span>
      ),
      align: 'right',
      width: 130,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <Badge status="success" text={<span className="text-xs" style={{ color: 'var(--na-muted)' }}>{v}</span>} />
      ),
      width: 90,
    },
  ], [sectorFilters]);

  const rowClassName = useCallback(
    (record: PortfolioCompany) => {
      if (record.flags.includes('at-risk')) return 'row-at-risk';
      if (record.flags.includes('watch'))   return 'row-watch';
      return '';
    }, []
  );

  const emptyText = debouncedSearch
    ? `No companies match "${debouncedSearch}"`
    : 'No portfolio companies';

  return (
    <section
      aria-labelledby={captionId}
      className="na-card-static rounded-xl"
      style={{ padding: '20px 24px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div>
          <p className="kpi-label m-0 mb-1">Portfolio Companies</p>
          <h2
            id={captionId}
            className="text-base font-semibold m-0 tracking-tight"
            style={{ color: 'var(--na-text)', fontFamily: "'DM Sans', sans-serif" }}
          >
            {filteredData.length} of {companies.length} {companies.length === 1 ? 'company' : 'companies'}
            {debouncedSearch ? ` matching "${debouncedSearch}"` : ''}
          </h2>
        </div>
        <Input
          prefix={<IconSearch size={13} color="var(--na-faint)" aria-hidden="true" />}
          placeholder="Search by name, sector, country…"
          aria-label="Search portfolio companies by name, sector, or country"
          value={search}
          onChange={handleSearchChange}
          allowClear
          size="small"
          style={{ width: 268, fontFamily: "'DM Sans', sans-serif" }}
        />
      </div>

      <Table<PortfolioCompany>
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        rowClassName={rowClassName}
        onChange={handleTableChange}
        pagination={false}
        size="small"
        scroll={{ x: 960 }}
        aria-rowcount={filteredData.length}
        aria-label="Portfolio companies — click column headers to sort"
        locale={{
          emptyText: (
            <span style={{ color: 'var(--na-faint)', fontFamily: "'DM Sans', sans-serif" }}>
              {emptyText}
            </span>
          ),
        }}
      />
    </section>
  );
});

PortfolioTable.displayName = 'PortfolioTable';
export default PortfolioTable;
