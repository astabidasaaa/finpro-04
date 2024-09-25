import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import promotionQuery from '@/queries/promotionQuery';
import searchPromotionQuery from '@/queries/searchPromotionQuery';
import { HttpStatus } from '@/types/error';
import {
  InventoryData,
  SearchGeneralPromotionInput,
  SearchStorePromotionInput,
} from '@/types/promotionTypes';
import {
  $Enums,
  FreeProductPerStore,
  ProductDiscountPerStore,
  Promotion,
} from '@prisma/client';

class GetPromotionAction {
  private checkPromotionState(
    promotionState: string | undefined,
  ): $Enums.State | undefined {
    let state: $Enums.State | undefined = undefined;
    if (
      promotionState !== undefined &&
      Object.values($Enums.State).includes(promotionState as $Enums.State)
    ) {
      state = promotionState as $Enums.State;
    } else if (promotionState !== undefined) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak ada status promosi dengan nama tersebut',
      );
    }

    return state;
  }

  private async updateExpiredPromotionAction() {
    await prisma.promotion.updateMany({
      where: {
        AND: [
          {
            finishedAt: {
              lte: new Date(),
            },
          },
          {
            OR: [
              { promotionState: $Enums.State.DRAFT },
              { promotionState: $Enums.State.PUBLISHED },
            ],
          },
        ],
      },
      data: {
        promotionState: $Enums.State.ARCHIVED,
        updatedAt: new Date(),
      },
    });

    await prisma.freeProductPerStore.updateMany({
      where: {
        AND: [
          {
            finishedAt: {
              lte: new Date(),
            },
          },
          {
            OR: [
              { freeProductState: $Enums.State.DRAFT },
              { freeProductState: $Enums.State.PUBLISHED },
            ],
          },
        ],
      },
      data: {
        freeProductState: $Enums.State.ARCHIVED,
        updatedAt: new Date(),
      },
    });

    const promotion = await prisma.productDiscountPerStore.updateMany({
      where: {
        AND: [
          {
            finishedAt: {
              lte: new Date(),
            },
          },
          {
            OR: [
              { productDiscountState: $Enums.State.DRAFT },
              { productDiscountState: $Enums.State.PUBLISHED },
            ],
          },
        ],
      },
      data: {
        productDiscountState: $Enums.State.ARCHIVED,
        updatedAt: new Date(),
      },
    });

    console.log(promotion);
  }

  public async getGeneralPromotionsAction(
    props: SearchGeneralPromotionInput,
  ): Promise<{ promotions: Promotion[]; totalCount: number }> {
    const { promotionState } = props;
    const state = this.checkPromotionState(promotionState);
    await this.updateExpiredPromotionAction();

    const generalPromotions = await searchPromotionQuery.getGeneralPromotions({
      ...props,
      promotionState: state,
    });

    return generalPromotions;
  }

  public async getStorePromotionsAction(
    props: SearchStorePromotionInput,
  ): Promise<{ promotions: Promotion[]; totalCount: number }> {
    const { promotionState } = props;
    const state = this.checkPromotionState(promotionState);
    await this.updateExpiredPromotionAction();

    const storePromotions = await searchPromotionQuery.getStorePromotions({
      ...props,
      promotionState: state,
    });

    return storePromotions;
  }

  public async getFreeProductPromotionsAction(
    props: SearchStorePromotionInput,
  ): Promise<{
    promotions: (FreeProductPerStore & InventoryData)[];
    totalCount: number;
  }> {
    const { promotionState } = props;
    const state = this.checkPromotionState(promotionState);
    await this.updateExpiredPromotionAction();

    const freeProductPromotions =
      await searchPromotionQuery.getFreeProductPromotions({
        ...props,
        promotionState: state,
      });

    return freeProductPromotions;
  }

  public async getDiscountProductPromotionsAction(
    props: SearchStorePromotionInput,
  ): Promise<{
    promotions: (ProductDiscountPerStore & InventoryData)[];
    totalCount: number;
  }> {
    const { promotionState } = props;
    const state = this.checkPromotionState(promotionState);
    await this.updateExpiredPromotionAction();

    const discountProductPromotions =
      await searchPromotionQuery.getDiscountProductPromotions({
        ...props,
        promotionState: state,
      });

    return discountProductPromotions;
  }

  public async getActiveStorePromotionAction(
    storeId: number,
    id: number,
  ): Promise<Promotion[]> {
    await this.updateExpiredPromotionAction();

    const promotions = await promotionQuery.getActiveStorePromotionByStoreId(
      storeId,
      id,
    );

    return promotions;
  }
}

export default new GetPromotionAction();
