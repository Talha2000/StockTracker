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
import { formatDateTime, formatPrice, formatShortDate } from '@/lib/format';

// Lives on the ultramarine block in both themes, so colors are fixed rather
// than theme tokens (SVG presentation attributes can't read CSS variables).
const LINE = '#ffffff';
const TICK = '#c7cbff';

const ChartTooltip = ({ active, payload, label }: TooltipContentProps) => {
  const value = payload[0]?.value;
  if (!active || typeof value !== 'number' || typeof label !== 'number') return null;
  return (
    <div className="rounded-xl bg-[#151830] px-3 py-2 text-white shadow-lg">
      <p className="text-sm font-bold">{formatPrice(value)}</p>
      <p className="text-xs text-brand-soft">{formatDateTime(label)}</p>
    </div>
  );
};

export const Chart = ({ symbol }: { symbol: string }) => {
  const [range, setRange] = useState<ChartRange>('1W');
  const { data, isPending, isError } = useCandles(symbol, range);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const points = data ?? [];
  // Intraday candles share a date; tick only where the day changes, or labels repeat.
  const dayTicks = points
    .filter(
      (point, i) =>
        i === 0 || formatShortDate(point.time) !== formatShortDate(points[i - 1]?.time ?? 0),
    )
    .map((point) => point.time);

  return (
    <div className="mt-8">
      <div className="h-56 sm:h-72">
        {isPending && <Spinner label="Loading chart" className="h-full text-white" />}
        {isError && (
          <p role="alert" className="flex h-full items-center text-brand-soft">
            Price history isn’t available right now.
          </p>
        )}
        {!isPending && !isError && points.length === 0 && (
          <p className="flex h-full items-center text-brand-soft">
            No trading data for this range.
          </p>
        )}
        {points.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={LINE} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={LINE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                ticks={dayTicks}
                interval="preserveStartEnd"
                tickFormatter={formatShortDate}
                tick={{ fill: TICK, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                minTickGap={48}
                tickMargin={10}
              />
              <YAxis
                orientation="right"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value: number) => value.toFixed(0)}
                tick={{ fill: TICK, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                content={ChartTooltip}
                cursor={{ stroke: LINE, strokeOpacity: 0.4, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={LINE}
                strokeWidth={2.25}
                fill="url(#chartFill)"
                activeDot={{ r: 5, fill: '#ffc94a', stroke: LINE, strokeWidth: 2 }}
                isAnimationActive={!reduceMotion}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <ToggleGroup
        type="single"
        aria-label="Chart range"
        value={range}
        onValueChange={(value) => {
          // Radix lets a single-select group be emptied by re-clicking the active item.
          const next = chartRangeKeys.find((key) => key === value);
          if (next) setRange(next);
        }}
        className="mt-4 bg-white/10"
      >
        {chartRangeKeys.map((key) => (
          <ToggleGroupItem
            key={key}
            value={key}
            className="text-brand-soft hover:text-white data-[state=on]:bg-highlight data-[state=on]:text-[#151830]"
          >
            {key}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
