import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import {
  CreateDiscountProductPromotionInput,
  CreateFreeProductPromotionInput,
  CreatePromotionInput,
  SearchGeneralPromotion,
} from '@/types/promotionTypes';
import {
  $Enums,
  FreeProductPerStore,
  ProductDiscountPerStore,
  Promotion,
} from '@prisma/client';

class PromotionQuery {
  public async createPromotion(
    props: CreatePromotionInput,
  ): Promise<Promotion> {
    try {
      const promotion = await prisma.promotion.create({
        data: props,
      });

      return promotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat promosi',
      );
    }
  }

  public async createFreeProductPromotion(
    props: CreateFreeProductPromotionInput,
  ): Promise<FreeProductPerStore> {
    try {
      const promotion = await prisma.freeProductPerStore.create({
        data: props,
      });

      return promotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat promosi gratis produk',
      );
    }
  }

  public async createDiscountProductPromotion(
    props: CreateDiscountProductPromotionInput,
  ): Promise<ProductDiscountPerStore> {
    try {
      const promotion = await prisma.productDiscountPerStore.create({
        data: props,
      });

      return promotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat promosi diskon produk',
      );
    }
  }

  public async getActiveGeneralPromotionBySource(
    source: $Enums.PromotionSource,
  ): Promise<Promotion[]> {
    const promotions = await prisma.promotion.findMany({
      where: {
        promotionState: $Enums.State.PUBLISHED,
        scope: $Enums.PromotionScope.GENERAL,
        source: source,
        storeId: null,
        startedAt: {
          lte: new Date(),
        },
        finishedAt: {
          gt: new Date(),
        },
        quota: {
          gt: 0,
        },
      },
    });

    return promotions;
  }

  public async getActiveStorePromotionByStoreId(
    storeId: number,
  ): Promise<Promotion[]> {
    const promotions = await prisma.promotion.findMany({
      where: {
        promotionState: $Enums.State.PUBLISHED,
        scope: $Enums.PromotionScope.STORE,
        storeId: storeId,
        startedAt: {
          lte: new Date(),
        },
        finishedAt: {
          gt: new Date(),
        },
        quota: {
          gt: 0,
        },
      },
      include: {
        vouchers: {
          select: {
            id: true,
          },
        },
      },
    });

    return promotions;
  }

  public async getFreeProductPromotionsByInventoryIdAndState(
    state: $Enums.State,
    inventoryId: number,
  ): Promise<FreeProductPerStore[]> {
    const promotions = await prisma.freeProductPerStore.findMany({
      where: {
        inventoryId,
        freeProductState: state,
      },
    });
    return promotions;
  }

  public async getDiscountProductPromotionsByInventoryIdAndState(
    state: $Enums.State,
    inventoryId: number,
  ): Promise<ProductDiscountPerStore[]> {
    const promotions = await prisma.productDiscountPerStore.findMany({
      where: {
        inventoryId,
        productDiscountState: state,
      },
    });
    return promotions;
  }

  public async getNonProductPromotionByPromotionId(
    promotionId: number,
  ): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: {
        id: promotionId,
      },
    });

    if (promotion === null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Promosi dengan ID ini tidak ditemukan',
      );
    }

    return promotion;
  }

  public async getFreeProductPromotionByPromotionId(
    promotionId: number,
  ): Promise<
    FreeProductPerStore & {
      inventory: {
        storeId: number;
      };
    }
  > {
    const promotion = await prisma.freeProductPerStore.findUnique({
      where: {
        id: promotionId,
      },
      include: {
        inventory: {
          select: {
            storeId: true,
          },
        },
      },
    });

    if (promotion === null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Promosi dengan ID ini tidak ditemukan',
      );
    }

    return promotion;
  }

  public async getDiscountProductPromotionByPromotionId(
    promotionId: number,
  ): Promise<
    ProductDiscountPerStore & {
      inventory: {
        storeId: number;
      };
    }
  > {
    const promotion = await prisma.productDiscountPerStore.findUnique({
      where: {
        id: promotionId,
      },
      include: {
        inventory: {
          select: {
            storeId: true,
          },
        },
      },
    });

    if (promotion === null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Promosi dengan ID ini tidak ditemukan',
      );
    }

    return promotion;
  }
}

export default new PromotionQuery();
