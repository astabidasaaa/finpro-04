'use client';

import React, { useEffect } from 'react';
import Error from '@/app/error';
import Loading from '@/components/Loading';
import axiosInstance from '@/lib/axiosInstance';
import { useAppSelector } from '@/lib/hooks';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { TCategory, TProduct, TSubCategory } from '@/types/storeTypes';
import { truncateText } from '@/lib/utils';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const DisplayProductSection = () => {
  const nearestStore = useAppSelector((state) => state.storeId);
  const { storeId } = nearestStore;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance().get(`/stores/nearest-store/${storeId}`);

      return res.data.data.categories;
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
      {data && (
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
                    <Swiper
                      spaceBetween={20}
                      slidesPerView={1.8}
                      breakpoints={{
                        1280: {
                          slidesPerView: 4.7,
                        },
                        1024: {
                          slidesPerView: 3.5,
                        },
                        768: {
                          slidesPerView: 3.2,
                        },
                        480: {
                          slidesPerView: 2.4,
                        },
                      }}
                      navigation={{
                        enabled: true,
                        prevEl: `.prev-${category.id}`,
                        nextEl: `.next-${category.id}`,
                      }}
                      freeMode={true}
                      grabCursor={true}
                      modules={[Navigation]}
                      className="w-full overflow-clip"
                    >
                      {category.subcategories.map(
                        (
                          subcategory: TSubCategory,
                          subCategoryIndex: number,
                        ) => {
                          return (
                            <React.Fragment
                              key={`subcategory-${subCategoryIndex}`}
                            >
                              {subcategory.products.length > 0 &&
                                subcategory.products.map(
                                  (product: TProduct, productIndex: number) => {
                                    let IDR = new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR',
                                      maximumFractionDigits: 0,
                                    });

                                    return (
                                      <SwiperSlide
                                        key={`${categoryIndex}-${subCategoryIndex}-${productIndex}`}
                                      >
                                        <Link href={`/product/${product.id}`}>
                                          <Card>
                                            <CardHeader>
                                              <Image
                                                alt={product.name}
                                                className="aspect-square w-56 object-cover"
                                                height={400}
                                                width={400}
                                                src={
                                                  `${process.env.PRODUCT_API_URL}/${product.images[0].title}` ||
                                                  '/avatar-placeholder.png'
                                                }
                                              />
                                              <div className="flex justify-start items-center h-8 md:h-10">
                                                <CardTitle className="text-xs md:text-sm font-bold">
                                                  {truncateText(
                                                    product.name,
                                                    40,
                                                  )}
                                                </CardTitle>
                                              </div>
                                              <CardDescription className="text-xs md:text-sm">
                                                {IDR.format(
                                                  product.prices[0].price,
                                                )}
                                              </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                              <Badge
                                                variant="outline"
                                                className="text-[10px]"
                                              >
                                                {
                                                  product.inventories[0].store
                                                    .name
                                                }
                                              </Badge>
                                            </CardContent>
                                            <CardFooter>
                                              <Button
                                                variant="outline"
                                                className="w-full max-w-[360px] h-8 lg:h-10 text-xs text-main-dark border-main-dark"
                                              >
                                                <Plus className="size-4 mr-2" />
                                                Keranjang
                                              </Button>
                                            </CardFooter>
                                          </Card>
                                        </Link>
                                      </SwiperSlide>
                                    );
                                  },
                                )}
                            </React.Fragment>
                          );
                        },
                      )}
                    </Swiper>
                    <Button
                      variant="default"
                      className={`prev-${category.id} absolute top-[50%] -left-4 bg-main-dark hover:bg-main text-background border-none rounded-full size-10 cursor-pointer hidden md:block transition-all z-10`}
                    >
                      &#10094;
                    </Button>
                    <Button
                      variant="default"
                      className={`next-${category.id} absolute top-[50%] -right-4 bg-main-dark hover:bg-main text-background border-none rounded-full size-10 cursor-pointer hidden md:block transition-all z-10`}
                    >
                      &#10095;
                    </Button>
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
