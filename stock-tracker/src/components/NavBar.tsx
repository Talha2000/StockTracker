import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Search } from './Search';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { useAuth } from '@/context/auth';

export const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    void navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-page">
      <nav
        aria-label="Main"
        className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 md:h-16 md:py-0 lg:px-10"
      >
        <Link
          to={isAuthenticated ? '/' : '/login'}
          className="flex items-center gap-2 rounded-md text-lg font-extrabold tracking-tight"
        >
          <span aria-hidden="true" className="size-3.5 rounded-[5px] bg-mark ring-1 ring-ink/15" />
          Stocktracker
        </Link>

        {isAuthenticated && (
          <div className="order-last w-full md:order-0 md:w-80 xl:w-96">
            <Search />
          </div>
        )}

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              className="px-3 sm:px-4"
              onClick={() => {
                void handleLogout();
              }}
            >
              <LogOut aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Sign out</span>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};
