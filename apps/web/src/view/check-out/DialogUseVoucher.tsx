'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BadgePercent, ChevronRight } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { NonProductPromotionProps, PromotionType } from '@/types/promotionType';
import { getCookie } from 'cookies-next';
import { RadioGroup } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import VoucherCardSelection from './VoucherCard';
import PromotionClaim from './PromotionClaim';
import { NearestStore } from '@/types/orderTypes';
import { toast } from '@/components/ui/use-toast';
import { VoucherDetail } from '@/types/voucherType';

export type PromotionDetail = NonProductPromotionProps & {
  vouchers: { id: number }[];
};

export default function DialogUseVoucher({
  selectedDeliveryVoucherId,
  selectedTransactionVoucherId,
  setDeliveryVoucher,
  setTransactionVoucher,
  totalPrice,
  nearestStore,
}: {
  selectedDeliveryVoucherId: number | undefined;
  selectedTransactionVoucherId: number | undefined;
  setDeliveryVoucher: Dispatch<SetStateAction<VoucherDetail | null>>;
  setTransactionVoucher: Dispatch<SetStateAction<VoucherDetail | null>>;
  totalPrice: number;
  nearestStore: NearestStore | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deliveryVouchers, setDeliveryVouchers] = useState<VoucherDetail[]>([]);
  const [transactionVouchers, setTransactionVouchers] = useState<
    VoucherDetail[]
  >([]);
  const [storePromotions, setStorePromotions] = useState<PromotionDetail[]>([]);
  const [tempDeliveryVoucherId, setTempDeliveryVoucherId] = useState<
    number | undefined
  >(selectedDeliveryVoucherId);
  const [tempTransactionVoucherId, setTempTransactionVoucherId] = useState<
    number | undefined
  >(selectedTransactionVoucherId);
  const [claimCount, setClaimCount] = useState<number>(0);

  const [isMounted, setIsMounted] = useState(false);
  const token = getCookie('access-token');

  const userPromotionsId = [
    ...deliveryVouchers.map((voucher) => voucher.promotionId),
    ...transactionVouchers.map((voucher) => voucher.promotionId),
  ];

  async function fetchData() {
    try {
      const voucherResult = await axiosInstance().get(
        `${process.env.API_URL}/vouchers/user`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const vouchers: VoucherDetail[] = voucherResult.data.data;
      setDeliveryVouchers(
        vouchers.filter(
          (voucher) =>
            voucher.promotion.promotionType === PromotionType.DELIVERY,
        ),
      );
      setTransactionVouchers(
        vouchers.filter(
          (voucher) =>
            voucher.promotion.promotionType === PromotionType.TRANSACTION,
        ),
      );

      if (nearestStore !== null) {
        const storePromotionResult = await axiosInstance().get(
          `${process.env.API_URL}/promotions/activestore/${nearestStore.storeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setStorePromotions(storePromotionResult.data.data);
      }

      setIsMounted(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('Data is not fetched');
      }
    }
  }

  async function handleClaim(value: number) {
    try {
      await axiosInstance().post(
        `${process.env.API_URL}/vouchers/${value}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setClaimCount(claimCount + 1);
    } catch (error: any) {
      let message = '';
      if (error instanceof AxiosError) {
        message = error.response?.data;
      } else {
        message = error.message;
      }

      toast({
        variant: 'destructive',
        title: 'Kupon gagal diklaim',
        description: message,
      });
    }
  }

  function handleSubmit() {
    const deliveryVoucher = deliveryVouchers.filter(
      (voucher) => voucher.id == tempDeliveryVoucherId,
    );
    const transactionVoucher = transactionVouchers.filter(
      (voucher) => voucher.id == tempTransactionVoucherId,
    );
    setDeliveryVoucher(deliveryVoucher[0]);
    setTransactionVoucher(transactionVoucher[0]);
    setIsOpen(false);
  }

  useEffect(() => {
    fetchData();
    setTempDeliveryVoucherId(selectedDeliveryVoucherId);
    setTempTransactionVoucherId(selectedTransactionVoucherId);
  }, [isOpen, claimCount]);

  if (!isMounted) {
    return null;
  }

  const handleDeliveryVoucherClick = (value: string) => {
    if (tempDeliveryVoucherId?.toString() === value) {
      setTempDeliveryVoucherId(undefined);
    } else {
      setTempDeliveryVoucherId(parseInt(value));
    }
  };

  const handleTransactionVoucherClick = (value: string) => {
    if (tempTransactionVoucherId?.toString() === value) {
      setTempTransactionVoucherId(undefined);
    } else {
      setTempTransactionVoucherId(parseInt(value));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" asChild>
          <div className="flex flex-row justify-between items-center w-full !p-6">
            <span className="flex flex-row">
              <BadgePercent className="size-5 text-main-dark mr-2" /> Gunakan
              kupon
            </span>
            <ChevronRight />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pilih Kupon</DialogTitle>
          <DialogDescription>
            Anda dapat menggunakan kupon yang tersedia.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="space-y-6">
            {nearestStore !== null && (
              <div>
                <div className="text-md font-bold">Klaim Kupon Toko</div>
                <Separator className="mt-2 mb-4 h-[1.5px] bg-main-dark" />
                {storePromotions.length > 0 ? (
                  storePromotions.map((promotion) => (
                    <PromotionClaim
                      promotion={promotion}
                      totalPrice={totalPrice}
                      handleClaim={handleClaim}
                      userPromotionsId={userPromotionsId}
                      key={promotion.id}
                    />
                  ))
                ) : (
                  <div className="text-xs italic">
                    Promosi toko tidak tersedia
                  </div>
                )}
              </div>
            )}
            <div>
              <div className="text-md font-bold">Diskon Ongkir</div>
              <Separator className="mt-2 mb-4 h-[1.5px] bg-main-dark" />
              {deliveryVouchers.length > 0 ? (
                <RadioGroup value={tempDeliveryVoucherId?.toString() || ''}>
                  <div className="text-xs italic -mt-2">
                    Anda hanya bisa memilih 1 kupon ongkir
                  </div>
                  {deliveryVouchers.map((voucher) => (
                    <VoucherCardSelection
                      voucher={voucher}
                      totalPrice={totalPrice}
                      key={voucher.id}
                      handleItemClick={handleDeliveryVoucherClick}
                      nearestStore={nearestStore}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <div className="text-xs italic">
                  Anda tidak memiliki kupon diskon ongkir
                </div>
              )}
            </div>
            <div>
              <div className="text-md font-bold">Diskon Transaksi</div>
              <Separator className="mt-2 mb-4 h-[1.5px] bg-main-dark" />
              {transactionVouchers.length > 0 ? (
                <RadioGroup value={tempTransactionVoucherId?.toString() || ''}>
                  <div className="text-xs italic -mt-2">
                    Anda hanya bisa memilih 1 kupon transaksi
                  </div>
                  {transactionVouchers.map((voucher) => (
                    <VoucherCardSelection
                      voucher={voucher}
                      totalPrice={totalPrice}
                      key={voucher.id}
                      handleItemClick={handleTransactionVoucherClick}
                      nearestStore={nearestStore}
                    />
                  ))}
                </RadioGroup>
              ) : (
                <div className="text-xs italic">
                  Anda tidak memiliki kupon diskon transaksi
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit}>Pakai kupon</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
