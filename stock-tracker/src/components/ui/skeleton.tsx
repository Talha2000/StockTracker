import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    aria-hidden="true"
    className={cn('animate-pulse rounded-lg bg-ink/8', className)}
    {...props}
  />
);
