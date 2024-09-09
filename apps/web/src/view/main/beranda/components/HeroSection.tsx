'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type TBanner = {
  name: string;
  banner: string;
  isFeatured: boolean;
};

const HeroSection = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => await axiosInstance().get(`/promotions/featured`),
    queryKey: ['featured_promotion'],
  });

  return (
    <div className="relative group w-full">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        // onSlideChange={() => console.log('slide change')}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          enabled: true,
          prevEl: '#slidePrev-btn',
          nextEl: '#slideNext-btn',
        }}
        grabCursor={true}
        pagination={{
          el: '#swiper-pagination',
          clickable: true,
          type: 'bullets',
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="rounded-xl overflow-clip z-0"
      >
        <SwiperSlide key="banner-main">
          <div className="w-full h-full">
            <Image
              src={`/sigmart-banner.png`}
              alt="Banner Sigmart"
              width={2400}
              height={800}
              className="object-cover object-center w-full h-full max-h-[100px] sm:max-h-[160px] md:max-h-[240px] lg:max-h-[280px]"
              priority
            />
          </div>
        </SwiperSlide>
        {!isLoading &&
          data &&
          data.data.data.featuredPromotions.map(
            (promotion: TBanner, index: number) => {
              return (
                <SwiperSlide key={`banner-${index}`}>
                  <div className="w-full h-full">
                    <Image
                      src={`${process.env.PROMOTION_API_URL}/${promotion.banner}`}
                      alt={promotion.name}
                      width={2400}
                      height={800}
                      className="object-cover object-center w-full h-full max-h-[100px] sm:max-h-[160px] md:max-h-[240px] lg:max-h-[280px]"
                      priority
                    />
                  </div>
                </SwiperSlide>
              );
            },
          )}
      </Swiper>
      <Button
        id="slidePrev-btn"
        variant="outline"
        className="absolute top-[50%] -left-4 bg-foreground/40 text-background border-none rounded-full size-10 cursor-pointer  translate-x-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-10"
      >
        &#10094;
      </Button>
      <Button
        id="slideNext-btn"
        variant="outline"
        className="absolute top-[50%] -right-4 bg-foreground/40 text-background border-none rounded-full size-10 cursor-pointer  -translate-x-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-10"
      >
        &#10095;
      </Button>
      <div
        id="swiper-pagination"
        className="absolute bottom-0 left-0 !z-10"
      ></div>
    </div>
  );
};

export default HeroSection;
