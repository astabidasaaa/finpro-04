import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type {
  CreateDiscountProductPromotionInput,
  CreateFreeProductPromotionInput,
  CreatePromotionInput,
} from '@/types/promotionTypes';
import {
  $Enums,
  type FreeProductPerStore,
  type ProductDiscountPerStore,
  type Promotion,
} from '@prisma/client';

class PromotionUpdateQuery {
  public async updateNonProductPromotionState(
    promotionId: number,
    state: $Enums.State,
  ): Promise<Promotion> {
    try {
      const updatedPromotion = await prisma.promotion.update({
        where: {
          id: promotionId,
        },
        data: {
          promotionState: state,
          updatedAt: new Date(),
        },
      });

      return updatedPromotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengubah status promosi',
      );
    }
  }

  public async updateFreeProductPromotionState(
    promotionId: number,
    state: $Enums.State,
  ): Promise<FreeProductPerStore> {
    try {
      const updatedPromotion = await prisma.freeProductPerStore.update({
        where: {
          id: promotionId,
        },
        data: {
          freeProductState: state,
          updatedAt: new Date(),
        },
      });

      return updatedPromotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengubah status promosi',
      );
    }
  }

  public async updateDiscountProductPromotionState(
    promotionId: number,
    state: $Enums.State,
  ): Promise<ProductDiscountPerStore> {
    try {
      const updatedPromotion = await prisma.productDiscountPerStore.update({
        where: {
          id: promotionId,
        },
        data: {
          productDiscountState: state,
          updatedAt: new Date(),
        },
      });

      return updatedPromotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengubah status promosi',
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
