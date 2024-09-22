'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A mixed bar chart';

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
];

const chartConfig = {
  visitors: {
    label: 'Jumlah',
  },
  chrome: {
    label: 'Milo',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'UHT',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Lemonilo rasa kari ayam',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Nugget',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Es Krim',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function TopProductChart() {
  return (
    <Card className="col-span-10 md:col-span-5 xl:col-span-4">
      <CardHeader>
        <CardTitle>5 Barang Terlaris</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
            className="max-w-400"
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
