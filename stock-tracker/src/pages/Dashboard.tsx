import { lazy, Suspense } from 'react';
import { useParams } from 'react-router';
import { CompanyNews } from '@/components/CompanyNews';
import { Overview } from '@/components/Overview';
import { StockInfo } from '@/components/StockInfo';
import { isValidSymbol } from '@/lib/format';

// Recharts is the heaviest dependency; load it only when a chart is shown.
const Chart = lazy(() => import('@/components/Chart').then((m) => ({ default: m.Chart })));

export const Dashboard = () => {
  const { symbol } = useParams();

  if (!isValidSymbol(symbol)) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p role="alert" className="text-2xl font-bold">
          That is not a valid stock symbol.
        </p>
        <p className="mt-2 text-muted">Search for a company or symbol at the top of the page.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="on-brand rounded-block bg-brand p-6 text-white sm:p-10">
        <Overview symbol={symbol} />
        {/* Same height as the chart, so the block doesn't jump when Recharts arrives. */}
        <Suspense fallback={<div className="mt-8 h-56 sm:h-72" />}>
          <Chart symbol={symbol} />
        </Suspense>
      </section>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <StockInfo symbol={symbol} />
        </div>
        <div className="lg:col-span-7">
          <CompanyNews symbol={symbol} />
        </div>
      </div>
    </div>
  );
};
