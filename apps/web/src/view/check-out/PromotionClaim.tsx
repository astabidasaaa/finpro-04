import { DiscountType } from '@/types/productTypes';
import { PromotionType } from '@/types/promotionType';
import { Button } from '@/components/ui/button';
import { PromotionDetail } from './DialogUseVoucher';
import { IDR } from '@/lib/utils';

export default function PromotionClaim({
  promotion,
  totalPrice,
  handleClaim,
  userPromotionsId,
}: {
  promotion: PromotionDetail;
  totalPrice: number;
  handleClaim: (value: number) => Promise<void>;
  userPromotionsId: number[];
}) {
  return (
    <>
      <div key={promotion.id} className="flex items-center space-x-5 mb-2">
        <div className="w-full h-full flex flex-row gap-x-4 align-middle items-center">
          <Button
            className="bg-main-dark w-18 h-7"
            value={promotion.id}
            disabled={
              totalPrice < promotion.minPurchase ||
              userPromotionsId.includes(promotion.id)
            }
            onClick={() => handleClaim(promotion.id)}
          >
            <div className="text-sm md:text-md">Klaim</div>
          </Button>
          <div className="flex flex-col pb-2 gap-y-0.5">
            <div className="font-bold text-sm xl:text-base">
              Diskon{' '}
              {promotion.promotionType === PromotionType.TRANSACTION
                ? 'Transaksi'
                : 'Ongkir'}{' '}
              {promotion.discountValue > 100
                ? IDR.format(promotion.discountValue)
                : promotion.discountValue}
              {promotion.discountType === DiscountType.PERCENT && '%'}
            </div>
            {promotion.maxDeduction > 0 && (
              <p className="text-[10px] sm:text-xs">
                s.d. Rp{promotion.maxDeduction / 1000}rb
              </p>
            )}

            <p className="text-[10px] sm:text-xs">
              Min. Belanja Rp{promotion.minPurchase / 1000}rb
            </p>
            <div className="text-gray-500 text-xs">
              Berlaku selama{' '}
              <span className="font-bold text-main-dark">
                {promotion.discountDurationSecs / (24 * 60 * 60)} hari
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
