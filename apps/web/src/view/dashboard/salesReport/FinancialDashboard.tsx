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
  freeItems: 0,
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
      <MetricCardOverall
        title="Pendapatan"
        value={salesData}
        icon={DollarSign}
      />
      <MetricCard
        title="Jumlah Transaksi"
        value={salesData.transactionCount.toString()}
        icon={CreditCard}
      />
      <MetricCardItems
        title="Jumlah Barang Dibeli"
        value={salesData}
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

function MetricCardItems({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: SalesOverall;
  icon: React.ElementType;
}) {
  return (
    <Card className="min-w-[200px] flex-shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.itemCount !== null ? value.itemCount : 'N/A'}
        </div>
        {value.itemCount !== null && (
          <div className="text-xs mt-1.5">
            Promosi Gratis Produk:{' '}
            <span className="text-red-700">{value.freeItems} barang</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricCardOverall({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: SalesOverall;
  icon: React.ElementType;
}) {
  const cleanRevenue = value.cleanRevenue ? value.cleanRevenue : 0;
  const productRevenue = value.productRevenue ? value.productRevenue : 0;
  const deliveryRevenue = value.deliveryRevenue;
  const transactionPromotion = productRevenue + deliveryRevenue - cleanRevenue;
  return (
    <Card className="min-w-[200px] flex-shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {cleanRevenue > 0 ? IDR.format(cleanRevenue) : 'N/A'}
        </div>
        {value.cleanRevenue !== null && (
          <>
            <div className="text-xs mt-1.5">
              Penjualan Produk:{' '}
              <span className="text-green-700">
                {IDR.format(productRevenue)}
              </span>
            </div>
            <div className="text-xs">
              Ongkos Kirim:{' '}
              <span className="text-green-700">
                {IDR.format(deliveryRevenue)}
              </span>
            </div>
            <div className="text-xs">
              Promosi Diskon Transaksi:{' '}
              <span className="text-red-700">
                {IDR.format(transactionPromotion)}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
