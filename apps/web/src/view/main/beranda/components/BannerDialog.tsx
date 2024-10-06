'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PromotionType, TBanner } from '@/types/promotionType';
import Image from 'next/image';
import axiosInstance from '@/lib/axiosInstance';
import { getCookie } from 'cookies-next';
import { toast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { DiscountType } from '@/types/productTypes';
import { IDR } from '@/lib/utils';

const BannerDialog = ({ promotion }: { promotion: TBanner }) => {
  const token = getCookie('access-token');

  const [open, setOpen] = useState<boolean>(false);
  const [isSubmitLoading, setSubmitLoading] = useState<boolean>(false);

  const handleClick = async () => {
    setSubmitLoading((prev) => true);

    try {
      const res = await axiosInstance().post(
        `/vouchers/${promotion.id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTimeout(() => {
        setSubmitLoading((prev) => false);

        if (res.status === 200) {
          setOpen((prev) => false);

          toast({
            variant: 'default',
            title: res.data.message,
            description:
              'Selamat! Anda mendapatkan kupon belanja dari Sigmart. Lihat kupon yang Anda miliki di halaman Kupon Saya.',
          });
        }
      }, 1500);
    } catch (error: any) {
      let message = '';
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      } else {
        message = error.message;
      }

      setTimeout(() => {
        toast({
          variant: 'destructive',
          title: 'Gagal mengklaim kupon',
          description: message,
        });

        setSubmitLoading((prev) => false);
      }, 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <div className="w-max -ml-6 -mt-3 mb-4 px-6 py-2 rounded-r-sm bg-main-dark text-left text-[10px] text-background font-bold tracking-wide">
            PROMOSI
          </div>
          <div className="w-full h-full !mt-0 !mb-3 rounded-sm overflow-hidden">
            <Image
              src={`${process.env.PROMOTION_API_URL}/${promotion.banner}`}
              alt={promotion.name}
              width={2400}
              height={800}
              className="object-cover object-center w-full h-full max-h-[96px] sm:max-h-[120px] md:max-h-[1600px] lg:max-h-[200px]"
              priority
            />
          </div>
          <DialogTitle className="[overflow-wrap:anywhere] text-pretty">
            {promotion.name}
          </DialogTitle>
          <DialogDescription className="[overflow-wrap:anywhere] text-pretty">
            {promotion.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col rounded-lg p-3 md:p-4 border gap-y-0.5">
          <span className="font-bold text-sm xl:text-base">
            Diskon{' '}
            {promotion.promotionType === PromotionType.TRANSACTION
              ? 'Transaksi'
              : 'Ongkir'}{' '}
            {promotion.discountValue > 100
              ? IDR.format(promotion.discountValue)
              : promotion.discountValue}
            {promotion.discountType === DiscountType.PERCENT && '%'}
          </span>
          {promotion.maxDeduction > 0 && (
            <span className="text-muted-foreground/80 text-xs">
              s.d. Rp{promotion.maxDeduction / 1000}rb
            </span>
          )}
          {promotion.source === 'REFEREE_BONUS' && (
            <span className="text-muted-foreground/80 text-xs">
              Berlaku bagi pemberi referral
            </span>
          )}
          {promotion.source === 'REFERRAL_BONUS' && (
            <span className="text-muted-foreground/80 text-xs">
              Berlaku bagi pengguna referral
            </span>
          )}
          {promotion.minPurchase > 0 && (
            <span className="text-muted-foreground/80 text-xs">
              Min. Belanja Rp{promotion.minPurchase / 1000}rb
            </span>
          )}
          {promotion.afterMinPurchase && (
            <span className="text-muted-foreground/80 text-xs text-pretty">
              Dapat diklaim setelah pembelanjaan mencapai Rp
              {promotion.afterMinPurchase / 1000}rb
            </span>
          )}
          {promotion.afterMinTransaction && (
            <span className="text-muted-foreground/80 text-xs">
              Dapat digunakan setelah {promotion.afterMinTransaction} kali
              transaksi
            </span>
          )}
          <span className="text-muted-foreground/80 text-xs">
            Berlaku selama{' '}
            <span className="font-bold text-main-dark">
              {promotion.discountDurationSecs / (24 * 60 * 60)} hari
            </span>
          </span>
        </div>
        {(promotion.source === 'ALL_BRANCH' ||
          promotion.source === 'PER_BRANCH') && (
          <DialogFooter>
            <Button
              type="button"
              disabled={isSubmitLoading}
              className="min-w-48 bg-main-dark hover:bg-main-dark/80"
              onClick={handleClick}
            >
              {isSubmitLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Klaim Kupon Belanja'
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BannerDialog;
