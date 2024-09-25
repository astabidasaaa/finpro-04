'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { UserType } from '@/types/userType';
import StoreFilter from '@/components/dashboard/StoreFilter';
import { StoreProps } from '@/types/storeTypes';
import { StockChangeButton } from './StockChangeButton';
import { getCookie } from 'cookies-next';
import { useAppSelector } from '@/lib/hooks';
import { InventoryProps } from '@/types/inventoryType';
import InventoryTable from './InventoryTable';
import PaginationInventory from '@/components/dashboard/Pagination';

export default function ProductInventoryView() {
  const { user } = useAppSelector((state) => state.auth);
  const [inventories, setInventories] = useState<InventoryProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
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
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      router.push(
        `/dashboard/inventory/product-inventory?${params.toString()}`,
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
          `${process.env.API_URL}/inventories/${storeAdminId}?${params.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInventories(inventoryResult.data.data.inventories);
        setTotal(inventoryResult.data.data.totalCount);
      }

      if (user.role === UserType.SUPERADMIN) {
        const inventoryResult = await axiosInstance().get(
          `${process.env.API_URL}/inventories/all-store?${params.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInventories(inventoryResult.data.data.inventories);
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
  }, [page, keyword, pageSize, storeId]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Inventaris Produk</h1>
      </div>
      <div className="w-full">
        <div className="flex items-start justify-between py-4">
          <Input
            placeholder="Cari inventaris..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <StockChangeButton stores={stores} />
        </div>
        <div className="flex flex-col gap-y-3 pb-4">
          {user.role === UserType.SUPERADMIN && (
            <StoreFilter stores={stores} setStoreId={setStoreId} />
          )}
        </div>
        <InventoryTable data={inventories} />
        <div className="text-sm py-3">
          {inventories.length} dari {total} inventaris
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
