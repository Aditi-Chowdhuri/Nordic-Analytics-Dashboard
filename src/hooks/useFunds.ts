import { useQuery } from '@tanstack/react-query';
import { fetchFunds } from '../services/fundsApi';

/**
 * Stale-while-revalidate pattern via TanStack Query.
 *
 * - staleTime 5 min  → cached data is shown instantly; background refetch
 *                       starts only when the cache is older than 5 minutes.
 * - gcTime 10 min    → unused cache is held in memory for 10 minutes so
 *                       navigating back is instant.
 * - refetchOnWindowFocus → silently revalidates when the user returns to
 *                          the tab, mirroring SWR's default behaviour.
 */
export function useFunds() {
  return useQuery({
    queryKey:          ['funds'],
    queryFn:           fetchFunds,
    staleTime:         5  * 60 * 1_000,   // 5 min
    gcTime:            10 * 60 * 1_000,   // 10 min
    refetchOnWindowFocus: true,
    retry:             2,
  });
}
