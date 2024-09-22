'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CategoryMock, ProductAndCategoryReport } from '@/types/salesType';

export const description = 'A simple pie chart';
// Predefined array of 5 colors in HSL format
const predefinedColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// Dynamically create chartConfig based on CategoryMock and limited to 5 colors
const generateChartConfig = (categories: ProductAndCategoryReport[]) => {
  return categories.reduce(
    (config, category, index) => {
      const color = predefinedColors[index % predefinedColors.length]; // Cycle through predefined colors
      config[category.name] = {
        label: category.name,
        color,
      };
      return config;
    },
    {
      totalPrice: {
        label: 'Total Price',
      },
    } as unknown as Record<string, { label: string; color: string }>,
  );
};

const chartData = CategoryMock.map((category, index) => ({
  category: category.name,
  totalPrice: category.totalPrice,
  fill: predefinedColors[index % predefinedColors.length], // Cycle through colors
}));

// Generate chartConfig dynamically based on CategoryMock
const chartConfig = generateChartConfig(CategoryMock);

export function PieChartCategory() {
  return (
    <Card className="col-span-5 md:col-span-5 xl:col-span-2 flex flex-col h-full w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>5 Kategori Terlaris</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="totalPrice" nameKey="category" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
