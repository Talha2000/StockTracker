import { Link, NavLink } from 'react-router';
import { PriceChange } from './PriceChange';
import { Skeleton } from './ui/skeleton';
import { useQuotes } from '@/hooks/useMarket';
import { useWatchlist } from '@/hooks/useWatchlist';
import { formatPrice } from '@/lib/format';

/** Your stocks, always in reach: a sticky column on desktop, a swipeable strip on mobile. */
export const WatchlistRail = () => {
  const { data: symbols = [], isPending } = useWatchlist();
  const quotes = useQuotes(symbols);

  return (
    <nav
      aria-label="Your watchlist"
      className="border-b border-line lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] lg:w-60 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0"
    >
      <div className="flex items-baseline justify-between px-4 pt-3 sm:px-6 lg:px-5 lg:pt-5">
        <h2 className="text-sm font-extrabold tracking-tight">Your list</h2>
        <Link to="/watchlist" className="rounded-md text-xs font-medium text-muted hover:text-ink">
          See all
        </Link>
      </div>

      {isPending && (
        <div className="flex gap-2 px-4 py-3 sm:px-6 lg:flex-col">
          <Skeleton className="h-14 w-36 lg:w-full" />
          <Skeleton className="h-14 w-36 lg:w-full" />
        </div>
      )}
      {!isPending && symbols.length === 0 && (
        <p className="px-4 pt-2 pb-4 text-sm text-muted sm:px-6">Stocks you watch show up here.</p>
      )}

      {symbols.length > 0 && (
        <ul className="flex gap-1 overflow-x-auto px-2 py-2 sm:px-4 lg:flex-col lg:gap-0.5 lg:px-2">
          {symbols.map((symbol, index) => {
            const quote = quotes[index]?.data;
            return (
              <li key={symbol} className="shrink-0">
                <NavLink
                  to={`/${symbol}`}
                  className="relative flex min-w-28 flex-col gap-0.5 rounded-lg px-3 py-2 text-sm transition-colors before:absolute before:inset-y-2.5 before:left-0 before:w-1 before:rounded-full before:bg-mark before:opacity-0 hover:bg-surface aria-[current=page]:bg-surface aria-[current=page]:before:opacity-100 lg:flex-row lg:items-center lg:justify-between"
                >
                  <span className="font-extrabold tracking-tight">{symbol}</span>
                  <span className="flex flex-col lg:items-end">
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
