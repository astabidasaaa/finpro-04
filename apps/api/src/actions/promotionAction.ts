import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import promotionQuery from '@/queries/promotionQuery';
import storeQuery from '@/queries/storeQuery';
import { HttpStatus } from '@/types/error';
import { CreatePromotionInput } from '@/types/promotionTypes';
import { $Enums, Promotion } from '@prisma/client';

class PromotionAction {
  public async createGeneralPromotionAction(
    props: CreatePromotionInput,
  ): Promise<Promotion> {
    if (
      (props.source === $Enums.PromotionSource.REFEREE_BONUS ||
        props.source === $Enums.PromotionSource.REFERRAL_BONUS ||
        props.source === $Enums.PromotionSource.AFTER_MIN_TRANSACTION) &&
      props.promotionState === $Enums.State.PUBLISHED
    ) {
      const currentPromotion = await prisma.promotion.findFirst({
        where: {
          source: props.source,
          promotionState: props.promotionState,
        },
      });

      if (currentPromotion !== null) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Promosi dengan sumber ini tidak dapat diterbitkan karena sudah terdapat promosi yang aktif dengan tipe yang sama',
        );
      }
    }

    if (
      props.source === $Enums.PromotionSource.AFTER_MIN_PURCHASE &&
      props.promotionState === $Enums.State.PUBLISHED
    ) {
      const currentPromotions = await prisma.promotion.findMany({
        where: {
          source: props.source,
          promotionState: props.promotionState,
        },
        select: {
          afterMinPurchase: true,
        },
      });

      const sameAfterMinPurchase = currentPromotions.filter(
        (value) => value.afterMinPurchase === props.afterMinPurchase,
      );

      if (sameAfterMinPurchase.length > 0) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Promosi dengan sumber ini tidak dapat diterbitkan karena sudah terdapat promosi yang aktif dengan nilai minimal transaksi yang sama',
        );
      }
    }

    if (
      props.source === $Enums.PromotionSource.PER_BRANCH ||
      props.storeId !== undefined
    ) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak dapat membuat promosi toko. API ini hanya untuk pembuatan promosi general',
      );
    }

    const promotion = await promotionQuery.createPromotion(props);

    return promotion;
  }

  public async createStorePromotionAction(
    props: CreatePromotionInput & { role: string },
  ): Promise<Promotion> {
    const { creatorId, storeId, role, ...otherProps } = props;
    if (storeId === undefined) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Toko belum dipilih');
    }
    const adminStore = await storeQuery.getAllAdminByStoreId(storeId);

    if (role === 'store admin' && !adminStore.includes(creatorId)) {
      throw new HttpException(
        HttpStatus.UNAUTHORIZED,
        'Admin tidak memiliki akses ke toko ini',
      );
    }

    const promotion = await promotionQuery.createPromotion({
      ...otherProps,
      creatorId,
      storeId,
    });
    return promotion;
  }
}

export default new PromotionAction();
