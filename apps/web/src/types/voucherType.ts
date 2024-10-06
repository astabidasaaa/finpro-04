import { NonProductPromotionProps } from './promotionType';

export type VoucherProps = {
  id: number;
  promotionId: number;
  customerId: number;
  orderId: number | null;
  status: VoucherStatus;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export enum VoucherStatus {
  UNUSED = 'UNUSED',
  USED = 'USED',
}

export type VoucherDetail = VoucherProps & {
  promotion: NonProductPromotionProps & { store: { name: string } };
};
