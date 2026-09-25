export const chartRanges = {
  '1W': { resolution: '15', days: 7 },
  '1M': { resolution: '60', days: 30 },
} as const;

export type ChartRange = keyof typeof chartRanges;

export const chartRangeKeys = Object.keys(chartRanges) as ChartRange[];
