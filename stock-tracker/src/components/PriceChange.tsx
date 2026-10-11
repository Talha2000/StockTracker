import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatChange, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceChangeProps {
  change: number | null | undefined;
  percent: number | null | undefined;
  /** `soft` chip on the page, `onBlock` chip on the block, `text` bare colored text for dense lists. */
  tone?: 'soft' | 'onBlock' | 'text';
  /** Percent only, for tight spaces. */
  compact?: boolean;
  className?: string;
}

export const PriceChange = ({
  change,
  percent,
  tone = 'soft',
  compact = false,
  className,
}: PriceChangeProps) => {
  const up = (change ?? 0) >= 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-semibold',
        tone === 'onBlock' && ['bg-block-chip', up ? 'text-up-ink' : 'text-down-ink'],
        tone === 'text' && ['px-0 py-0', up ? 'text-up' : 'text-down'],
        tone === 'soft' && (up ? 'bg-up-soft text-up' : 'bg-down-soft text-down'),
        className,
      )}
    >
      <Arrow aria-hidden="true" className="size-4" />
      {compact ? formatPercent(percent) : `${formatChange(change)} (${formatPercent(percent)})`}
    </span>
  );
};
