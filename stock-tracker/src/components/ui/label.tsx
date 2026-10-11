import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Label = ({ className, ...props }: ComponentProps<'label'>) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control -- callers pass htmlFor
  <label className={cn('text-sm font-semibold text-ink', className)} {...props} />
);
