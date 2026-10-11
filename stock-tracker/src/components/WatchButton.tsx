import { Check, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useToggleWatch, useWatchlist } from '@/hooks/useWatchlist';

export const WatchButton = ({ symbol }: { symbol: string }) => {
  const { data: watchlist } = useWatchlist();
  const toggle = useToggleWatch();
  const watched = watchlist?.includes(symbol) ?? false;

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        // Hidden (space kept) until the watchlist loads, so it never flashes "Watch" for a watched stock.
        className={watchlist ? undefined : 'invisible'}
        variant={watched ? 'onBrandGhost' : 'onBrand'}
        disabled={toggle.isPending}
        aria-label={watched ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        onClick={() => {
          toggle.mutate({ symbol, watched });
        }}
      >
        {watched ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
        {watched ? 'Watching' : 'Watch'}
      </Button>
      {toggle.isError && (
        <p role="alert" className="text-sm text-white">
          Couldn’t update your watchlist. Try again.
        </p>
      )}
    </div>
  );
};
