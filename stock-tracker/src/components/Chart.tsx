import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from './Card';
import { Spinner } from './Spinner';
import { useTheme } from '@/context/theme';
import { useCandles } from '@/hooks/useMarket';
import { chartRangeKeys, type ChartRange } from '@/lib/chartRanges';
import { fromUnixSeconds } from '@/lib/format';

export const Chart = ({ symbol }: { symbol: string }) => {
  const [range, setRange] = useState<ChartRange>('1W');
  const { theme } = useTheme();
  const { data, isPending, isError } = useCandles(symbol, range);
  const dark = theme === 'dark';

  const points = (data ?? []).map(({ value, time }) => ({
    value: Number(value.toFixed(2)),
    date: fromUnixSeconds(time),
  }));

  return (
    <Card className="min-h-72">
      <div role="group" aria-label="Chart range" className="absolute top-2 right-2 z-10 flex gap-2">
        {chartRangeKeys.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={range === key}
            onClick={() => {
              setRange(key);
            }}
            className={`h-8 w-12 rounded border text-sm ${
              range === key
                ? 'border-black bg-black text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-black'
                : 'border-black hover:bg-neutral-400 dark:border-cyan-400 dark:hover:bg-cyan-800'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {isPending && <Spinner label="Loading chart" />}
      {isError && (
        <p role="alert" className="pt-12 text-center text-red-500">
          Historical data is unavailable right now.
        </p>
      )}
      {!isPending && !isError && points.length === 0 && (
        <p className="pt-12 text-center">No data for this range.</p>
      )}
      {points.length > 0 && (
        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
          <AreaChart data={points}>
            <defs>
              <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dark ? 'white' : 'black'} stopOpacity={0.9} />
                <stop offset="95%" stopColor={dark ? 'cyan' : 'black'} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ backgroundColor: dark ? '#1f2937' : '#f9fafb' }}
              itemStyle={{ color: '#818cf8' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#312e81"
              fill="url(#chartColor)"
              fillOpacity={1}
              strokeWidth={0.5}
            />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin', 'dataMax']} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
