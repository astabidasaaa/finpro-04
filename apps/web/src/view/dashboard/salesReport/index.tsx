'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserType } from '@/types/userType';
import StoreFilter from '@/components/dashboard/StoreFilter';
import { StoreProps } from '@/types/storeTypes';
import { getCookie } from 'cookies-next';
import { useAppSelector } from '@/lib/hooks';
import SelectYear from './SelectYear';
import SelectMonth from './SelectMonth';
import FinancialDashboard from './FinancialDashboard';
import { TopProductChart } from './TopProduct';
import { PieChartCategory } from './PieChartCategory';
import CategoryReportTable from './CategoryReportTable';
import { ProductAndCategoryReport } from '@/types/salesType';
import {
  fetchCategoryStoreAdmin,
  fetchCategorySuperAdmin,
  fetchStore,
} from './fetchSales';
import ProductSalesDashboard from './ProductSales';
import { generateYearsArray } from '@/utils/generateYears';

export default function SalesReportView() {
  const { user } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const years = generateYearsArray(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [categorySales, setCategorySales] = useState<
    ProductAndCategoryReport[]
  >([]);
  const [storeId, setStoreId] = useState<number>();
  const [stores, setStores] = useState<StoreProps[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = getCookie('access-token');

  async function fetchData() {
    try {
      const params = new URLSearchParams(searchParams as any);
      const filters = {
        storeId: storeId,
        month: selectedMonth,
        year: selectedYear,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      router.push(`/dashboard/report/sales?${params.toString()}`);

      if (user.role === UserType.STOREADMIN) {
        const storeAdminId = await fetchStore(user.id, token);
        setStoreId(storeAdminId);

        const categoryResult = await fetchCategoryStoreAdmin(
          storeAdminId,
          token,
          selectedMonth,
          selectedYear,
        );
        setCategorySales(categoryResult);
      } else if (user.role == UserType.SUPERADMIN) {
        const categoryResult = await fetchCategorySuperAdmin(
          storeId,
          token,
          selectedMonth,
          selectedYear,
        );
        setCategorySales(categoryResult);
      }

      const storeResult = await axiosInstance().get(
        `${process.env.API_URL}/stores/admin`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStores(storeResult.data.data);
      setIsMounted(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('Data is not fetched');
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [storeId, selectedMonth, selectedYear]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Laporan Penjualan</h1>
      </div>
      <div className="w-full">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-y-3 gap-x-1 justify-between w-full">
            <div className="md:max-w-[300px]">
              {user.role === UserType.SUPERADMIN ? (
                <StoreFilter stores={stores} setStoreId={setStoreId} />
              ) : (
                <div className="h-10" />
              )}
            </div>
            <div className="flex flex-row items-end md:items-center gap-2">
              <SelectYear years={years} setSelectedYear={setSelectedYear} />
              <SelectMonth setSelectedMonth={setSelectedMonth} />
            </div>
          </div>
        </div>
        <FinancialDashboard
          storeId={storeId}
          token={token}
          month={selectedMonth}
          year={selectedYear}
        />
        <div className="grid grid-cols-10 gap-4 pb-4">
          <TopProductChart
            storeId={storeId}
            token={token}
            month={selectedMonth}
            year={selectedYear}
          />
          <PieChartCategory
            storeId={storeId}
            token={token}
            month={selectedMonth}
            year={selectedYear}
          />
          <div className="col-span-10 xl:col-span-4">
            <CategoryReportTable data={categorySales} />
          </div>
        </div>
        <ProductSalesDashboard
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          storeId={storeId}
          user={user}
        />
      </div>
    </div>
  );
}
