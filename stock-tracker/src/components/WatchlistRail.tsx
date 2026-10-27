import { NavLink } from 'react-router';
import { PriceChange } from './PriceChange';
import { Skeleton } from './ui/skeleton';
import { useProfiles, useQuotes } from '@/hooks/useMarket';
import { useWatchlist } from '@/hooks/useWatchlist';
import { formatPrice } from '@/lib/format';

/** The one place your watchlist lives: a sticky column on desktop, a swipeable strip on mobile. */
export const WatchlistRail = () => {
  const { data: symbols = [], isPending, isError } = useWatchlist();
  const quotes = useQuotes(symbols);
  const profiles = useProfiles(symbols);

  return (
    <nav
      aria-labelledby="watchlist-heading"
      className="border-b border-line lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:w-60 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0"
    >
      <div className="flex items-baseline justify-between px-4 pt-3 sm:px-6 lg:px-5 lg:pt-5">
        <h2 id="watchlist-heading" className="text-sm font-extrabold tracking-tight">
          Watchlist
        </h2>
        {symbols.length > 0 && <span className="text-xs text-muted">{symbols.length}</span>}
      </div>

      {isPending && (
        <div className="flex gap-2 px-4 py-3 sm:px-6 lg:flex-col lg:px-5">
          <Skeleton className="h-12 w-28 lg:w-full" />
          <Skeleton className="h-12 w-28 lg:w-full" />
        </div>
      )}
      {isError && (
        <p role="alert" className="px-4 pt-2 pb-4 text-sm text-muted sm:px-6 lg:px-5">
          Couldn’t load your watchlist. Refresh to try again.
        </p>
      )}
      {!isPending && !isError && symbols.length === 0 && (
        <p className="px-4 pt-2 pb-4 text-sm text-muted sm:px-6 lg:px-5">
          Search for a stock, then select Watch to add it here.
        </p>
      )}

      {symbols.length > 0 && (
        <ul className="flex gap-1 overflow-x-auto px-2 py-2 sm:px-4 lg:flex-col lg:gap-0.5 lg:px-2">
          {symbols.map((symbol, index) => {
            const quote = quotes[index]?.data;
            const name = profiles[index]?.data?.name;
            return (
              <li key={symbol} className="shrink-0">
                <NavLink
                  to={`/${symbol}`}
                  className="relative flex min-w-28 flex-col gap-0.5 rounded-lg px-3 py-2 text-sm transition-colors before:absolute before:inset-y-2.5 before:left-0 before:w-1 before:rounded-full before:bg-mark before:opacity-0 hover:bg-surface aria-[current=page]:bg-surface aria-[current=page]:before:opacity-100 lg:flex-row lg:items-center lg:justify-between lg:gap-3"
                >
                  <span className="min-w-0">
                    <span className="block font-extrabold tracking-tight">{symbol}</span>
                    {name && (
                      <span className="hidden truncate text-xs text-muted lg:block">{name}</span>
                    )}
                  </span>
                  <span className="flex shrink-0 flex-col lg:items-end">
                    <span className="tabular text-xs font-semibold">{formatPrice(quote?.c)}</span>
                    <PriceChange
                      tone="text"
                      compact
                      change={quote?.d}
                      percent={quote?.dp}
                      className="text-xs [&_svg]:size-3"
                    />
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};
