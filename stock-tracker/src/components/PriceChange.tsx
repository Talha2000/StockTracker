import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatChange, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceChangeProps {
  change: number | null | undefined;
  percent: number | null | undefined;
  /** `onBrand` is a white chip for the ultramarine block; `soft` sits on the page. */
  tone?: 'soft' | 'onBrand';
  className?: string;
}

export const PriceChange = ({ change, percent, tone = 'soft', className }: PriceChangeProps) => {
  const up = (change ?? 0) >= 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold',
        tone === 'onBrand' && ['bg-white', up ? 'text-up-ink' : 'text-down-ink'],
        tone === 'soft' && (up ? 'bg-up-soft text-up' : 'bg-down-soft text-down'),
        className,
      )}
    >
      <Arrow aria-hidden="true" className="size-4" />
      {formatChange(change)} ({formatPercent(percent)})
    </span>
  );
};
