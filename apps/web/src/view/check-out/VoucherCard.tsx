import { RadioGroupItem } from '@/components/ui/radio-group';
import { VoucherDetail } from './DialogUseVoucher';
import { Label } from '@/components/ui/label';
import { DiscountType } from '@/types/productTypes';
import moment from 'moment';

export default function VoucherCardSelection({
  voucher,
  totalPrice,
}: {
  voucher: VoucherDetail;
  totalPrice: number;
}) {
  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });
  return (
    <>
      <div key={voucher.id} className="flex items-center space-x-5 mb-2">
        <RadioGroupItem
          value={voucher.id.toString()}
          id={voucher.id.toString()}
          disabled={totalPrice < voucher.promotion.minPurchase}
        />
        <div className="w-full h-full flex flex-col gap-y-3">
          <div>
            <Label
              htmlFor={voucher.id.toString()}
              className={
                totalPrice > voucher.promotion.minPurchase
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
        </div>
      </div>
    </>
  );
}
