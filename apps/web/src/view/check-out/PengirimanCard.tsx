'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PilihAlamatDialog from './PilihAlamatDialog';
import { Address } from '@/types/addressType';
import { NearestStore, OrderItem, TShipping } from '@/types/orderTypes';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { getCookie } from 'cookies-next';
import Loading from '@/components/Loading';
import Error from '@/app/error';
import { Loader2Icon } from 'lucide-react';
import PilihKurirInput from './PilihKurirInput';

type TPengiriman = {
  addresses: Address[] | null;
  setAddresses: React.Dispatch<React.SetStateAction<Address[] | null>>;
  selectedAddressId: string;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
  nearestStore: NearestStore | null;
  orderItems: OrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  shipping: TShipping | null;
  setShipping: React.Dispatch<React.SetStateAction<TShipping | null>>;
};

const PengirimanCard = ({
  addresses,
  setAddresses,
  selectedAddressId,
  setSelectedAddressId,
  nearestStore,
  orderItems,
  setOrderItems,
  shipping,
  setShipping,
}: TPengiriman) => {
  const token = getCookie('access-token');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      const res = await axiosInstance().post(
        `/user/addresses/selected`,
        { addressId: selectedAddressId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data.data.selectedAddress;
    },
    queryKey: ['selected_address', selectedAddressId, orderItems],
  });

  useEffect(() => {
    if (data && data.id != selectedAddressId) {
      setSelectedAddressId(data.id);
    }
  }, [data, selectedAddressId]);

  return (
    <>
      <h3 className="mb-2 font-semibold tracking-tight text-base md:text-lg">
        Pengiriman
      </h3>
      <Card className={`relative mx-auto w-full`}>
        <CardHeader className="sr-only">
          <CardTitle className="sr-only">Detil Pengiriman</CardTitle>
          <CardDescription className="sr-only">
            Detail pengiriman berisi alamat dan pilihan kurir
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-start items-start !p-0">
          <div className="w-full border-b p-4 md:p-6">
            {isLoading ? (
              <div className="flex flex-row justify-center items-center w-full min-h-[40px]">
                <Loader2Icon className="size-4 animate-spin mr-2" />
                Loading...
              </div>
            ) : isError ? (
              <div className="flex justify-center items-center w-full min-h-[40px]">
                <Error error={error} reset={refetch} />
              </div>
            ) : (
              <PilihAlamatDialog
                addresses={addresses}
                setAddresses={setAddresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
                selectedAddress={data}
                refetchSelectedAddress={refetch}
              />
            )}
          </div>
          <div className="w-full p-4 md:p-6">
            <PilihKurirInput
              selectedAddressId={selectedAddressId}
              nearestStore={nearestStore}
              orderItems={orderItems}
              shipping={shipping}
              setShipping={setShipping}
            />
          </div>
        </CardContent>
        {/* <CardFooter className="space-x-4"></CardFooter> */}
      </Card>
    </>
  );
};

export default PengirimanCard;
