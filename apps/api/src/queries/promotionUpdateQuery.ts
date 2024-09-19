import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import {
  CreateDiscountProductPromotionInput,
  CreateFreeProductPromotionInput,
  CreatePromotionInput,
} from '@/types/promotionTypes';
import {
  $Enums,
  FreeProductPerStore,
  ProductDiscountPerStore,
  Promotion,
} from '@prisma/client';

class PromotionUpdateQuery {
  public async archiveNonProductPromotion(
    promotionId: number,
  ): Promise<Promotion> {
    try {
      const archivedPromotion = await prisma.promotion.update({
        where: {
          id: promotionId,
        },
        data: {
          promotionState: $Enums.State.ARCHIVED,
          updatedAt: new Date(),
          finishedAt: new Date(),
        },
      });

      return archivedPromotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengarsip promosi',
      );
    }
  }

  public async archiveFreeProductPromotion(
    promotionId: number,
  ): Promise<FreeProductPerStore> {
    try {
      const archivedPromotion = await prisma.freeProductPerStore.update({
        where: {
          id: promotionId,
        },
        data: {
          freeProductState: $Enums.State.ARCHIVED,
          updatedAt: new Date(),
          finishedAt: new Date(),
        },
      });

      return archivedPromotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengarsip promosi',
      );
    }
  }

  public async archiveDiscountProductPromotion(
    promotionId: number,
  ): Promise<ProductDiscountPerStore> {
    try {
      const archivedPromotion = await prisma.productDiscountPerStore.update({
        where: {
          id: promotionId,
        },
        data: {
          productDiscountState: $Enums.State.ARCHIVED,
          updatedAt: new Date(),
          finishedAt: new Date(),
        },
      });

      return archivedPromotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengarsip promosi',
      );
    }
  }

  public async updatePromotion(
    props: CreatePromotionInput & { id: number },
  ): Promise<Promotion> {
    try {
      const { id, ...otherProps } = props;
      const promotion = await prisma.promotion.update({
        where: {
          id,
        },
        data: {
          ...otherProps,
          updatedAt: new Date(),
        },
      });

      return promotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat merubah promosi',
      );
    }
  }

  public async editFreeProductPromotion(
    props: CreateFreeProductPromotionInput & { id: number },
  ): Promise<FreeProductPerStore> {
    try {
      const { id, ...otherProps } = props;
      const promotion = await prisma.freeProductPerStore.update({
        where: {
          id,
        },
        data: {
          ...otherProps,
          updatedAt: new Date(),
        },
      });

      return promotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memperbarui promosi gratis produk',
      );
    }
  }

  public async editDiscountProductPromotion(
    props: CreateDiscountProductPromotionInput & { id: number },
  ): Promise<ProductDiscountPerStore> {
    try {
      const { id, ...otherProps } = props;
      const promotion = await prisma.productDiscountPerStore.update({
        where: {
          id,
        },
        data: {
          ...otherProps,
          updatedAt: new Date(),
        },
      });

      return promotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memperbarui promosi diskon produk',
      );
    }
  }
}

export default new PromotionUpdateQuery();
