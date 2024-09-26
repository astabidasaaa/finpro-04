import { HttpException } from '@/errors/httpException';
import promotionQuery from '@/queries/promotionQuery';
import { HttpStatus } from '@/types/error';
import {
  $Enums,
  FreeProductPerStore,
  ProductDiscountPerStore,
  Promotion,
} from '@prisma/client';
import createPromotionAction from './createPromotionAction';
import promotionUpdateQuery from '@/queries/promotionUpdateQuery';
import {
  CreateDiscountProductPromotionInput,
  CreateFreeProductPromotionInput,
  CreatePromotionInput,
} from '@/types/promotionTypes';
import prisma from '@/prisma';
import storeQuery from '@/queries/storeQuery';

class UpdatePromotionAction {
  private forbidChangePromotionSourceAndScope(
    scope: $Enums.PromotionScope,
    source: $Enums.PromotionSource,
    currentScope: $Enums.PromotionScope,
    currentSource: $Enums.PromotionSource,
  ) {
    if (scope !== currentScope || source !== currentSource) {
      throw new HttpException(
        HttpStatus.FORBIDDEN,
        'Tidak boleh merubah sumber promosi',
      );
    }
  }

  private forbidChangeArchivedPromotion(promotionState: $Enums.State) {
    if (promotionState === $Enums.State.ARCHIVED) {
      throw new HttpException(
        HttpStatus.FORBIDDEN,
        'Promosi dengan status arsip tidak dapat diperbarui',
      );
    }
  }

  public async updateGeneralPromotionAction(
    props: CreatePromotionInput & { id: number },
  ): Promise<Promotion> {
    const currentPromotion =
      await promotionQuery.getNonProductPromotionByPromotionId(props.id);

    this.forbidChangeArchivedPromotion(currentPromotion.promotionState);
    this.forbidChangePromotionSourceAndScope(
      props.scope,
      props.source,
      currentPromotion.scope,
      currentPromotion.source,
    );

    await createPromotionAction.checkDuplicatePromotionSource(
      props.source,
      props.promotionState,
      props.afterMinPurchase,
      props.startedAt,
      props.finishedAt,
    );

    const promotion = await promotionUpdateQuery.updatePromotion(props);

    return promotion;
  }

  public async updateStorePromotionAction(
    props: CreatePromotionInput & { id: number; role: string },
  ): Promise<Promotion> {
    const { creatorId, storeId, role, ...otherProps } = props;
    const currentPromotion =
      await promotionQuery.getNonProductPromotionByPromotionId(props.id);
    currentPromotion.storeId !== null &&
      (await storeQuery.isStoreExist(currentPromotion.storeId));

    this.forbidChangeArchivedPromotion(currentPromotion.promotionState);
    this.forbidChangePromotionSourceAndScope(
      props.scope,
      props.source,
      currentPromotion.scope,
      currentPromotion.source,
    );

    if (storeId === undefined) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Toko belum dipilih');
    }

    await createPromotionAction.checkAdminAccess(role, creatorId, storeId);
    const promotion = await promotionUpdateQuery.updatePromotion({
      ...otherProps,
      creatorId,
      storeId,
    });

    return promotion;
  }

  public async editFreeProductPromotionAction(
    props: CreateFreeProductPromotionInput & {
      id: number;
      role: string;
      storeId: number;
    },
  ): Promise<FreeProductPerStore> {
    const { role, storeId, ...otherProps } = props;

    const currentPromotion = await prisma.freeProductPerStore.findUnique({
      where: {
        id: props.id,
      },
    });
    if (currentPromotion === null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Promosi dengan ID ini tidak ditemukan',
      );
    }

    this.forbidChangeArchivedPromotion(currentPromotion.freeProductState);
    await createPromotionAction.checkAdminAccess(
      role,
      props.creatorId,
      storeId,
    );

    if (props.freeProductState === $Enums.State.PUBLISHED) {
      await createPromotionAction.checkOverlapDate(
        props.inventoryId,
        props.startedAt,
        props.finishedAt,
        'free',
      );
    }

    const promotion = await promotionUpdateQuery.editFreeProductPromotion({
      ...otherProps,
    });
    return promotion;
  }

  public async editDiscountProductPromotionAction(
    props: CreateDiscountProductPromotionInput & {
      id: number;
      role: string;
      storeId: number;
    },
  ): Promise<ProductDiscountPerStore> {
    const { role, storeId, ...otherProps } = props;

    const currentPromotion = await prisma.productDiscountPerStore.findUnique({
      where: {
        id: props.id,
      },
    });
    if (currentPromotion === null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Promosi dengan ID ini tidak ditemukan',
      );
    }

    this.forbidChangeArchivedPromotion(currentPromotion.productDiscountState);

    await createPromotionAction.checkAdminAccess(
      role,
      props.creatorId,
      storeId,
    );

    if (props.productDiscountState === $Enums.State.PUBLISHED) {
      await createPromotionAction.checkOverlapDate(
        props.inventoryId,
        props.startedAt,
        props.finishedAt,
        'discount',
      );
    }

    const promotion = await promotionUpdateQuery.editDiscountProductPromotion({
      ...otherProps,
    });
    return promotion;
  }
}

export default new UpdatePromotionAction();
