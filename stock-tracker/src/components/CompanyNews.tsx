import type { ReactNode } from 'react';
import { Skeleton } from './ui/skeleton';
import { useNews } from '@/hooks/useMarket';
import { formatRelativeTime, safeUrl } from '@/lib/format';
import type { NewsItem } from '@/lib/schemas';
import { cn } from '@/lib/utils';

const MAX_ITEMS = 9;

const Meta = ({ item }: { item: NewsItem }) => (
  <p className="mt-2 flex gap-3 text-sm text-muted">
    <span className="font-semibold text-ink">{item.source}</span>
    <time dateTime={new Date(item.datetime * 1000).toISOString()}>
      {formatRelativeTime(item.datetime)}
    </time>
  </p>
);

/** Links out only for http(s) URLs (news is third-party data); otherwise renders unlinked. */
const Story = ({
  item,
  className,
  children,
}: {
  item: NewsItem;
  className: string;
  children: ReactNode;
}) => {
  const href = safeUrl(item.url);
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn('group', className)}>
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  );
};

export const CompanyNews = ({ symbol }: { symbol: string }) => {
  const { data, isPending, isError } = useNews(symbol);
  const [lead, ...rest] = data?.slice(0, MAX_ITEMS) ?? [];

  return (
    <section aria-labelledby="news-heading">
      <h2 id="news-heading" className="text-3xl font-extrabold tracking-tight">
        News
      </h2>

      {isPending && (
        <div role="status" className="mt-6 grid gap-6 lg:grid-cols-2">
          <span className="sr-only">Loading news…</span>
          <Skeleton className="aspect-video w-full rounded-panel" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
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

      {lead && (
        <Story item={lead} className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
          {lead.image && (
            <img
              src={lead.image}
              alt=""
              className="aspect-video w-full rounded-panel bg-surface object-cover"
            />
          )}
          <div className={lead.image ? undefined : 'lg:col-span-2'}>
            <p className="text-2xl leading-tight font-bold tracking-tight group-hover:underline sm:text-3xl">
              {lead.headline}
            </p>
            {lead.summary && <p className="mt-3 line-clamp-3 text-muted">{lead.summary}</p>}
            <Meta item={lead} />
          </div>
        </Story>
      )}

      {rest.length > 0 && (
        <ul className="mt-10 grid gap-x-10 md:grid-cols-2 2xl:grid-cols-3">
          {rest.map((item) => (
            <li key={item.id} className="border-t border-line">
              <Story item={item} className="flex gap-4 py-5">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-3 leading-snug font-semibold group-hover:underline">
                    {item.headline}
                  </p>
                  <Meta item={item} />
                </div>
                {item.image && (
                  <img
                    className="size-20 shrink-0 rounded-xl bg-surface object-cover"
                    src={item.image}
                    alt=""
                    loading="lazy"
                  />
                )}
              </Story>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
