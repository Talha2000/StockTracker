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
    <div className="px-6 pt-6 sm:px-10 sm:pt-10">
      {/* When both don't fit, the Watch button wraps above the ticker instead of splitting the
          ticker. wrap-reverse flips the cross axis, so items-end is what pins it to the top. */}
      <div className="flex flex-wrap-reverse items-end justify-between gap-4">
        <div className="max-w-full">
          <h1 id="ticker-heading" className="text-ticker font-extrabold wrap-break-word">
            {symbol}
          </h1>
          {profile?.name && (
            <p className="mt-4 text-lg font-medium text-on-block-muted">{profile.name}</p>
          )}
        </div>
        <WatchButton symbol={symbol} />
      </div>

      <div className="mt-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {isError ? (
            <p role="alert" className="font-medium">
              Couldn’t load the latest price.
            </p>
          ) : isPending ? (
            <>
              <span className="sr-only" role="status">
                Loading price…
              </span>
              <Skeleton className="h-14 w-56 bg-on-block/15" />
            </>
          ) : (
            <>
              <p className="text-price font-bold">
                {formatPrice(quote.c)}
                {profile?.currency && (
                  <span className="ml-2 text-base font-semibold tracking-normal text-on-block-muted">
                    {profile.currency}
                  </span>
                )}
              </p>
              <span className="flex items-center gap-3">
                <PriceChange tone="onBlock" change={quote.d} percent={quote.dp} />
                <span className="text-sm text-on-block-muted">today</span>
              </span>
            </>
          )}
        </div>

        {quote && (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:gap-10">
            {dayStats.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-on-block-muted">{label}</dt>
                <dd className="mt-0.5 font-semibold">{formatPrice(value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
};
