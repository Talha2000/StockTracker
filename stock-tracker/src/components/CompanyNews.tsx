import { Skeleton } from './ui/skeleton';
import { useNews } from '@/hooks/useMarket';
import { formatRelativeTime, safeUrl } from '@/lib/format';

const MAX_ITEMS = 8;

export const CompanyNews = ({ symbol }: { symbol: string }) => {
  const { data, isPending, isError } = useNews(symbol);

  return (
    <section aria-labelledby="news-heading">
      <h2 id="news-heading" className="text-2xl font-extrabold tracking-tight">
        News
      </h2>

      {isPending && (
        <div role="status" className="mt-6 space-y-6">
          <span className="sr-only">Loading news…</span>
          {[0, 1, 2].map((key) => (
            <div key={key} className="flex gap-4">
              <Skeleton className="size-18 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}
      {isError && (
        <p role="alert" className="mt-4 text-muted">
          News isn’t available right now.
        </p>
      )}
      {data?.length === 0 && (
        <p className="mt-4 text-muted">No news about {symbol} in the last 30 days.</p>
      )}

      {data && data.length > 0 && (
        <ul className="mt-4 divide-y divide-line">
          {data.slice(0, MAX_ITEMS).map((item) => {
            const href = safeUrl(item.url);
            const body = (
              <>
                {item.image && (
                  <img
                    className="size-18 shrink-0 rounded-xl bg-line object-cover"
                    src={item.image}
                    alt=""
                    loading="lazy"
                  />
                )}
                <div className="min-w-0">
                  <p className="line-clamp-2 leading-snug font-semibold group-hover:underline">
                    {item.headline}
                  </p>
                  <p className="mt-1.5 flex gap-3 text-sm text-muted">
                    <span className="font-medium">{item.source}</span>
                    <time dateTime={new Date(item.datetime * 1000).toISOString()}>
                      {formatRelativeTime(item.datetime)}
                    </time>
                  </p>
                </div>
              </>
            );
            return (
              <li key={item.id}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 rounded-xl py-4"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex gap-4 py-4">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
