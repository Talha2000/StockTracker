import { PriceChange } from './PriceChange';
import { WatchButton } from './WatchButton';
import { Skeleton } from './ui/skeleton';
import { useProfile, useQuote } from '@/hooks/useMarket';
import { formatPrice } from '@/lib/format';

/** The top of the block: ticker, company, price, today's move and the day's range. */
export const Overview = ({ symbol }: { symbol: string }) => {
  const { data: quote, isPending, isError } = useQuote(symbol);
  const { data: profile } = useProfile(symbol);

  const dayStats: [string, number | undefined][] = [
    ['Open', quote?.o],
    ['High', quote?.h],
    ['Low', quote?.l],
    ['Prev close', quote?.pc],
  ];

  return (
    <div className="px-5 pt-5 sm:px-7 sm:pt-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 id="ticker-heading" className="text-ticker font-extrabold wrap-break-word">
              {symbol}
            </h1>
            {profile?.name && (
              <p className="truncate font-medium text-on-block-muted">{profile.name}</p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            {isError ? (
              <p role="alert" className="font-medium">
                Couldn’t load the latest price.
              </p>
            ) : isPending ? (
              <>
                <span className="sr-only" role="status">
                  Loading price…
                </span>
                <Skeleton className="h-9 w-44 bg-on-block/15" />
              </>
            ) : (
              <>
                <p className="text-price font-bold">
                  {formatPrice(quote.c)}
                  {profile?.currency && (
                    <span className="ml-1.5 text-sm font-semibold tracking-normal text-on-block-muted">
                      {profile.currency}
                    </span>
                  )}
                </p>
                <span className="flex items-center gap-2">
                  <PriceChange tone="onBlock" change={quote.d} percent={quote.dp} />
                  <span className="text-sm text-on-block-muted">today</span>
                </span>
              </>
            )}
          </div>
        </div>
        <WatchButton symbol={symbol} />
      </div>

      {quote && (
        <dl className="mt-5 grid grid-cols-4 gap-3 text-xs whitespace-nowrap sm:flex sm:gap-8 sm:text-sm">
          {dayStats.map(([label, value]) => (
            <div key={label}>
              <dt className="text-on-block-muted">{label}</dt>
              <dd className="font-semibold">{formatPrice(value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};
