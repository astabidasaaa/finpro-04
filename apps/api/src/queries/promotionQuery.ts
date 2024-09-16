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

  public async getGeneralPromotions(
    promotionState: $Enums.State | undefined,
  ): Promise<Promotion[]> {
    try {
      const promotions = await prisma.promotion.findMany({
        where: {
          promotionState,
          scope: $Enums.PromotionScope.GENERAL,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return promotions;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengambil data promosi general',
      );
    }
  }

  private async isStoreExist(storeId: number) {
    const isStore = await prisma.store.findFirst({
      where: { id: storeId },
    });

    if (isStore === undefined) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak terdapat toko dengan ID ini',
      );
    }
  }

  public async getStorePromotions(
    promotionState: $Enums.State | undefined,
    storeId: number,
  ): Promise<Promotion[]> {
    let filters: any = { scope: $Enums.PromotionScope.STORE };

    if (storeId !== undefined && !isNaN(storeId)) {
      this.isStoreExist(storeId);
      filters = { ...filters, storeId };
    }

    if (promotionState !== undefined) {
      filters = { ...filters, promotionState };
    }

    const promotions = await prisma.promotion.findMany({
      where: filters,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return promotions;
  }

  public async getFreeProductPromotions(
    promotionState: $Enums.State | undefined,
    storeId: number,
  ): Promise<FreeProductPerStore[]> {
    let filters: any = {};

    if (storeId !== undefined && !isNaN(storeId)) {
      this.isStoreExist(storeId);

      filters = {
        ...filters,
        inventory: {
          storeId,
        },
      };
    }

    if (promotionState !== undefined) {
      filters = { ...filters, freeProductState: promotionState };
    }

    const promotions = await prisma.freeProductPerStore.findMany({
      where: filters,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return promotions;
  }

  public async getDiscountProductPromotions(
    promotionState: $Enums.State | undefined,
    storeId: number,
  ): Promise<ProductDiscountPerStore[]> {
    let filters: any = {};

    if (storeId !== undefined && !isNaN(storeId)) {
      this.isStoreExist(storeId);

      filters = {
        ...filters,
        inventory: {
          storeId,
        },
      };
    }

    if (promotionState !== undefined) {
      filters = { ...filters, productDiscountState: promotionState };
    }

    const promotions = await prisma.productDiscountPerStore.findMany({
      where: filters,
      orderBy: {
        updatedAt: 'desc',
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
