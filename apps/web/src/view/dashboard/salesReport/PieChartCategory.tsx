'use client';

import { Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CategoryMock, ProductAndCategoryReport } from '@/types/salesType';
import { CookieValueTypes } from 'cookies-next';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

// Predefined array of 5 colors in HSL format
export const predefinedColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// Dynamically create chartConfig based on CategoryMock and limited to 5 colors
export const generateChartConfig = (categories: ProductAndCategoryReport[]) => {
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
        label: 'Total',
      },
    } as unknown as Record<string, { label: string; color: string }>,
  );
};

export function PieChartCategory({
  storeId,
  token,
  month,
  year,
}: {
  storeId: number | undefined;
  token: CookieValueTypes;
  month: number;
  year: number;
}) {
  const [categoryReport, setCategoryReport] =
    useState<ProductAndCategoryReport[]>(CategoryMock);

  const chartData = categoryReport.map((category, index) => ({
    category: category.name,
    totalPrice: category.totalPrice,
    fill: predefinedColors[index % predefinedColors.length],
  }));

  const chartConfig = generateChartConfig(categoryReport);

  async function fetchData() {
    if (storeId === undefined) {
      const salesResult = await axiosInstance().get(
        `${process.env.API_URL}/sales/category/top/all-store?month=${month}&year=${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCategoryReport(salesResult.data.data);
    } else {
      const salesResult = await axiosInstance().get(
        `${process.env.API_URL}/sales/category/top/single/${storeId}?month=${month}&year=${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCategoryReport(salesResult.data.data);
    }
  }

  useEffect(() => {
    fetchData();
  }, [year, storeId, month]);

  return (
    <Card className="col-span-10 lg:col-span-5 xl:col-span-2 flex flex-col h-full w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg sm:text-2xl">
          5 Kategori Terlaris
        </CardTitle>
        <CardDescription className="text-xs sm:text-md">
          Berdasarkan pendapatan terbesar
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 items-center align-middle">
        {categoryReport.length > 0 ? (
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
        ) : (
          <div className="font-semibold text-lg">N/A</div>
        )}
      </CardContent>
    </Card>
  );
}
