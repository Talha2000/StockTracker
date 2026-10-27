import { lazy, Suspense } from 'react';
import { useParams } from 'react-router';
import { CompanyNews } from '@/components/CompanyNews';
import { Overview } from '@/components/Overview';
import { StockInfo } from '@/components/StockInfo';
import { WatchlistRail } from '@/components/WatchlistRail';
import { isValidSymbol } from '@/lib/format';

// Recharts is the heaviest dependency; load it only when a chart is shown.
const Chart = lazy(() => import('@/components/Chart').then((m) => ({ default: m.Chart })));

export const Dashboard = () => {
  const { symbol } = useParams();

  return (
    <div className="lg:flex">
      <WatchlistRail />

      <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        {isValidSymbol(symbol) ? (
          <>
            <section
              aria-labelledby="ticker-heading"
              className="on-block overflow-hidden rounded-block bg-block text-on-block"
            >
              <Overview symbol={symbol} />
              {/* Same height as the chart + range toggle, so the block doesn't jump when Recharts arrives. */}
              <Suspense fallback={<div className="h-62 sm:h-71 xl:h-79" />}>
                <Chart symbol={symbol} />
              </Suspense>
            </section>

            {/* Key facts on the left beside the news on wide screens, above it on narrow ones. */}
            <div className="mt-8 grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-12">
              <StockInfo symbol={symbol} />
              <CompanyNews symbol={symbol} />
            </div>
          </>
        ) : (
          <div className="py-10">
            <p role="alert" className="text-2xl font-extrabold tracking-tight">
              That is not a valid stock symbol.
            </p>
            <p className="mt-2 text-muted">
              Search for a company or symbol at the top of the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
