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
import {
  InventoryUpdateProps,
  InventoryUpdateType,
  SortTime,
} from '@/types/inventoryType';
import InventoryTable from './InventoryUpdatesTable';
import Pagination from '@/components/dashboard/Pagination';
import SelectOrderBy from './SelectOrderBy';
import SelectFilterType from './SelectTypeFilter';

export default function InventoryHistoryView() {
  const { user } = useAppSelector((state) => state.auth);
  const [inventoryUpdates, setInventoryUpdates] = useState<
    InventoryUpdateProps[]
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<InventoryUpdateType>();
  const [sortCol, setSortCol] = useState<SortTime>(SortTime.TIMEDESC);
  const [storeId, setStoreId] = useState<number>();
  const [stores, setStores] = useState<StoreProps[]>([]);
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
        storeId: storeId,
        page: page,
        pageSize: pageSize,
        sortCol: sortCol,
        filterType: filterType,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      router.push(
        `/dashboard/inventory/inventory-history?${params.toString()}`,
      );

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
          `${process.env.API_URL}/inventories/update/${storeAdminId}?${params.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInventoryUpdates(inventoryResult.data.data.inventoryUpdates);
        setTotal(inventoryResult.data.data.totalCount);
      }

      if (user.role === UserType.SUPERADMIN) {
        const inventoryResult = await axiosInstance().get(
          `${process.env.API_URL}/inventories/update/all-store?${params.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInventoryUpdates(inventoryResult.data.data.inventoryUpdates);
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
  }, [page, keyword, pageSize, storeId, sortCol, filterType]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Riwayat Inventaris
        </h1>
      </div>
      <div className="w-full">
        <div className="space-y-4">
          <div className="flex flex-row items-start gap-1 justify-between">
            <Input
              placeholder="Cari riwayat inventaris..."
              className="max-w-[300px]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <SelectOrderBy setOrderBy={setSortCol} />
          </div>
          <div className="flex flex-row gap-y-3 gap-x-1 justify-between">
            <div className="md:max-w-[300px] w-full">
              {user.role === UserType.SUPERADMIN ? (
                <StoreFilter stores={stores} setStoreId={setStoreId} />
              ) : (
                <div className="h-10" />
              )}
            </div>
            <SelectFilterType setFilterType={setFilterType} />
          </div>
        </div>
        <InventoryTable data={inventoryUpdates} />
        <div className="text-sm py-3">
          {inventoryUpdates.length} dari {total} inventaris
        </div>
        <Pagination
          page={page}
          setPage={setPage}
          total={total}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
