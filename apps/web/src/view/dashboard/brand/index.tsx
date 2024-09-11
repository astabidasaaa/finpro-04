'use client';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import NoBrandView from './NoBrandView';
import { AxiosError } from 'axios';
import { BrandProps } from '@/types/brandTypes';
import BrandTable from './BrandTable';

export default function BrandView() {
  const [brands, setBrands] = useState<BrandProps[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  async function fetchData() {
    try {
      const result = await axiosInstance().get(`${process.env.API_URL}/brands`);
      setBrands(result.data.data);
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
        <h1 className="text-lg font-semibold md:text-2xl">Brand</h1>
      </div>
      {brands.length > 0 ? <BrandTable data={brands} /> : <NoBrandView />}
    </div>
  );
}
