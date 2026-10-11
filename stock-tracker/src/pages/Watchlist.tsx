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
    <div className="px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-6xl font-extrabold tracking-tighter sm:text-8xl">Watchlist</h1>
        {symbols.length > 0 && (
          <p className="pb-2 text-muted">
            {symbols.length} {symbols.length === 1 ? 'stock' : 'stocks'}
          </p>
        )}
      </div>

      {isPending && (
        <div role="status" className="mt-10 space-y-3">
          <span className="sr-only">Loading your watchlist…</span>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}
      {isError && (
        <p role="alert" className="mt-8 text-down">
          Couldn’t load your watchlist. Refresh the page to try again.
        </p>
      )}
      {!isPending && !isError && symbols.length === 0 && (
        <div className="mt-10 border-t-2 border-ink pt-6">
          <p className="text-2xl font-bold tracking-tight">Nothing on your watchlist yet.</p>
          <p className="mt-1 text-muted">Search for a stock, then select Watch to keep it here.</p>
        </div>
      )}

      {symbols.length > 0 && (
        <ul className="mt-10 border-t-2 border-ink">
          {symbols.map((symbol, index) => {
            const quote = quotes[index]?.data;
            const name = profiles[index]?.data?.name;
            return (
              <li key={symbol} className="border-b border-line">
                {/* The whole row inverts on hover: black on white becomes white on black. */}
                <Link
                  to={`/${symbol}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-3 py-5 transition-colors hover:bg-ink hover:text-page focus-visible:-outline-offset-2 sm:grid-cols-[minmax(9rem,16rem)_1fr_auto_10rem] sm:py-6"
                >
                  <span className="text-4xl font-extrabold tracking-tighter sm:text-6xl">
                    {symbol}
                  </span>
                  <span className="col-start-1 row-start-2 truncate text-muted group-hover:text-page/70 sm:col-start-2 sm:row-start-1">
                    {name}
                  </span>
                  <span className="tabular text-right text-xl font-semibold sm:text-2xl">
                    {formatPrice(quote?.c)}
                  </span>
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
