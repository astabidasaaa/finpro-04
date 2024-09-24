'use client';

import axiosInstance from '@/lib/axiosInstance';
import { BrandProps } from '@/types/brandTypes';
import { CategoryProps } from '@/types/categoryTypes';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import CreateProductForm from './ProductForm';
import { ProductProps } from '@/types/productTypes';
import { useRouter } from 'next/navigation';

export default function EditProductView({ productId }: { productId: string }) {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [product, setProduct] = useState<ProductProps>();
  const router = useRouter();

  async function fetchData() {
    try {
      const categoriesResult = await axiosInstance().get(
        `${process.env.API_URL}/categories/all`,
      );
      const brandsResult = await axiosInstance().get(
        `${process.env.API_URL}/brands`,
      );
      const productResult = await axiosInstance().get(
        `${process.env.API_URL}/products/single/${productId}`,
      );
      setCategories(categoriesResult.data.data);
      setBrands(brandsResult.data.data);
      setProduct(productResult.data.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('Data is not fetched');
      }
      router.push('/dashboard/product/list');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Edit Produk</h1>
        </div>
        {product && (
          <CreateProductForm
            brands={brands}
            categories={categories}
            product={product}
          />
        )}
      </div>
    </>
  );
}
