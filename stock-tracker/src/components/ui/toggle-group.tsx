import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const ToggleGroup = ({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root>) => (
  <ToggleGroupPrimitive.Root
    className={cn('inline-flex items-center gap-1 rounded-full p-1', className)}
    {...props}
  />
);

export const ToggleGroupItem = ({
  className,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) => (
  <ToggleGroupPrimitive.Item
    className={cn(
      'h-8 min-w-12 cursor-pointer rounded-full px-3 text-sm font-semibold transition-colors',
      className,
    )}
    {...props}
  />
);
