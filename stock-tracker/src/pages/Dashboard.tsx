import { lazy, Suspense } from 'react';
import { useParams } from 'react-router';
import { CompanyNews } from '@/components/CompanyNews';
import { Overview } from '@/components/Overview';
import { Search } from '@/components/Search';
import { Spinner } from '@/components/Spinner';
import { StockInfo } from '@/components/StockInfo';
import { WatchlistActions } from '@/components/WatchlistActions';
import { isValidSymbol } from '@/lib/format';

// Recharts is the heaviest dependency; load it only when a chart is shown.
const Chart = lazy(() => import('@/components/Chart').then((m) => ({ default: m.Chart })));

export const Dashboard = () => {
  const { symbol } = useParams();

  return (
    <div className="grid w-full grid-cols-1 gap-6 p-8 md:grid-cols-2 xl:grid-cols-3">
      <div className="flex items-center justify-start md:col-span-2 xl:col-span-3">
        <Search />
      </div>

      {isValidSymbol(symbol) ? (
        <>
          <div className="h-40">
            <Overview symbol={symbol} />
          </div>
          <div className="h-80 md:col-span-2 xl:row-span-2">
            <Suspense fallback={<Spinner label="Loading chart" />}>
              <Chart symbol={symbol} />
            </Suspense>
          </div>
          <div className="h-80">
            <StockInfo symbol={symbol} />
          </div>
          <div className="h-40">
            <WatchlistActions symbol={symbol} />
          </div>
          <div className="h-80">
            <CompanyNews symbol={symbol} />
          </div>
        </>
      ) : (
        <p role="alert" className="md:col-span-2 xl:col-span-3">
          That is not a valid stock symbol.
        </p>
      )}
    </div>
  );
};
