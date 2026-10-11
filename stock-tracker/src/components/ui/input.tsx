import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <input
    className={cn(
      'h-12 w-full rounded-field bg-page px-4 text-base text-ink ring-1 ring-line transition-shadow ring-inset placeholder:text-muted hover:ring-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-invalid:ring-down',
      className,
    )}
    {...props}
  />
);
