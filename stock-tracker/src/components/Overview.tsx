import { PriceChange } from './PriceChange';
import { WatchButton } from './WatchButton';
import { Skeleton } from './ui/skeleton';
import { useProfile, useQuote } from '@/hooks/useMarket';
import { formatPrice } from '@/lib/format';

/** The top of the ultramarine block: ticker, company, price and today's move. */
export const Overview = ({ symbol }: { symbol: string }) => {
  const { data: quote, isPending, isError } = useQuote(symbol);
  const { data: profile } = useProfile(symbol);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-ticker font-extrabold wrap-break-word">{symbol}</h1>
          {profile?.name && (
            <p className="mt-3 text-lg font-medium text-brand-soft">{profile.name}</p>
          )}
        </div>
        <WatchButton symbol={symbol} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
        {isError ? (
          <p role="alert" className="font-medium">
            Couldn’t load the latest price.
          </p>
        ) : isPending ? (
          <>
            <span className="sr-only" role="status">
              Loading price…
            </span>
            <Skeleton className="h-12 w-48 bg-white/15 dark:bg-white/15" />
          </>
        ) : (
          <>
            <p className="text-price font-bold">
              {formatPrice(quote.c)}
              {profile?.currency && (
                <span className="ml-2 text-base font-semibold tracking-normal text-brand-soft">
                  {profile.currency}
                </span>
              )}
            </p>
            <span className="flex items-center gap-3">
              <PriceChange tone="onBrand" change={quote.d} percent={quote.dp} />
              <span className="text-sm text-brand-soft">today</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};
