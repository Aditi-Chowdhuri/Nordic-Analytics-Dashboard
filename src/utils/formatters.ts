export const formatNav = (value: number): string => {
  const m = value / 1_000_000;
  return `$${m.toFixed(1)}M`;
};

export const formatNavFull = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatMoney = (value: number): string => {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

export const formatMultiple = (value: number): string => `${value.toFixed(2)}x`;

export const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

export const formatMonth = (month: string): string => {
  const [year, m] = month.split('-');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${monthNames[parseInt(m, 10) - 1]} ${year.slice(2)}`;
};
