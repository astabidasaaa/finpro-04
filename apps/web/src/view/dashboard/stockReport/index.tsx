'use client';
import { useEffect, useState, createContext, useContext } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { UserType } from '@/types/userType';
import StoreFilterStock from './StoreFilter';
import { StoreProps } from '@/types/storeTypes';
import { getCookie } from 'cookies-next';
import { useAppSelector } from '@/lib/hooks';
import StockReportTable from './StockReportTable';
import PaginationInventory from '@/components/dashboard/Pagination';
import { ProductStockChange } from '@/types/salesType';
import SelectOrderBy from '../salesReport/SelectOrderBy';
import SelectYear from '../salesReport/SelectYear';
import SelectMonth from '../salesReport/SelectMonth';

export const StockReportContext = createContext({
  selectedMonth: 0,
  selectedYear: 2024,
  orderBy: 'nameAsc',
  storeId: 0,
});

export default function StockReportView() {
  const { user } = useAppSelector((state) => state.auth);
  const nearestStore = useAppSelector((state) => state.storeId);
  const [inventories, setInventories] = useState<ProductStockChange[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 10;
  const [years, setYears] = useState<number[]>([2024]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [page, setPage] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<string>('nameAsc');
  const [stores, setStores] = useState<StoreProps[]>([]);
  const [storeId, setStoreId] = useState<number>(nearestStore.storeId);
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const searchParams = useSearchParams();
  const token = getCookie('access-token');

  async function fetchData() {
    try {
      const params = new URLSearchParams(searchParams as any);
      const filters = {
        keyword: keyword,
        year: selectedYear,
        month: selectedMonth,
        storeId: storeId,
        orderBy: orderBy,
        page: page,
        pageSize: pageSize,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      router.push(`/dashboard/report/stock?${params.toString()}`);

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

        const inventoryResult = await axiosInstance().get(
          `${process.env.API_URL}/inventories/product/${storeAdminId}?${params.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInventories(inventoryResult.data.data.products);
        setTotal(inventoryResult.data.data.totalCount);
      }

      if (user.role === UserType.SUPERADMIN) {
        const inventoryResult = await axiosInstance().get(
          `${process.env.API_URL}/inventories/product/all-store?${params.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInventories(inventoryResult.data.data.products);
        setTotal(inventoryResult.data.data.totalCount);
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
    const handler = setTimeout(() => {
      setKeyword(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  useEffect(() => {
    fetchData();
  }, [page, keyword, pageSize, storeId, selectedMonth, selectedYear, orderBy]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Laporan Stok</h1>
      </div>
      <div className="w-full">
        <div className="flex items-start justify-between py-4">
          <Input
            placeholder="Cari stok..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <SelectOrderBy setOrderBy={setOrderBy} />
        </div>
        <div className="flex flex-col gap-y-3 pb-4">
          {user.role === UserType.SUPERADMIN && (
            <StoreFilterStock
              stores={stores}
              setStoreId={setStoreId}
              nearestStore={nearestStore.storeId}
            />
          )}
        </div>
        <div className="flex items-end gap-3 pb-4">
          <SelectYear years={years} setSelectedYear={setSelectedYear} />
          <SelectMonth setSelectedMonth={setSelectedMonth} />
        </div>
        <StockReportContext.Provider
          value={{ selectedMonth, selectedYear, orderBy, storeId }}
        >
          <StockReportTable data={inventories} />
        </StockReportContext.Provider>
        <div className="text-sm py-3">
          {inventories.length} dari {total} stok inventaris
        </div>
        <PaginationInventory
          page={page}
          setPage={setPage}
          total={total}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
