import { RadioGroupItem } from '@/components/ui/radio-group';
import { VoucherDetail } from '@/types/voucherType';
import { Label } from '@/components/ui/label';
import { DiscountType } from '@/types/productTypes';
import { IDR } from '@/lib/utils';
import moment from 'moment';
import { NearestStore } from '@/types/orderTypes';
import { Store } from 'lucide-react';

export default function VoucherCardSelection({
  voucher,
  totalPrice,
  handleItemClick,
  nearestStore,
}: {
  voucher: VoucherDetail;
  totalPrice: number;
  handleItemClick: (value: string) => void;
  nearestStore: NearestStore | null;
}) {
  const differentStore =
    voucher.promotion.storeId !== null
      ? voucher.promotion.storeId !== nearestStore?.storeId
      : false;
  return (
    <>
      <div key={voucher.id} className="flex items-center space-x-5 mb-2">
        <RadioGroupItem
          value={voucher.id.toString()}
          id={voucher.id.toString()}
          disabled={
            totalPrice < voucher.promotion.minPurchase || differentStore
          }
          onClick={() => handleItemClick(voucher.id.toString())}
        />
        <div className="w-full h-full flex flex-col gap-y-3">
          <div>
            <Label
              htmlFor={voucher.id.toString()}
              className={
                totalPrice > voucher.promotion.minPurchase &&
                differentStore === false
                  ? 'flex flex-col'
                  : 'flex flex-col text-muted-foreground'
              }
            >
              <div className="font-bold text-sm xl:text-base">
                Diskon{' '}
                {voucher.promotion.discountValue > 100
                  ? IDR.format(voucher.promotion.discountValue)
                  : voucher.promotion.discountValue}
                {voucher.promotion.discountType === DiscountType.PERCENT && '%'}
              </div>
            </Label>
            {voucher.promotion.maxDeduction > 0 && (
              <p className="text-[10px] sm:text-xs">
                s.d. Rp{voucher.promotion.maxDeduction / 1000}rb
              </p>
            )}

            <p className="text-[10px] sm:text-xs">
              Min. Belanja Rp{voucher.promotion.minPurchase / 1000}rb
            </p>
          </div>
          <div className="text-gray-500 text-xs">
            Berlaku hingga{' '}
            <span className="font-bold text-main-dark">
              {moment(voucher.expiredAt).format('ll')}
            </span>
          </div>
          {voucher.promotion.storeId !== null && (
            <div className="text-xs flex flex-row items-center">
              <Store className="h-3 w-3 mr-1.5" />{' '}
              {voucher.promotion.store.name}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
