import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import {
  InventoryData,
  SearchGeneralPromotion,
  SearchStorePromotion,
} from '@/types/promotionTypes';
import {
  Promotion,
  $Enums,
  FreeProductPerStore,
  ProductDiscountPerStore,
} from '@prisma/client';

class SearchPromotionQuery {
  public async getGeneralPromotions(
    props: SearchGeneralPromotion,
  ): Promise<{ promotions: Promotion[]; totalCount: number }> {
    try {
      let filters: any = {
        promotionState: props.promotionState,
        scope: $Enums.PromotionScope.GENERAL,
      };

      if (props.keyword !== '') {
        filters = { ...filters, name: { contains: props.keyword as string } };
      }

      const totalPromotions = await prisma.promotion.count({ where: filters });
      const promotions = await prisma.promotion.findMany({
        where: filters,
        orderBy: {
          updatedAt: 'desc',
        },
        take: props.pageSize,
        skip: (props.page - 1) * props.pageSize,
      });

      return { promotions, totalCount: totalPromotions };
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
    props: SearchStorePromotion,
  ): Promise<{ promotions: Promotion[]; totalCount: number }> {
    let filters: any = { scope: $Enums.PromotionScope.STORE };

    if (props.storeId !== undefined && !isNaN(props.storeId)) {
      this.isStoreExist(props.storeId);
      filters = { ...filters, storeId: props.storeId };
    }

    if (props.promotionState !== undefined) {
      filters = { ...filters, promotionState: props.promotionState };
    }

    if (props.keyword !== '') {
      filters = { ...filters, name: { contains: props.keyword as string } };
    }

    const totalPromotions = await prisma.promotion.count({ where: filters });
    const promotions = await prisma.promotion.findMany({
      where: filters,
      orderBy: {
        updatedAt: 'desc',
      },
      take: props.pageSize,
      skip: (props.page - 1) * props.pageSize,
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { promotions, totalCount: totalPromotions };
  }

  public async getFreeProductPromotions(props: SearchStorePromotion): Promise<{
    promotions: (FreeProductPerStore & InventoryData)[];
    totalCount: number;
  }> {
    const filters: any = { AND: [] };

    if (props.storeId !== undefined && !isNaN(props.storeId)) {
      this.isStoreExist(props.storeId);

      filters.AND.push({
        inventory: {
          storeId: props.storeId,
        },
      });
    }

    console.log(props.promotionState);
    if (props.promotionState !== undefined) {
      filters.AND.push({ freeProductState: props.promotionState });
    }

    if (props.keyword !== '') {
      filters.AND.push({
        OR: [
          {
            inventory: {
              product: {
                name: props.keyword,
              },
            },
          },
        ],
      });
    }

    const totalPromotions = await prisma.freeProductPerStore.count({
      where: filters,
    });
    const promotions = await prisma.freeProductPerStore.findMany({
      where: filters,
      orderBy: {
        updatedAt: 'desc',
      },
      take: props.pageSize,
      skip: (props.page - 1) * props.pageSize,
      include: {
        inventory: {
          select: {
            store: {
              select: {
                id: true,
                name: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return { promotions, totalCount: totalPromotions };
  }

  public async getDiscountProductPromotions(
    props: SearchStorePromotion,
  ): Promise<{
    promotions: (ProductDiscountPerStore & InventoryData)[];
    totalCount: number;
  }> {
    const filters: any = { AND: [] };

    if (props.storeId !== undefined && !isNaN(props.storeId)) {
      this.isStoreExist(props.storeId);

      filters.AND.push({
        inventory: {
          storeId: props.storeId,
        },
      });
    }

    if (props.promotionState !== undefined) {
      filters.AND.push({
        productDiscountState: props.promotionState,
      });
    }

    if (props.keyword !== '') {
      filters.AND.push({
        OR: [
          {
            inventory: {
              product: {
                name: props.keyword,
              },
            },
          },
        ],
      });
    }

    const totalPromotions = await prisma.productDiscountPerStore.count({
      where: filters,
    });
    const promotions = await prisma.productDiscountPerStore.findMany({
      where: filters,
      orderBy: {
        updatedAt: 'desc',
      },
      take: props.pageSize,
      skip: (props.page - 1) * props.pageSize,
      include: {
        inventory: {
          select: {
            store: {
              select: {
                id: true,
                name: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return { promotions, totalCount: totalPromotions };
  }
}

export default new SearchPromotionQuery();
