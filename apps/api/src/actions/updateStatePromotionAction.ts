import { HttpException } from '@/errors/httpException';
import promotionQuery from '@/queries/promotionQuery';
import { HttpStatus } from '@/types/error';
import {
  $Enums,
  type FreeProductPerStore,
  type ProductDiscountPerStore,
  type Promotion,
} from '@prisma/client';
import createPromotionAction from './createPromotionAction';
import promotionUpdateQuery from '@/queries/promotionUpdateQuery';
import storeQuery from '@/queries/storeQuery';

class UpdateStatePromotionAction {
  private checkAlreadyArchived(state: $Enums.State): void {
    if (state === $Enums.State.ARCHIVED) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Arsip gagal karena promosi ini telah diarsip sebelumnya',
      );
    }
  }

  private checkAlreadyPublished(state: $Enums.State): void {
    if (state === $Enums.State.PUBLISHED) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Publish gagal karena promosi ini telah dipublish sebelumnya',
      );
    }
  }

  private checkStatusUpdate(
    currentState: $Enums.State,
    incomingState: string,
  ): void {
    if (incomingState === $Enums.State.ARCHIVED) {
      this.checkAlreadyArchived(currentState);
    } else if (incomingState === $Enums.State.PUBLISHED) {
      this.checkAlreadyPublished(currentState);
    } else if (incomingState === $Enums.State.DRAFT) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Promosi tidak bisa diubah menjadi draft',
      );
    } else {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        `Gagal memperbarui. Status ${incomingState} tidak valid`,
      );
    }
  }

  public async updateNonProductPromotionStateAction(
    id: number,
    role: string,
    promotionId: number,
    state: $Enums.State,
  ): Promise<Promotion> {
    const currentPromotion =
      await promotionQuery.getNonProductPromotionByPromotionId(promotionId);
    currentPromotion.storeId !== null &&
      (await storeQuery.isStoreExist(currentPromotion.storeId));

    this.checkStatusUpdate(currentPromotion.promotionState, state);

    if (role === 'store admin') {
      if (currentPromotion.storeId !== null) {
        await createPromotionAction.checkAdminAccess(
          role,
          id,
          currentPromotion.storeId,
        );
      }

      if (currentPromotion.scope === $Enums.PromotionScope.GENERAL) {
        throw new HttpException(
          HttpStatus.UNAUTHORIZED,
          'Admin toko tidak memiliki akses untuk mengarsip promosi',
        );
      }
    }

    if (state === $Enums.State.PUBLISHED) {
      await createPromotionAction.checkDuplicatePromotionSource(
        currentPromotion.source,
        state,
        currentPromotion.afterMinPurchase === null
          ? undefined
          : currentPromotion.afterMinPurchase,
        currentPromotion.startedAt,
        currentPromotion.finishedAt,
      );
    }

    const updatedPromotion =
      await promotionUpdateQuery.updateNonProductPromotionState(
        promotionId,
        state,
      );

    return updatedPromotion;
  }

  public async updateFreeProductPromotionStateAction(
    id: number,
    role: string,
    promotionId: number,
    state: $Enums.State,
  ): Promise<FreeProductPerStore> {
    const currentPromotion =
      await promotionQuery.getFreeProductPromotionByPromotionId(promotionId);

    this.checkStatusUpdate(currentPromotion.freeProductState, state);

    if (role === 'store admin') {
      await createPromotionAction.checkAdminAccess(
        role,
        id,
        currentPromotion.inventory.storeId,
      );
    }

    if (state === $Enums.State.PUBLISHED) {
      await createPromotionAction.checkOverlapDate(
        currentPromotion.inventoryId,
        currentPromotion.startedAt,
        currentPromotion.finishedAt,
        'free',
      );
    }

    const updatedPromotion =
      await promotionUpdateQuery.updateFreeProductPromotionState(
        promotionId,
        state,
      );

    return updatedPromotion;
  }

  public async updateDiscountProductPromotionStateAction(
    id: number,
    role: string,
    promotionId: number,
    state: $Enums.State,
  ): Promise<ProductDiscountPerStore> {
    const currentPromotion =
      await promotionQuery.getDiscountProductPromotionByPromotionId(
        promotionId,
      );

    this.checkStatusUpdate(currentPromotion.productDiscountState, state);

    if (role === 'store admin') {
      await createPromotionAction.checkAdminAccess(
        role,
        id,
        currentPromotion.inventory.storeId,
      );
    }

    if (state === $Enums.State.PUBLISHED) {
      await createPromotionAction.checkOverlapDate(
        currentPromotion.inventoryId,
        currentPromotion.startedAt,
        currentPromotion.finishedAt,
        'discount',
      );
    }

    const updatedPromotion =
      await promotionUpdateQuery.updateDiscountProductPromotionState(
        promotionId,
        state,
      );

    return updatedPromotion;
  }
}

export default new UpdateStatePromotionAction();
