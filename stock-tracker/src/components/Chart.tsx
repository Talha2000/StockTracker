import { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import { Spinner } from './Spinner';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { useCandles } from '@/hooks/useMarket';
import { chartRangeKeys, type ChartRange } from '@/lib/chartRanges';
import { formatDateTime, formatPrice } from '@/lib/format';

const ChartTooltip = ({ active, payload, label }: TooltipContentProps) => {
  const value = payload[0]?.value;
  if (!active || typeof value !== 'number' || typeof label !== 'number') return null;
  return (
    <div className="rounded-xl bg-page px-3 py-2 text-ink shadow-lg ring-1 ring-line">
      <p className="text-sm font-bold">{formatPrice(value)}</p>
      <p className="text-xs text-muted">{formatDateTime(label)}</p>
    </div>
  );
};

/**
 * Bleeds to the block's edges with no axes: the line is the point, exact values
 * are in the tooltip. Colors come from `currentColor` (the block's text color),
 * since SVG attributes can't read the theme's CSS variables.
 */
export const Chart = ({ symbol }: { symbol: string }) => {
  const [range, setRange] = useState<ChartRange>('1W');
  const { data, isPending, isError } = useCandles(symbol, range);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const points = data ?? [];

  return (
    <div className="mt-6">
      <div className="h-64 text-on-block sm:h-80 xl:h-96">
        {isPending && <Spinner label="Loading chart" className="h-full" />}
        {isError && (
          <p role="alert" className="flex h-full items-center px-6 text-on-block-muted sm:px-10">
            Price history isn’t available right now.
          </p>
        )}
        {!isPending && !isError && points.length === 0 && (
          <p className="flex h-full items-center px-6 text-on-block-muted sm:px-10">
            No trading data for this range.
          </p>
        )}
        {points.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip
                content={ChartTooltip}
                cursor={{ stroke: 'currentColor', strokeOpacity: 0.35, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="currentColor"
                strokeWidth={2.5}
                fill="url(#chartFill)"
                activeDot={{ r: 6, strokeWidth: 2.5, className: 'chart-dot' }}
                isAnimationActive={!reduceMotion}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="px-6 pt-4 pb-6 sm:px-10 sm:pb-8">
        <ToggleGroup
          type="single"
          aria-label="Chart range"
          value={range}
          onValueChange={(value) => {
            // Radix lets a single-select group be emptied by re-clicking the active item.
            const next = chartRangeKeys.find((key) => key === value);
            if (next) setRange(next);
          }}
          className="bg-on-block/10"
        >
          {chartRangeKeys.map((key) => (
            <ToggleGroupItem
              key={key}
              value={key}
              className="text-on-block-muted hover:text-on-block data-[state=on]:bg-highlight data-[state=on]:text-on-highlight"
            >
              {key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};
