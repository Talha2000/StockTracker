import { Link, useNavigate } from 'react-router';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/auth';
import { useWatchlist } from '@/hooks/useWatchlist';

const linkClass = 'block rounded py-2 text-white hover:text-cyan-300';

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { data: watchlist } = useWatchlist();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    void navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 z-20 w-full bg-black dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between gap-4 p-4">
        <span className="text-xl font-semibold whitespace-nowrap text-white">StockTracker</span>
        <ul className="flex items-center gap-6 font-medium">
          {isAuthenticated ? (
            <>
              <li>
                <Link className={linkClass} to={`/${watchlist?.[0] ?? 'META'}`}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link className={linkClass} to="/portfolio">
                  Portfolio
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={linkClass}
                  onClick={() => {
                    void handleLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link className={linkClass} to="/login">
                Login
              </Link>
            </li>
          )}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};
