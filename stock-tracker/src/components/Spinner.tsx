import { cn } from '@/lib/utils';

export const Spinner = ({
  label = 'Loading',
  className,
}: {
  label?: string;
  className?: string;
}) => (
  <div role="status" className={cn('flex items-center justify-center py-4', className)}>
    <div
      aria-hidden="true"
      className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
    />
    <span className="sr-only">{label}…</span>
  </div>
);
