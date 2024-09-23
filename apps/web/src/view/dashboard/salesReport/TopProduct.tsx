'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';

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
import { CookieValueTypes } from 'cookies-next';
import axiosInstance from '@/lib/axiosInstance';
import { ProductAndCategoryReport, CategoryMock } from '@/types/salesType';
import { useState, useEffect } from 'react';
import { generateChartConfig, predefinedColors } from './PieChartCategory';
import { truncateTextNoDot } from '@/lib/utils';

export function TopProductChart({
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
  const [topProduct, setTopProduct] =
    useState<ProductAndCategoryReport[]>(CategoryMock);

  const chartData = topProduct.map((product, index) => {
    const name = truncateTextNoDot(product.name, 20);
    return {
      name,
      qty: product.totalQty,
      fill: predefinedColors[index % predefinedColors.length],
    };
  });

  const chartConfig = generateChartConfig(topProduct);

  async function fetchData() {
    if (storeId === undefined) {
      const salesResult = await axiosInstance().get(
        `${process.env.API_URL}/sales/product/top/all-store?month=${month}&year=${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTopProduct(salesResult.data.data);
    } else {
      const salesResult = await axiosInstance().get(
        `${process.env.API_URL}/sales/product/top/single/${storeId}?month=${month}&year=${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTopProduct(salesResult.data.data);
    }
  }

  useEffect(() => {
    fetchData();
  }, [year, storeId, month]);

  return (
    <Card className="col-span-10 lg:col-span-5 xl:col-span-4">
      <CardHeader>
        <CardTitle className="text-lg sm:text-2xl">5 Barang Terlaris</CardTitle>
        <CardDescription className="text-xs sm:text-md">
          Berdasarkan jumlah barang terjual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {topProduct.length > 0 ? (
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 10,
              }}
              className="w-full"
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={0}
                axisLine={false}
                tickFormatter={(value) => {
                  return (
                    chartConfig[value as keyof typeof chartConfig]?.label ||
                    value
                  );
                }}
              />
              <XAxis dataKey="qty" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                data={chartData}
                dataKey="qty"
                layout="vertical"
                radius={5}
              />
            </BarChart>
          ) : (
            <div className="font-semibold text-lg">N/A</div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
