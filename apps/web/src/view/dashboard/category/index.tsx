'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import NoCategoryView from './NoCategoryView';
import { AxiosError } from 'axios';
import CategoryTable from './CategoryTable';
import { CategoryProps } from '@/types/categoryTypes';

export default function CategoryView() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  async function fetchData() {
    try {
      const result = await axiosInstance().get(
        `${process.env.API_URL}/categories`,
      );
      setCategories(result.data.data);
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
        <h1 className="text-lg font-semibold md:text-2xl">Kategori</h1>
      </div>
      {categories.length > 0 ? (
        <CategoryTable data={categories} />
      ) : (
        <NoCategoryView />
      )}
    </div>
  );
}
