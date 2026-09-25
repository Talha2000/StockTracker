import type { ReactNode } from 'react';

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div
    className={`relative h-full w-full rounded-md border-2 border-black p-2 dark:border-cyan-400 ${className}`}
  >
    {children}
  </div>
);
