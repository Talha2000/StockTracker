import { Card } from './Card';
import { Spinner } from './Spinner';
import { useNews } from '@/hooks/useMarket';
import { safeUrl } from '@/lib/format';

export const CompanyNews = ({ symbol }: { symbol: string }) => {
  const { data, isPending, isError } = useNews(symbol);

  return (
    <Card>
      <div className="custom-scrollbar absolute inset-0 overflow-y-scroll rounded-md bg-neutral-300 p-2 dark:bg-cyan-800/20">
        {isPending && <Spinner label="Loading news" />}
        {isError && (
          <p role="alert" className="text-red-500">
            Could not load news
          </p>
        )}
        {data?.length === 0 && <p>No recent news.</p>}
        <ul>
          {data?.slice(0, 20).map((item) => {
            const href = safeUrl(item.url);
            return (
              <li key={item.id} className="flex items-center justify-between gap-3 p-2">
                {item.image && (
                  <img className="h-14 w-14 shrink-0 object-cover" src={item.image} alt="" />
                )}
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-right hover:underline"
                  >
                    {item.headline}
                  </a>
                ) : (
                  <span className="text-right">{item.headline}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
};
