import { HttpException } from '@/errors/httpException';
import promotionQuery from '@/queries/promotionQuery';
import { HttpStatus } from '@/types/error';
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
    promotionState: string | undefined,
  ): Promise<Promotion[]> {
    const state = this.checkPromotionState(promotionState);

    const generalPromotions = await promotionQuery.getGeneralPromotions(state);

    return generalPromotions;
  }

  public async getStorePromotionsAction(
    promotionState: string | undefined,
    storeId: number,
  ): Promise<Promotion[]> {
    const state = this.checkPromotionState(promotionState);

    const storePromotions = await promotionQuery.getStorePromotions(
      state,
      storeId,
    );

    return storePromotions;
  }

  public async getFreeProductPromotionsAction(
    promotionState: string | undefined,
    storeId: number,
  ): Promise<FreeProductPerStore[]> {
    const state = this.checkPromotionState(promotionState);

    const freeProductPromotions = await promotionQuery.getFreeProductPromotions(
      state,
      storeId,
    );

    return freeProductPromotions;
  }

  public async getDiscountProductPromotionsAction(
    promotionState: string | undefined,
    storeId: number,
  ): Promise<ProductDiscountPerStore[]> {
    const state = this.checkPromotionState(promotionState);

    const discountProductPromotions =
      await promotionQuery.getDiscountProductPromotions(state, storeId);

    return discountProductPromotions;
  }
}

export default new GetPromotionAction();
