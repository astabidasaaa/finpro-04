import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type {
  InventoryData,
  SearchGeneralPromotion,
  SearchStorePromotion,
} from '@/types/promotionTypes';
import {
  type Promotion,
  $Enums,
  type FreeProductPerStore,
  type ProductDiscountPerStore,
} from '@prisma/client';
import storeQuery from './storeQuery';

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

  public async getStorePromotions(
    props: SearchStorePromotion,
  ): Promise<{ promotions: Promotion[]; totalCount: number }> {
    let filters: any = {
      scope: $Enums.PromotionScope.STORE,
      store: {
        storeState: {
          not: $Enums.State.ARCHIVED,
        },
      },
    };

    if (props.storeId !== undefined && !isNaN(props.storeId)) {
      await storeQuery.isStoreExist(props.storeId);
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
      await storeQuery.isStoreExist(props.storeId);

      filters.AND.push({
        inventory: {
          storeId: props.storeId,
        },
      });
    }

    if (props.promotionState !== undefined) {
      filters.AND.push({ freeProductState: props.promotionState });
    }

    if (props.keyword !== '') {
      filters.AND.push({
        OR: [
          {
            inventory: {
              product: {
                name: { contains: props.keyword as string },
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
      await storeQuery.isStoreExist(props.storeId);

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
                name: { contains: props.keyword as string },
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
