'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axiosInstance from '@/lib/axiosInstance';
import { IDR } from '@/lib/utils';
import { SalesOverall } from '@/types/salesType';
import { CookieValueTypes } from 'cookies-next';
import { CreditCard, DollarSign, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

const defaultSales: SalesOverall = {
  cleanRevenue: 0,
  productRevenue: 0,
  deliveryRevenue: 0,
  transactionCount: 0,
  itemCount: 0,
};

export default function FinancialDashboard({
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
  const [salesData, setSalesData] = useState<SalesOverall>(defaultSales);

  async function fetchData() {
    if (storeId === undefined) {
      const salesResult = await axiosInstance().get(
        `${process.env.API_URL}/sales/overall/all-store?month=${month}&year=${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSalesData(salesResult.data.data);
    } else {
      const salesResult = await axiosInstance().get(
        `${process.env.API_URL}/sales/overall/single/${storeId}?month=${month}&year=${year}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSalesData(salesResult.data.data);
    }
  }

  useEffect(() => {
    fetchData();
  }, [year, storeId, month]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-3">
      <MetricCard
        title="Pendapatan"
        value={
          salesData.cleanRevenue !== null
            ? IDR.format(salesData.cleanRevenue)
            : '0'
        }
        icon={DollarSign}
      />
      <MetricCard
        title="Jumlah Transaksi"
        value={salesData.transactionCount.toString()}
        icon={CreditCard}
      />
      <MetricCard
        title="Jumlah Barang Dibeli"
        value={salesData.itemCount?.toString() ?? '0'}
        icon={Package}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="min-w-[200px] flex-shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
