'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { getCookie } from 'cookies-next';
import Pagination from '@/components/dashboard/Pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { NonProductPromotionProps } from '@/types/promotionType';
import StorePromotionTable from './StorePromotionTable';
import AddStorePromotion from './AddPromotionButton';
import { useAppSelector } from '@/lib/hooks';
import { StoreProps } from '@/types/storeTypes';
import { UserType } from '@/types/userType';
import StoreFilter from '@/components/dashboard/StoreFilter';

export default function StorePromotionView() {
  const { user } = useAppSelector((state) => state.auth);
  const [promotions, setPromotions] = useState<
    (NonProductPromotionProps & { store: StoreProps })[]
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const [storeId, setStoreId] = useState<number>();
  const [stores, setStores] = useState<StoreProps[]>([]);
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [promotionState, setPromotionState] = useState<
    'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  >('DRAFT');
  const [previousPromotionState, setPreviousPromotionState] =
    useState(promotionState);
  const [keyword, setKeyword] = useState<string>('');
  const searchParams = useSearchParams();
  const token = getCookie('access-token');

  async function fetchData() {
    try {
      const params = new URLSearchParams(searchParams as any);

      if (previousPromotionState !== promotionState) {
        setPage(1);
      }

      const filters = {
        keyword: keyword,
        promotionState: promotionState,
        page: page,
        pageSize: pageSize,
        storeId: storeId,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      router.push(`/dashboard/promotion/store?${params.toString()}`);

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

        params.delete('storeId');
        console.log(
          `${process.env.API_URL}/promotions/store?storeId=${storeId}${params.toString()}`,
        );
        const promotionResult = await axiosInstance().get(
          `${process.env.API_URL}/promotions/store?${params.toString()}&storeId=${storeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPromotions(promotionResult.data.data.promotions);
        setTotal(promotionResult.data.data.totalCount);
      }

      if (user.role === UserType.SUPERADMIN) {
        console.log(
          `${process.env.API_URL}/promotions/store?${params.toString()}`,
        );
        const promotionResult = await axiosInstance().get(
          `${process.env.API_URL}/promotions/store?${params.toString()}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setPromotions(promotionResult.data.data.promotions);
        setTotal(promotionResult.data.data.totalCount);
      }

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
    if (previousPromotionState !== promotionState) {
      setPreviousPromotionState(promotionState);
    }
    fetchData();
  }, [page, keyword, pageSize, promotionState, storeId]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Promosi Toko</h1>
      </div>
      <div className="w-full">
        <div className="flex items-start justify-between py-4">
          <Input
            placeholder="Cari promosi..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <AddStorePromotion stores={stores} />
        </div>
        <div className="flex flex-col gap-y-3 pb-4">
          {user.role === UserType.SUPERADMIN && (
            <StoreFilter stores={stores} setStoreId={setStoreId} />
          )}
        </div>
        <Tabs
          value={promotionState}
          onValueChange={(value) =>
            setPromotionState(value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')
          }
        >
          <TabsList>
            <TabsTrigger value="DRAFT" className="px-6">
              DRAF
            </TabsTrigger>
            <TabsTrigger value="PUBLISHED" className="px-6">
              TERBIT
            </TabsTrigger>
            <TabsTrigger value="ARCHIVED" className="px-6">
              ARSIP
            </TabsTrigger>
          </TabsList>
          <TabsContent value={promotionState}>
            <StorePromotionTable data={promotions} />
            <div className="text-sm py-3">
              {promotions.length} dari {total} promosi
            </div>
            <Pagination
              page={page}
              setPage={setPage}
              total={total}
              pageSize={pageSize}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
