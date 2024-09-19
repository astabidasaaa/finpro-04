import { SelectContent, SelectItem } from '@/components/ui/select';
import {
  PromotionSource,
  displayPromotionSourceMap,
} from '@/types/promotionType';

export default function SelectSourceType() {
  return (
    <SelectContent>
      <SelectItem
        key={PromotionSource.REFEREE_BONUS}
        value={PromotionSource.REFEREE_BONUS}
      >
        {displayPromotionSourceMap.get(PromotionSource.REFEREE_BONUS)}
      </SelectItem>
      <SelectItem
        key={PromotionSource.REFERRAL_BONUS}
        value={PromotionSource.REFERRAL_BONUS}
      >
        {displayPromotionSourceMap.get(PromotionSource.REFERRAL_BONUS)}
      </SelectItem>
      <SelectItem
        key={PromotionSource.AFTER_MIN_PURCHASE}
        value={PromotionSource.AFTER_MIN_PURCHASE}
      >
        {displayPromotionSourceMap.get(PromotionSource.AFTER_MIN_PURCHASE)}
      </SelectItem>
      <SelectItem
        key={PromotionSource.AFTER_MIN_TRANSACTION}
        value={PromotionSource.AFTER_MIN_TRANSACTION}
      >
        {displayPromotionSourceMap.get(PromotionSource.AFTER_MIN_TRANSACTION)}
      </SelectItem>
      <SelectItem
        key={PromotionSource.ALL_BRANCH}
        value={PromotionSource.ALL_BRANCH}
      >
        {displayPromotionSourceMap.get(PromotionSource.ALL_BRANCH)}
      </SelectItem>
    </SelectContent>
  );
}
