import { DiscountType, State } from './productTypes';

export type NonProductPromotionProps = {
  id: number;
  creatorId: number;
  promotionState: State;
  name: string;
  scope: PromotionScope;
  source: PromotionSource;
  storeId: number | null;
  description: string;
  startedAt: Date;
  finishedAt: Date;
  quota: number;
  promotionType: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  discountDurationSecs: number;
  banner: string | null;
  isFeatured: Boolean;
  minPurchase: number;
  maxDeduction: number;
  afterMinPurchase: number;
  afterMinTransaction: number;
};

export enum PromotionType {
  TRANSACTION = 'TRANSACTION',
  DELIVERY = 'DELIVERY',
}

export enum PromotionSource {
  REFEREE_BONUS = 'REFEREE_BONUS',
  REFERRAL_BONUS = 'REFERRAL_BONUS',
  PER_BRANCH = 'PER_BRANCH',
  ALL_BRANCH = 'ALL_BRANCH',
  AFTER_MIN_PURCHASE = 'AFTER_MIN_PURCHASE',
  AFTER_MIN_TRANSACTION = 'AFTER_MIN_TRANSACTION',
}

export enum PromotionScope {
  GENERAL = 'GENERAL',
  STORE = 'STORE',
}

enum DisplayPromotionType {
  TRANSACTION = 'TRANSAKSI',
  DELIVERY = 'PENGIRIMAN',
}

export const displayPromotionTypeMap = new Map<string, string>(
  Object.entries(DisplayPromotionType),
);

enum DisplayPromotionSource {
  REFEREE_BONUS = 'PEMBERI REFERAL',
  REFERRAL_BONUS = 'PENGGUNA REFERAL',
  PER_BRANCH = 'SATU CABANG',
  ALL_BRANCH = 'SELURUH CABANG',
  AFTER_MIN_PURCHASE = 'SETELAH MINIMAL BELANJA',
  AFTER_MIN_TRANSACTION = 'SETELAH TRANSAKSI',
}

export const displayPromotionSourceMap = new Map<string, string>(
  Object.entries(DisplayPromotionSource),
);

enum DisplayPromotionScope {
  GENERAL = 'UMUM',
  STORE = 'TOKO',
}

export const displayPromotionScopeMap = new Map<string, string>(
  Object.entries(DisplayPromotionScope),
);

enum DisplayState {
  DRAFT = 'DRAF',
  PUBLISHED = 'TERBIT',
  ARCHIVED = 'ARSIP',
}
export const displayStateMap = new Map<string, string>(
  Object.entries(DisplayState),
);

enum DisplayDiscountType {
  FLAT = 'FLAT',
  PERCENT = 'PERSEN',
}

export const displayDiscountTypeMap = new Map<string, string>(
  Object.entries(DisplayDiscountType),
);
