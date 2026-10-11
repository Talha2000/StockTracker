import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router';
import { PriceChange } from '@/components/PriceChange';
import { Skeleton } from '@/components/ui/skeleton';
import { useWatchlist } from '@/hooks/useWatchlist';
import { market } from '@/lib/api';
import { formatPrice } from '@/lib/format';

export const Watchlist = () => {
  const { data: symbols = [], isPending, isError } = useWatchlist();
  const quotes = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ['quote', symbol],
      queryFn: () => market.quote(symbol),
    })),
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">Watchlist</h1>

      {isPending && (
        <div role="status" className="mt-10 space-y-3">
          <span className="sr-only">Loading your watchlist…</span>
          <Skeleton className="h-16 w-full rounded-panel" />
          <Skeleton className="h-16 w-full rounded-panel" />
        </div>
      )}
      {isError && (
        <p role="alert" className="mt-8 text-down">
          Couldn’t load your watchlist. Refresh the page to try again.
        </p>
      )}
      {!isPending && !isError && symbols.length === 0 && (
        <div className="mt-10 rounded-panel border-2 border-dashed border-line p-8">
          <p className="text-lg font-semibold">Nothing on your watchlist yet.</p>
          <p className="mt-1 text-muted">Search for a stock, then select Watch to keep it here.</p>
        </div>
      )}

      {symbols.length > 0 && (
        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-panel bg-surface ring-1 ring-line">
          {symbols.map((symbol, index) => {
            const quote = quotes[index]?.data;
            return (
              <li key={symbol}>
                <Link
                  to={`/${symbol}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-ink/3 focus-visible:-outline-offset-2 dark:hover:bg-white/4"
                >
                  <span className="text-xl font-extrabold tracking-tight">{symbol}</span>
                  <span className="tabular ml-auto font-semibold">{formatPrice(quote?.c)}</span>
                  <PriceChange
                    change={quote?.d}
                    percent={quote?.dp}
                    className="tabular hidden min-w-36 justify-end sm:inline-flex"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
