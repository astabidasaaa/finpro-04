'use client';

import { Input } from '@/components/ui/input';
import axiosInstance from '@/lib/axiosInstance';
import { BrandProps } from '@/types/brandTypes';
import { ProductProps } from '@/types/productTypes';
import { SubcategoryProps } from '@/types/subcategoryTypes';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectOrderBy from './component/SelectOrderBy';
import BrandFilter from './component/BrandFilter';
import SubcategoryFilter from './component/SubcategoryFilter';
import { Separator } from '@/components/ui/separator';
import ProductCard from './component/ProductCard';
import Image from 'next/image';

export default function SearchMainView() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [brandId, setBrandId] = useState<number>();
  const [subcategoryId, setCategoryId] = useState<number>();
  const [lowPrice, setLowPrice] = useState<number>();
  const [highPrice, setHighPrice] = useState<number>();
  const [orderBy, setOrderBy] = useState<string>('nameAsc');
  const [subcategories, setSubcategories] = useState<SubcategoryProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 20;
  const [page, setPage] = useState<number>(1);
  const totalPages = Math.ceil(total / pageSize);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const router = useRouter();

  const { setValue, handleSubmit } = useForm();
  const [inputValue, setInputValue] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  async function handleProductSearch() {
    try {
      const result = await axiosInstance().get(
        `${process.env.API_URL}/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}&sortCol=${orderBy}&brandId=${brandId}&subcategoryId=${subcategoryId}&startPrice=${lowPrice}&endPrice=${highPrice}`,
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
        `${process.env.API_URL}/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}&sortCol=${orderBy}&brandId=${brandId}&subcategoryId=${subcategoryId}&startPrice=${lowPrice}&endPrice=${highPrice}`,
      );
      const brandResult = await axiosInstance().get(
        `${process.env.API_URL}/brands`,
      );
      const subcategoryResult = await axiosInstance().get(
        `${process.env.API_URL}/subcategories`,
      );

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
  }, [page, keyword, orderBy]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto mt-8 grid grid-cols-5 gap-4 pt-3">
      <div className="col-span-1 p-4 bg-gray-50 rounded-lg shadow-sm">
        <SubcategoryFilter
          categories={subcategories}
          setCategoryId={setCategoryId}
        />
        <Separator className="my-4" />
        <BrandFilter brands={brands} setBrandId={setBrandId} />
        <Separator className="my-4" />
        Harga
        <div className="h-3" />
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Minimal"
            type="number"
            value={lowPrice !== undefined ? lowPrice : ''}
            onChange={(e) =>
              setLowPrice(e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <Input
            placeholder="Maksimal"
            type="number"
            value={highPrice !== undefined ? highPrice : ''}
            onChange={(e) =>
              setHighPrice(e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>
        <Separator className="my-4" />
        <Button onClick={handleSubmit(handleProductSearch)}>
          Tampilkan Produk
        </Button>
        {products.length} {total} {orderBy} brand: {brandId} subcategory:{' '}
        {subcategoryId} {highPrice} {lowPrice}
      </div>
      <div className="col-span-4 rounded-sm">
        <div className="flex items-start justify-between py-4 pr-5">
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Cari produk..."
              className="max-w-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button>
              <Search
                className="h-4 w-4"
                onClick={() => setKeyword(inputValue)}
              />
            </Button>
          </div>
          <SelectOrderBy orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {products.map((product: ProductProps) => (
              <ProductCard product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-3 mx-auto text-sm md:text-lg font-semibold pt-10">
            <Image
              alt="not found"
              className="aspect-square object-cover"
              height={100}
              width={100}
              src="/assets/not-found.png"
            />
            Produk tidak ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
