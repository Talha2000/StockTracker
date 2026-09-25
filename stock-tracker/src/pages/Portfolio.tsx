import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Spinner } from '@/components/Spinner';
import { useWatchlist } from '@/hooks/useWatchlist';
import { market } from '@/lib/api';
import { formatPercent, formatPrice } from '@/lib/format';

export const Portfolio = () => {
  const { data: symbols = [], isPending, isError } = useWatchlist();
  const quotes = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ['quote', symbol],
      queryFn: () => market.quote(symbol),
    })),
  });

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-4xl font-bold">My Portfolio</h1>
      {isPending && <Spinner label="Loading watchlist" />}
      {isError && (
        <p role="alert" className="text-red-500">
          Could not load your watchlist.
        </p>
      )}
      {!isPending && symbols.length === 0 && (
        <p>Your watchlist is empty. Search a stock to add it.</p>
      )}
      {symbols.length > 0 && (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold">Price</th>
              <th className="p-4 font-bold">Day change</th>
            </tr>
          </thead>
          <tbody>
            {symbols.map((symbol, index) => {
              const quote = quotes[index]?.data;
              return (
                <tr
                  key={symbol}
                  className="border-y-2 border-black font-semibold dark:border-cyan-600"
                >
                  <td className="p-4">
                    <Link
                      to={`/${symbol}`}
                      className="rounded-lg bg-black px-4 py-2 text-white hover:bg-neutral-500 dark:bg-neutral-300 dark:text-black dark:hover:bg-cyan-600 dark:hover:text-white"
                    >
                      {symbol}
                    </Link>
                  </td>
                  <td className="p-4">{formatPrice(quote?.c)}</td>
                  <td className={`p-4 ${(quote?.dp ?? 0) >= 0 ? 'text-lime-600' : 'text-red-500'}`}>
                    {formatPercent(quote?.dp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
