import { Card } from './Card';
import { useProfile } from '@/hooks/useMarket';
import { formatMarketCap } from '@/lib/format';

export const StockInfo = ({ symbol }: { symbol: string }) => {
  const { data, isError } = useProfile(symbol);

  const rows: [string, string][] = [
    ['Name', data?.name ?? '—'],
    ['Country', data?.country ?? '—'],
    ['Currency', data?.currency ?? '—'],
    ['Exchange', data?.exchange ?? '—'],
    ['Market cap', formatMarketCap(data?.marketCapitalization)],
    ['Industry', data?.finnhubIndustry ?? '—'],
  ];

  return (
    <Card>
      {isError && (
        <p role="alert" className="text-red-500">
          Could not load company info
        </p>
      )}
      <dl className="flex h-full flex-col justify-between divide-y divide-black dark:divide-white">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-1 items-center justify-between gap-4 py-2">
            <dt className="font-medium">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
};
