import { Skeleton } from './ui/skeleton';
import { useProfile } from '@/hooks/useMarket';
import { formatMarketCap } from '@/lib/format';

export const StockInfo = ({ symbol }: { symbol: string }) => {
  const { data, isPending, isError } = useProfile(symbol);

  const rows: [string, string][] = [
    ['Market cap', formatMarketCap(data?.marketCapitalization)],
    ['Industry', data?.finnhubIndustry ?? '—'],
    ['Exchange', data?.exchange ?? '—'],
    ['Country', data?.country ?? '—'],
    ['Currency', data?.currency ?? '—'],
  ];

  return (
    <section aria-labelledby="facts-heading">
      <h2 id="facts-heading" className="text-lg font-extrabold tracking-tight">
        Key facts
      </h2>
      {isError ? (
        <p role="alert" className="mt-3 text-sm text-muted">
          Company details for {symbol} aren’t available right now.
        </p>
      ) : (
        <dl className="mt-3 grid gap-x-8 border-t border-line text-sm sm:grid-cols-2 xl:grid-cols-1">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-line py-2.5">
              <dt className="shrink-0 text-muted">{label}</dt>
              <dd className="text-right font-semibold">
                {isPending ? <Skeleton className="h-4 w-20" /> : value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
