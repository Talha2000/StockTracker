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
      <h2 id="facts-heading" className="text-3xl font-extrabold tracking-tight">
        Key facts
      </h2>
      {isError ? (
        <p role="alert" className="mt-4 text-muted">
          Company details for {symbol} aren’t available right now.
        </p>
      ) : (
        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-3 2xl:grid-cols-5">
          {rows.map(([label, value]) => (
            <div key={label} className="border-t-2 border-ink pt-3">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="mt-1 text-xl leading-tight font-bold tracking-tight sm:text-2xl">
                {isPending ? <Skeleton className="mt-1 h-7 w-24" /> : value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
