import { Card } from './Card';
import { useProfile, useQuote } from '@/hooks/useMarket';
import { formatChange, formatPercent, formatPrice } from '@/lib/format';

export const Overview = ({ symbol }: { symbol: string }) => {
  const { data: quote, isPending, isError } = useQuote(symbol);
  const { data: profile } = useProfile(symbol);

  const positive = (quote?.d ?? 0) >= 0;

  return (
    <Card>
      <div className="flex h-full w-full flex-col items-center justify-around p-5 pt-10 sm:flex-row">
        <h1 className="absolute top-4 left-4 text-xl font-bold 2xl:text-2xl">{symbol}</h1>
        {isError ? (
          <p role="alert" className="text-red-500">
            Could not load quote
          </p>
        ) : isPending ? (
          <p aria-busy="true">Loading…</p>
        ) : (
          <>
            <span className="flex items-center text-3xl xl:text-4xl">
              {formatPrice(quote.c)}
              <span className="ml-2 text-lg font-bold text-neutral-400">{profile?.currency}</span>
            </span>
            <span className={`text-xl xl:text-2xl ${positive ? 'text-lime-600' : 'text-red-500'}`}>
              {formatChange(quote.d)}
              <span className="p-1">({formatPercent(quote.dp)})</span>
            </span>
          </>
        )}
      </div>
    </Card>
  );
};
