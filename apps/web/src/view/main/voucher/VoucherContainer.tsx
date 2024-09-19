import React from 'react';
import { getCookie } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import Loading from '@/components/Loading';
import Error from '@/app/error';
import { NonProductPromotionProps } from '@/types/promotionType';
import { VoucherProps } from '@/types/voucherType';
import VoucherCard from './VoucherCard';

const VoucherContainer = () => {
  const token = getCookie('access-token');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance().get(`/vouchers/user`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    },
    queryKey: ['user_profile'],
  });

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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8">
      {data.map(
        (voucher: VoucherProps & { promotion: NonProductPromotionProps }) => (
          <VoucherCard key={voucher.id} voucher={voucher} />
        ),
      )}
    </div>
  );
};

export default VoucherContainer;
