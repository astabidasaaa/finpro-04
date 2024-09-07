'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import NoProductView from './NoProductView';
import { AxiosError } from 'axios';
import ProductTable from './ProductTable';
import { ProductProps } from '@/types/productTypes';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProductListView() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 15;
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(total / pageSize);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  async function fetchData() {
    try {
      const result = await axiosInstance().get(
        `${process.env.API_URL}/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}`,
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
    fetchData();
  }, [page, keyword]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Produk</h1>
      </div>
      {products.length > 0 ? (
        <div className="w-full">
          <div className="flex items-start justify-between py-4 pr-5">
            <Input
              placeholder="Cari produk..."
              className="max-w-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} // Update input state
            />
            <Button
              onClick={() => router.push('/dashboard/product/add-product')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Produk
            </Button>
          </div>
          <ProductTable data={products} />
          <div className="text-sm py-3">
            {products.length} dari {total} produk
          </div>
          <Pagination>
            <PaginationContent>
              {pages.map((page) => (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        <NoProductView />
      )}
    </div>
  );
}
