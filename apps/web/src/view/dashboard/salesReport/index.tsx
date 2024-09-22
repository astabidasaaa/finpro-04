'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { UserType } from '@/types/userType';
import StoreFilter from '@/components/dashboard/StoreFilter';
import { StoreProps } from '@/types/storeTypes';
import { getCookie } from 'cookies-next';
import { useAppSelector } from '@/lib/hooks';
import { InventoryUpdateProps, SortTime } from '@/types/inventoryType';
import PaginationInventory from '@/components/dashboard/Pagination';
import SelectYear from './SelectYear';
import SelectMonth from './SelectMonth';
import FinancialDashboard from './FinancialDashboard';
import { TopProductChart } from './TopProduct';
import { PieChartCategory } from './PieChartCategory';
import CategoryReportTable from './CategoryReportTable';
import { CategoryMock, ProductMock } from '@/types/salesType';
import ProductReportTable from './ProductReportTable';
import SelectOrderBy from './SelectOrderBy';

export default function SalesReportView() {
  const { user } = useAppSelector((state) => state.auth);
  const [inventoryUpdates, setInventoryUpdates] = useState<
    InventoryUpdateProps[]
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const [years, setYears] = useState<number[]>([2024]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [orderBy, setOrderBy] = useState<string>('nameAsc');
  const [storeId, setStoreId] = useState<number>();
  const [stores, setStores] = useState<StoreProps[]>([]);
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const searchParams = useSearchParams();
  const token = getCookie('access-token');

  async function fetchData() {
    try {
      //   const params = new URLSearchParams(searchParams as any);
      //   const filters = {
      //     keyword: keyword,
      //     storeId: storeId,
      //     page: page,
      //     pageSize: pageSize,
      //     sortCol: sortCol,
      //     filterType: filterType,
      //   };

      //   Object.entries(filters).forEach(([key, value]) => {
      //     if (value !== undefined) {
      //       params.set(key, value.toString());
      //     } else {
      //       params.delete(key);
      //     }
      //   });
      //   router.push(
      //     `/dashboard/inventory/inventory-history?${params.toString()}`,
      //   );

      if (user.role === UserType.STOREADMIN) {
        const storeResult = await axiosInstance().get(
          `${process.env.API_URL}/stores/single/${user.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const storeAdminId = storeResult.data.data.id;
        setStoreId(storeAdminId);

        // const inventoryResult = await axiosInstance().get(
        //   `${process.env.API_URL}/inventories/update/${storeAdminId}?${params.toString()}`,
        //   {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       Authorization: `Bearer ${token}`,
        //     },
        //   },
        // );

        // setInventoryUpdates(inventoryResult.data.data.inventoryUpdates);
        // setTotal(inventoryResult.data.data.totalCount);
      }

      //   if (user.role === UserType.SUPERADMIN) {
      //     const inventoryResult = await axiosInstance().get(
      //       `${process.env.API_URL}/inventories/update/all-store?${params.toString()}`,
      //       {
      //         headers: {
      //           'Content-Type': 'application/json',
      //           Authorization: `Bearer ${token}`,
      //         },
      //       },
      //     );

      //     setInventoryUpdates(inventoryResult.data.data.inventoryUpdates);
      //     setTotal(inventoryResult.data.data.totalCount);
      //   }

      const storeResult = await axiosInstance().get(
        `${process.env.API_URL}/stores`,
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
    const handler = setTimeout(() => {
      setKeyword(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    fetchData();
  }, [page, keyword, pageSize, storeId, orderBy, selectedYear]);

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
          <div className="flex flex-row gap-y-3 gap-x-1 justify-between">
            <div className="min-w-[170px] md:max-w-[300px] w-full">
              {user.role === UserType.SUPERADMIN ? (
                <StoreFilter stores={stores} setStoreId={setStoreId} />
              ) : (
                <div className="h-10" />
              )}
            </div>
            <div className="flex flex-col items-end gap-y-3">
              <SelectYear years={years} setSelectedYear={setSelectedYear} />
              <SelectMonth setSelectedMonth={setSelectedMonth} />
            </div>
          </div>
        </div>
        <FinancialDashboard />
        <div className="grid grid-cols-10 gap-4 pb-4">
          <TopProductChart />
          <PieChartCategory />
          <div className="col-span-10 xl:col-span-4">
            <CategoryReportTable data={CategoryMock} />
          </div>
        </div>
        <div className="flex items-start justify-between py-4">
          <Input
            placeholder="Cari produk..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <SelectOrderBy setOrderBy={setOrderBy} />
        </div>
        <ProductReportTable data={ProductMock} />
      </div>
    </div>
  );
}
