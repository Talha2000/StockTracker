import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/auth';
import { watchlistApi } from '@/lib/api';

const KEY = ['watchlist'] as const;

export const useWatchlist = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: KEY,
    queryFn: watchlistApi.list,
    enabled: isAuthenticated,
    select: (bookmarks) => bookmarks.map((bookmark) => bookmark.stockSymbol),
  });
};

export const useToggleWatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ symbol, watched }: { symbol: string; watched: boolean }) =>
      watched ? watchlistApi.remove(symbol) : watchlistApi.add(symbol),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
};
