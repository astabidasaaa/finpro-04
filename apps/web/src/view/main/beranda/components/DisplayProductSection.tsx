'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Error from '@/app/error';
import Loading from '@/components/Loading';
import axiosInstance from '@/lib/axiosInstance';
import { useAppSelector } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { TCategory } from '@/types/storeTypes';
import ProductSwiper from './ProductSwiper';

const DisplayProductSection = () => {
  const nearestStore = useAppSelector((state) => state.storeId);
  const { storeId } = nearestStore;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      if (storeId) {
        const res = await axiosInstance().get(`/stores/nearest/${storeId}`);

        return res.data.data.categories;
      }

      return null;
    },
    queryKey: ['product_categories', storeId],
  });

  useEffect(() => {
    refetch();
  }, [storeId]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center w-full min-h-[120px] md:min-h-[320px]">
        <Error error={error} reset={refetch} />
      </div>
    );
  }

  return (
    <>
      {data && data.length > 0 && (
        <div className="flex flex-col gap-10">
          {data.map((category: TCategory, categoryIndex: number) => {
            return (
              <React.Fragment key={`category-${categoryIndex}`}>
                {category.subcategories.length > 0 && (
                  <div className="relative group flex flex-col gap-4">
                    <div className="flex flex-row justify-between items-center">
                      <h2 className="text-base md:text-xl font-semibold">
                        {category.name}
                      </h2>
                      <Button
                        variant="link"
                        asChild
                        className="py-0 h-5 text-main-dark text-xs md:text-sm"
                      >
                        <Link
                          href={`/search?subcategoryId=${category.subcategories[0].id}`}
                        >
                          Lihat semua
                        </Link>
                      </Button>
                    </div>
                    <ProductSwiper
                      category={category}
                      categoryIndex={categoryIndex}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </>
  );
};

export default DisplayProductSection;
