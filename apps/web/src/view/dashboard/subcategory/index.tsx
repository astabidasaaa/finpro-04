'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import NoSubcategoryView from './NoSubcategoryView';
import { SubcategoryProps } from '@/types/subcategoryTypes';
import { CategoryProps } from '@/types/categoryTypes';
import SubcategoryTable from './SubcategoryTable';

export type SubcategoryDetail = SubcategoryProps & {
  _count: {
    products: number;
  };
};

export default function SubcategoryView() {
  const [subcategories, setSubcategories] = useState<SubcategoryDetail[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  async function fetchData() {
    try {
      const subcategoriesResult = await axiosInstance().get(
        `${process.env.API_URL}/subcategories/detail`,
      );

      const categories = await axiosInstance().get(
        `${process.env.API_URL}/categories`,
      );

      const categoryMap = new Map<number, string>();
      categories.data.data.forEach((category: CategoryProps) => {
        categoryMap.set(category.id, category.name);
      });

      const addCategorySubcategories: SubcategoryDetail[] =
        subcategoriesResult.data.data.map((subcategory: SubcategoryDetail) => ({
          ...subcategory,
          categoryName: categoryMap.get(subcategory.productCategoryId),
        }));

      setSubcategories(addCategorySubcategories);
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
        <h1 className="text-lg font-semibold md:text-2xl">Subkategori</h1>
      </div>
      {subcategories.length > 0 ? (
        <SubcategoryTable data={subcategories} />
      ) : (
        <NoSubcategoryView />
      )}
    </div>
  );
}
