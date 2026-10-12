import { Navigate } from 'react-router';
import { Spinner } from '@/components/Spinner';
import { useWatchlist } from '@/hooks/useWatchlist';

/** "/" opens the first stock on your watchlist, or META if it's empty. */
export const Home = () => {
  const { data: symbols, isPending } = useWatchlist();
  if (isPending) return <Spinner label="Loading your watchlist" />;
  return <Navigate to={`/${symbols?.[0] ?? 'META'}`} replace />;
};
