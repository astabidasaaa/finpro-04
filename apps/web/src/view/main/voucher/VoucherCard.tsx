import { DiscountType } from '@/types/productTypes';
import { PromotionType } from '@/types/promotionType';
import { VoucherDetail } from '@/types/voucherType';
import moment from 'moment';
import Image from 'next/image';

export default function VoucherCard({ voucher }: { voucher: VoucherDetail }) {
  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  const {
    promotionType,
    discountValue,
    discountType,
    maxDeduction,
    minPurchase,
  } = voucher.promotion;
  return (
    <div className="relative rounded-lg shadow-md hover:shadow-lg">
      <Image
        src={
          promotionType === PromotionType.DELIVERY
            ? '/deliverydisc.png'
            : '/transactiondisc.png'
        }
        alt="Voucher Image"
        layout="responsive"
        width={400}
        height={200}
        className="rounded-lg"
      />

      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-2 sm:p-4">
        <div>
          <div className="text-main-dark font-bold text-sm xl:text-lg">
            {promotionType === PromotionType.DELIVERY
              ? 'Ongkos Kirim'
              : 'Diskon Transaksi'}
          </div>
          <div className="text-sm sm:text-md xl:text-lg font-medium">
            {discountValue > 100 ? IDR.format(discountValue) : discountValue}
            {discountType === DiscountType.PERCENT && '%'}
          </div>
          {maxDeduction > 0 && (
            <p className="text-[10px] sm:text-[12px]">
              s.d. Rp{maxDeduction / 1000}rb
            </p>
          )}
          {minPurchase > 0 && (
            <p className="text-[10px] sm:text-xs">
              Min. Belanja Rp{minPurchase / 1000}rb
            </p>
          )}
        </div>
        <div className="text-sm">
          <p className="text-gray-500 text-xs">Berlaku hingga</p>
          <p className="font-bold text-main-dark text-xs sm:text-md xl:text-base">
            {moment(voucher.expiredAt).format('ll')}
          </p>
        </div>
      </div>
    </div>
  );
}
