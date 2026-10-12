import { Link } from 'react-router';
import { PriceChange } from '@/components/PriceChange';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfiles, useQuotes } from '@/hooks/useMarket';
import { useWatchlist } from '@/hooks/useWatchlist';
import { formatPrice } from '@/lib/format';

export const Watchlist = () => {
  const { data: symbols = [], isPending, isError } = useWatchlist();
  const quotes = useQuotes(symbols);
  const profiles = useProfiles(symbols);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Watchlist</h1>
        {symbols.length > 0 && (
          <p className="text-sm text-muted">
            {symbols.length} {symbols.length === 1 ? 'stock' : 'stocks'}
          </p>
        )}
      </div>

      {isPending && (
        <div role="status" className="mt-6 space-y-2">
          <span className="sr-only">Loading your watchlist…</span>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}
      {isError && (
        <p role="alert" className="mt-8 text-down">
          Couldn’t load your watchlist. Refresh the page to try again.
        </p>
      )}
      {!isPending && !isError && symbols.length === 0 && (
        <div className="mt-6 border-t border-line pt-4">
          <p className="font-semibold">Nothing on your watchlist yet.</p>
          <p className="mt-1 text-sm text-muted">
            Search for a stock, then select Watch to keep it here.
          </p>
        </div>
      )}

      {symbols.length > 0 && (
        <ul className="mt-6 border-t border-line">
          {symbols.map((symbol, index) => {
            const quote = quotes[index]?.data;
            const name = profiles[index]?.data?.name;
            return (
              <li key={symbol} className="border-b border-line">
                <Link
                  to={`/${symbol}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-0.5 px-3 py-3 transition-colors hover:bg-surface focus-visible:-outline-offset-2 sm:grid-cols-[6rem_1fr_auto_9.5rem]"
                >
                  <span className="text-lg font-extrabold tracking-tight">{symbol}</span>
                  <span className="col-start-1 row-start-2 truncate text-sm text-muted sm:col-start-2 sm:row-start-1">
                    {name}
                  </span>
                  <span className="tabular text-right font-semibold">{formatPrice(quote?.c)}</span>
                  <PriceChange
                    change={quote?.d}
                    percent={quote?.dp}
                    className="tabular justify-self-end"
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
