/**
 * Funds data service.
 *
 * Currently reads from the bundled JSON file.
 * To switch to a real API, replace `fetchFunds` with:
 *
 *   const res = await fetch('/api/funds');
 *   if (!res.ok) throw new Error('Failed to fetch funds');
 *   return res.json() as Promise<Fund[]>;
 *
 * No other files need changing — React Query's cache layer
 * will handle stale-while-revalidate automatically.
 */

import fundsData from '../data/funds.json';
import type { Fund } from '../types';

// Micro-task delay so the query lifecycle (loading → success) is always
// exercised in dev, and the loading skeleton is visible.
const MOCK_DELAY = 120;

export async function fetchFunds(): Promise<Fund[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY));
  return fundsData.funds as Fund[];
}
