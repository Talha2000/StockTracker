import { Skeleton } from './ui/skeleton';
import { useNews } from '@/hooks/useMarket';
import { formatRelativeTime, safeUrl } from '@/lib/format';
import type { NewsItem } from '@/lib/schemas';

const MAX_ITEMS = 8;

const StoryBody = ({ item }: { item: NewsItem }) => (
  <>
    <div className="min-w-0 flex-1">
      <p className="line-clamp-2 text-sm leading-snug font-semibold group-hover:underline">
        {item.headline}
      </p>
      <p className="mt-1 flex gap-2 text-xs text-muted">
        <span className="font-medium text-ink">{item.source}</span>
        <time dateTime={new Date(item.datetime * 1000).toISOString()}>
          {formatRelativeTime(item.datetime)}
        </time>
      </p>
    </div>
    {item.image && (
      <img
        className="size-14 shrink-0 rounded-lg bg-surface object-cover"
        src={item.image}
        alt=""
        loading="lazy"
      />
    )}
  </>
);

export const CompanyNews = ({ symbol }: { symbol: string }) => {
  const { data, isPending, isError } = useNews(symbol);

  return (
    <section aria-labelledby="news-heading">
      <h2 id="news-heading" className="text-lg font-extrabold tracking-tight">
        News
      </h2>

      {isPending && (
        <div role="status" className="mt-3 grid gap-3 md:grid-cols-2">
          <span className="sr-only">Loading news…</span>
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-14 w-full" />
          ))}
        </div>
      )}
      {isError && (
        <p role="alert" className="mt-3 text-sm text-muted">
          News isn’t available right now.
        </p>
      )}
      {data?.length === 0 && (
        <p className="mt-3 text-sm text-muted">No news about {symbol} in the last 30 days.</p>
      )}

      {data && data.length > 0 && (
        <ul className="mt-3 grid gap-x-8 border-t border-line md:grid-cols-2">
          {data.slice(0, MAX_ITEMS).map((item) => {
            // Third-party data: link out only for http(s) URLs.
            const href = safeUrl(item.url);
            return (
              <li key={item.id} className="border-b border-line">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 py-3"
                  >
                    <StoryBody item={item} />
                  </a>
                ) : (
                  <div className="flex items-center gap-3 py-3">
                    <StoryBody item={item} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
