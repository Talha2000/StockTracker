import { Eye, EyeOff } from 'lucide-react';
import { Card } from './Card';
import { useToggleWatch, useWatchlist } from '@/hooks/useWatchlist';

export const WatchlistActions = ({ symbol }: { symbol: string }) => {
  const { data: watchlist } = useWatchlist();
  const toggle = useToggleWatch();
  const watched = watchlist?.includes(symbol) ?? false;

  return (
    <Card>
      <div className="flex h-full flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          className="btn-action"
          disabled={toggle.isPending}
          aria-label={watched ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
          onClick={() => {
            toggle.mutate({ symbol, watched });
          }}
        >
          {watched ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
        </button>
        <button type="button" className="btn-action">
          BUY
        </button>
        <button type="button" className="btn-action">
          SELL
        </button>
      </div>
      {toggle.isError && (
        <p role="alert" className="text-center text-sm text-red-500">
          Could not update your watchlist.
        </p>
      )}
    </Card>
  );
};
