'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import ProductTable from './ProductTable';
import { ProductProps } from '@/types/productTypes';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UserType } from '@/types/userType';
import { useAppSelector } from '@/lib/hooks';
import Pagination from '@/components/dashboard/Pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductListView() {
  const { user } = useAppSelector((state) => state.auth);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 15;
  const [page, setPage] = useState<number>(1);
  const [productState, setProductState] = useState<
    'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  >('PUBLISHED');
  const [prevProductState, setPrevProductState] = useState(productState);
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const searchParams = useSearchParams();

  async function fetchData() {
    try {
      const params = new URLSearchParams(searchParams as any);

      if (prevProductState !== productState) {
        setPage(1);
      }

      const filters = {
        keyword: keyword,
        productState: productState,
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

      router.push(`/dashboard/product/list?${params.toString()}`);
      const result = await axiosInstance().get(
        `${process.env.API_URL}/products/list?${params.toString()}`,
      );

      setProducts(result.data.data.products);
      setTotal(result.data.data.totalCount);
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
    if (prevProductState !== productState) {
      setPrevProductState(productState);
    }
    fetchData();
  }, [page, keyword, productState]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Daftar Produk</h1>
      </div>
      <div className="w-full">
        <div className="flex items-start justify-between py-4 pr-5">
          <Input
            placeholder="Cari produk..."
            className="max-w-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} // Update input state
          />
          {user.role === UserType.SUPERADMIN && (
            <Button
              onClick={() => router.push('/dashboard/product/add-product')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Produk
            </Button>
          )}
        </div>
        <Tabs
          value={productState}
          onValueChange={(value) =>
            setProductState(value as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')
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
          <TabsContent value={productState}>
            <ProductTable data={products} />
            <div className="text-sm py-3">
              {products.length} dari {total} produk
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
