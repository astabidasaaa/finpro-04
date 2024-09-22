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
import PaginationInventory from '@/components/dashboard/Pagination';
import { Label } from '@/components/ui/label';

export default function SearchMainView() {
  const nearestStore = useAppSelector((state) => state.storeId);
  const { storeId } = nearestStore;

  const routerNav = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const subcategoryHeaderId = searchParams.get('subcategoryId') || '';

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

  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

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
      setIsFilterOpen(false);
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
    <div className="px-4 md:px-12 lg:px-24 max-w-screen-2xl grid grid-cols-5 gap-4">
      <div className="hidden lg:block">
        <div className="col-span-1 p-4 bg-muted/30 rounded-lg shadow-sm">
          <SubcategoryFilter
            categoryId={subcategoryHeaderId}
            categories={subcategories}
            setCategoryId={setCategoryId}
          />
          <Separator className="my-4" />
          <BrandFilter brands={brands} setBrandId={setBrandId} />
          <Separator className="my-4" />
          <div className="flex flex-col gap-2 w-full">
            <Label className="font-bold">Harga</Label>
            <div className="flex flex-row gap-2">
              <LowPriceFilter lowPrice={lowPrice} setLowPrice={setLowPrice} />
              <HighPriceFilter
                highPrice={highPrice}
                setHighPrice={setHighPrice}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <Button
            onClick={handleSubmit(handleProductSearch)}
            className="!w-full !text-xs"
          >
            Tampilkan Produk
          </Button>
        </div>
      </div>
      <div className="flex flex-col h-full col-span-5 lg:col-span-4">
        <div className="flex flex-col w-full h-full">
          <div className="flex items-start justify-end">
            <SelectOrderBy orderBy={orderBy} setOrderBy={setOrderBy} />
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pt-4">
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
        </div>
        <div className="flex flex-col justify-between mt-8 gap-3 text-muted-foreground">
          <div className="text-xs text-center">
            Menampilkan {products.length} dari {total} produk
          </div>
          <PaginationInventory
            page={page}
            setPage={setPage}
            total={total}
            pageSize={pageSize}
          />
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
          <SheetContent side="bottom" className="px-3">
            <SheetHeader>
              <SheetTitle>Filter</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-2 pt-4">
              <SubcategoryFilter
                categoryId={subcategoryHeaderId}
                categories={subcategories}
                setCategoryId={setCategoryId}
              />
              <BrandFilter brands={brands} setBrandId={setBrandId} />
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-2 w-full">
              <Label className="font-bold">Harga</Label>
              <div className="flex flex-row gap-2">
                <LowPriceFilter lowPrice={lowPrice} setLowPrice={setLowPrice} />
                <HighPriceFilter
                  highPrice={highPrice}
                  setHighPrice={setHighPrice}
                />
              </div>
            </div>
            <Separator className="my-4" />
            <Button
              onClick={handleSubmit(handleProductSearch)}
              className="w-full"
            >
              Tampilkan Produk
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
