import React from 'react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { TCategory, TProduct, TSubCategory } from '@/types/storeTypes';
import ProductSwiperSlide from './ProductSwiperSlide';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductSwiper = ({
  category,
  categoryIndex,
}: {
  category: TCategory;
  categoryIndex: number;
}) => {
  return (
    <>
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
        className="flex w-full h-full overflow-clip"
      >
        {category.subcategories &&
          category.subcategories.length > 0 &&
          category.subcategories.map(
            (subcategory: TSubCategory, subCategoryIndex: number) => {
              return (
                <React.Fragment key={`subcategory-${subCategoryIndex}`}>
                  {subcategory.products &&
                    subcategory.products.length > 0 &&
                    subcategory.products.map(
                      (product: TProduct, productIndex: number) => {
                        return (
                          <SwiperSlide
                            key={`${categoryIndex}-${subCategoryIndex}-${productIndex}`}
                            className="flex !h-auto"
                          >
                            <ProductSwiperSlide product={product} />
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
    </>
  );
};

export default ProductSwiper;
