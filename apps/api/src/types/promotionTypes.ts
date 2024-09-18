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

export type CreateFreeProductPromotionInput = {
  freeProductState: $Enums.State;
  inventoryId: number;
  creatorId: number;
  buy: number;
  get: number;
  startedAt: Date;
  finishedAt: Date;
};

export type CreateDiscountProductPromotionInput = {
  productDiscountState: $Enums.State;
  inventoryId: number;
  creatorId: number;
  discountType: $Enums.DiscountType;
  discountValue: number;
  startedAt: Date;
  finishedAt: Date;
};

export type SearchGeneralPromotionInput = {
  promotionState: string | undefined;
  keyword: string;
  page: number;
  pageSize: number;
};

export type SearchGeneralPromotion = {
  promotionState: $Enums.State | undefined;
  keyword: string;
  page: number;
  pageSize: number;
};

export type SearchStorePromotionInput = {
  promotionState: string | undefined;
  storeId: number;
  keyword: string;
  page: number;
  pageSize: number;
};

export type SearchStorePromotion = {
  promotionState: $Enums.State | undefined;
  storeId: number;
  keyword: string;
  page: number;
  pageSize: number;
};

export type InventoryData = {
  inventory: {
    product: {
      id: number;
      name: string;
    };
    store: {
      id: number;
      name: string;
    };
  };
};
