import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  NearestStore,
  OrderItem,
  TCourier,
  TCourierPrice,
  TShipping,
} from '@/types/orderTypes';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';
import { getCookie } from 'cookies-next';
import { Loader2Icon } from 'lucide-react';

type Props = {
  selectedAddressId: string;
  nearestStore: NearestStore | null;
  orderItems: OrderItem[];
  shipping: TShipping | null;
  setShipping: React.Dispatch<React.SetStateAction<TShipping | null>>;
};

const PilihKurirInput = ({
  selectedAddressId,
  nearestStore,
  orderItems,
  shipping,
  setShipping,
}: Props) => {
  const token = getCookie('access-token');

  const [selectedCourier, setSelectedCourier] = useState<TCourierPrice | null>(
    null,
  );

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: async () => {
      if (selectedAddressId) {
        const res = await axiosInstance().post(
          `/courier`,
          {
            storeId: nearestStore?.storeId || 1,
            addressId: parseInt(selectedAddressId),
            itemList: orderItems.map((item: OrderItem) => {
              return {
                name: item.name,
                quantity: item.quantity,
                value: item.price,
              };
            }),
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        return res.data.data.shippingPriceList as TCourier;
      }

      return false;
    },
    queryKey: ['couriers', selectedAddressId, orderItems],
  });

  const handleCourierChange = (val: string) => {
    if (data && data.success) {
      setSelectedCourier({
        courier_name: data.pricing[parseInt(val)].courier_name,
        courier_service_name: data.pricing[parseInt(val)].courier_service_name,
        duration: data.pricing[parseInt(val)].duration,
        price: data.pricing[parseInt(val)].price,
      });

      setShipping({
        amount: data.pricing[parseInt(val)].price,
        courier: `${data.pricing[parseInt(val)].courier_name} ${data.pricing[parseInt(val)].courier_service_name}`,
      });
    }
  };

  useEffect(() => {
    handleCourierChange('0');
  }, [data]);

  return (
    <>
      <h4 className="mb-2 font-semibold tracking-tight text-sm md:text-base">
        Pilih Kurir
      </h4>
      <Select
        onValueChange={(val: string) => handleCourierChange(val)}
        defaultValue="0"
      >
        <SelectTrigger className="w-full max-w-[320px]">
          <SelectValue placeholder="Pilih kurir" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Kurir</SelectLabel>
            {data && data?.success && data?.pricing.length > 0 && (
              <>
                {isLoading ? (
                  <div className="flex flex-row justify-center items-center w-full min-h-[32px]">
                    <Loader2Icon className="size-4 animate-spin mr-2" />
                  </div>
                ) : (
                  data.pricing.map((price, index) => {
                    let IDR = new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    });
                    return (
                      <SelectItem
                        key={`courier-${index}`}
                        value={index.toString()}
                        defaultChecked={index === 1}
                      >
                        {price.courier_name} {price.courier_service_name} (
                        {IDR.format(price.price)})
                      </SelectItem>
                    );
                  })
                )}
              </>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {selectedCourier && (
        <span className="text-xs text-muted-foreground">
          Estimasi tiba dalam {selectedCourier.duration}
        </span>
      )}
    </>
  );
};

export default PilihKurirInput;
