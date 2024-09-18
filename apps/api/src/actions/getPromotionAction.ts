import { HttpException } from '@/errors/httpException';
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

  public async getGeneralPromotionsAction(
    props: SearchGeneralPromotionInput,
  ): Promise<{ promotions: Promotion[]; totalCount: number }> {
    const { promotionState } = props;
    const state = this.checkPromotionState(promotionState);

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

    const discountProductPromotions =
      await searchPromotionQuery.getDiscountProductPromotions({
        ...props,
        promotionState: state,
      });

    return discountProductPromotions;
  }
}

export default new GetPromotionAction();
