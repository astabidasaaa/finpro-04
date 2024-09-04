'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { BrandProps } from '@/types/brandTypes';
import { CategoryProps } from '@/types/categoryTypes';
import CreateProductForm from './ProductForm';

export default function AddProductView() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  async function fetchData() {
    try {
      const categoriesResult = await axiosInstance().get(
        `${process.env.API_URL}/categories`,
      );
      const brandsResult = await axiosInstance().get(
        `${process.env.API_URL}/brands`,
      );
      setCategories(categoriesResult.data.data);
      setBrands(brandsResult.data.data);

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
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Tambah Produk</h1>
      </div>
      <CreateProductForm brands={brands} categories={categories} />
    </div>
  );
}
