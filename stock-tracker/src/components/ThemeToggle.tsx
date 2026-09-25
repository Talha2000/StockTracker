import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="rounded-md border border-slate-500 p-2 text-white hover:bg-white/10 focus:ring-2 focus:ring-gray-300 focus:outline-none"
    >
      {isDark ? <Moon className="h-5 w-5 text-yellow-400" /> : <Sun className="h-5 w-5" />}
    </button>
  );
};
