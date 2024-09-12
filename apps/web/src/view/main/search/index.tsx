'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import axiosInstance from '@/lib/axiosInstance';
import { BrandProps } from '@/types/brandTypes';
import { ProductProps } from '@/types/productTypes';
import { SubcategoryProps } from '@/types/subcategoryTypes';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectOrderBy from './component/SelectOrderBy';
import BrandFilter from './component/BrandFilter';
import SubcategoryFilter from './component/SubcategoryFilter';
import { Separator } from '@/components/ui/separator';
import ProductCard from './component/ProductCard';
import { HighPriceFilter, LowPriceFilter } from './component/PriceFilters';
import { useAppSelector } from '@/lib/hooks';
import { TStore } from '@/types/storeTypes';
import ProductNotFound from './component/ProductNotFound';
import ProductPagination from './component/ProductPagination';

export default function SearchMainView() {
  const nearestStore = useAppSelector((state) => state.storeId);
  const { storeId } = nearestStore;
  const [store, setStore] = useState<TStore>();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [brandId, setBrandId] = useState<number>();
  const [subcategoryId, setCategoryId] = useState<number>();
  const [lowPrice, setLowPrice] = useState<number>();
  const [highPrice, setHighPrice] = useState<number>();
  const [orderBy, setOrderBy] = useState<string>('nameAsc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const subcategoryHeaderId = searchParams.get('subcategoryId') || '';
  const routerNav = useRouter();
  const pageSize = 12;
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(total / pageSize);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const { handleSubmit } = useForm();

  async function handleProductSearch() {
    try {
      const params = new URLSearchParams(searchParams as any);
      const filters = {
        brandId: brandId,
        subcategoryId: subcategoryId,
        startPrice: lowPrice,
        endPrice: highPrice,
        keyword: keyword,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });
      routerNav.push(`/search?${params.toString()}`);

      const result = await axiosInstance().get(
        `${process.env.API_URL}/products?${params.toString()}&sortCol=${orderBy}&storeId=${storeId}&pageSize=${pageSize}`,
      );
      setProducts(result.data.data.products);
      setTotal(result.data.data.totalCount);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('Data is not fetched');
      }
    }
  }

  async function fetchData() {
    try {
      const result = await axiosInstance().get(
        `${process.env.API_URL}/products?${searchParams.toString()}&sortCol=${orderBy}&storeId=${storeId}&page=${page}&pageSize=${pageSize}`,
      );
      const brandResult = await axiosInstance().get(
        `${process.env.API_URL}/brands`,
      );
      const subcategoryResult = await axiosInstance().get(
        `${process.env.API_URL}/subcategories`,
      );
      const storeResult = await axiosInstance().get(
        `${process.env.API_URL}/stores/${storeId}`,
      );

      setStore(storeResult.data.data);
      setProducts(result.data.data.products);
      setSubcategories(subcategoryResult.data.data);
      setBrands(brandResult.data.data);
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
    fetchData();
  }, [orderBy, page, keyword, subcategoryHeaderId]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 lg:px-24 max-w-screen-2xl grid grid-cols-5 gap-4 -mt-2">
      <div className="hidden lg:block">
        <div className="col-span-1 p-4 bg-gray-50 rounded-lg shadow-sm">
          <SubcategoryFilter
            categoryId={subcategoryHeaderId}
            categories={subcategories}
            setCategoryId={setCategoryId}
          />
          <Separator className="my-4" />
          <BrandFilter brands={brands} setBrandId={setBrandId} />
          <Separator className="my-4" />
          <span className="font-medium">Harga</span>
          <div className="h-3" />
          <div className="flex flex-row gap-2">
            <LowPriceFilter lowPrice={lowPrice} setLowPrice={setLowPrice} />
            <HighPriceFilter
              highPrice={highPrice}
              setHighPrice={setHighPrice}
            />
          </div>
          <Separator className="my-4" />
          <Button onClick={handleSubmit(handleProductSearch)}>
            Tampilkan Produk
          </Button>
        </div>
      </div>
      <div className="col-span-5 lg:col-span-4 rounded-sm">
        <div className="flex items-start justify-between">
          <div className="flex flex-row gap-2" />
          <SelectOrderBy orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
            {products.map((product: ProductProps) => (
              <ProductCard
                key={product.id}
                product={product}
                storeName={store?.name}
              />
            ))}
          </div>
        ) : (
          <ProductNotFound />
        )}
        <div className="flex flex-col justify-between mt-4 text-gray-600">
          <div className="text-xs">
            Menampilkan {products.length} dari {total} produk
          </div>
          <ProductPagination pages={pages} setPage={setPage} />
        </div>
      </div>
      <div className="lg:hidden fixed bottom-4 right-4">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button>
              <FilterIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 pt-4">
              <SubcategoryFilter
                categoryId={subcategoryHeaderId}
                categories={subcategories}
                setCategoryId={setCategoryId}
              />
              <BrandFilter brands={brands} setBrandId={setBrandId} />
            </div>
            <Separator className="my-4" />
            Harga
            <div className="h-3" />
            <div className="flex flex-row gap-2">
              <LowPriceFilter lowPrice={lowPrice} setLowPrice={setLowPrice} />
              <HighPriceFilter
                highPrice={highPrice}
                setHighPrice={setHighPrice}
              />
            </div>
            <Separator className="my-4" />
            <Button onClick={handleSubmit(handleProductSearch)}>
              Tampilkan Produk
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
