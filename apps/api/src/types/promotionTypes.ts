import { $Enums } from '@prisma/client';

export type CreatePromotionInput = {
  creatorId: number;
  name: string;
  storeId?: number;
  banner?: string;
  scope: $Enums.PromotionScope;
  promotionState: $Enums.State;
  source: $Enums.PromotionSource;
  description: string;
  startedAt: Date;
  finishedAt: Date;
  quota: number;
  promotionType: $Enums.PromotionType;
  discountType: $Enums.DiscountType;
  discountValue: number;
  discountDurationSecs: number;
  isFeatured: boolean;
  minPurchase?: number;
  maxDeduction?: number;
  afterMinPurchase?: number;
  afterMinTransaction?: number;
};
