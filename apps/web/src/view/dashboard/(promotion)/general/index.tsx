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
import GeneralPromotionTable from './GeneralPromotionTable';
import AddGeneralPromotion from './AddPromotionButton';
import { State } from '@/types/productTypes';

export default function GeneralPromotionView() {
  const [promotions, setPromotions] = useState<NonProductPromotionProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [promotionState, setPromotionState] = useState<State>(State.PUBLISHED);
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
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      router.push(`/dashboard/promotion/general?${params.toString()}`);

      const promotionResult = await axiosInstance().get(
        `${process.env.API_URL}/promotions/general?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPromotions(promotionResult.data.data.promotions);
      setTotal(promotionResult.data.data.totalCount);

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
  }, [page, keyword, pageSize, promotionState]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Promosi Umum</h1>
      </div>
      <div className="w-full">
        <div className="flex items-start justify-between py-4">
          <Input
            placeholder="Cari promosi..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <AddGeneralPromotion />
        </div>
        <Tabs
          value={promotionState}
          onValueChange={(value) => setPromotionState(value as State)}
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
            <GeneralPromotionTable data={promotions} />
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
