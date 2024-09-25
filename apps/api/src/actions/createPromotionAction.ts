import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import productQuery from '@/queries/productQuery';
import promotionQuery from '@/queries/promotionQuery';
import storeQuery from '@/queries/storeQuery';
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

class CreatePromotionAction {
  private forbidCreateArchivedPromotion(promotionState: $Enums.State): void {
    if (promotionState === $Enums.State.ARCHIVED) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak dapat membuat promosi dengan status arsip',
      );
    }
  }

  public async checkOverlapDate(
    inventoryId: number,
    startedAt: Date,
    finishedAt: Date,
    promotionType: 'free' | 'discount',
  ): Promise<void> {
    const promotions: any[] = [];
    if (promotionType === 'free') {
      const publishedFreeProductPromotions: FreeProductPerStore[] =
        await promotionQuery.getFreeProductPromotionsByInventoryIdAndState(
          $Enums.State.PUBLISHED,
          inventoryId,
        );
      promotions.push(...publishedFreeProductPromotions);
    } else {
      const publishedDiscountProductPromotions: ProductDiscountPerStore[] =
        await promotionQuery.getDiscountProductPromotionsByInventoryIdAndState(
          $Enums.State.PUBLISHED,
          inventoryId,
        );
      promotions.push(...publishedDiscountProductPromotions);
    }

    for (const promotion of promotions) {
      if (
        startedAt <= promotion.finishedAt &&
        finishedAt >= promotion.startedAt
      ) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Tidak bisa membuat promosi dengan waktu yang overlap dengan promosi yang sudah terbit',
        );
      }
    }
  }

  public async checkAdminAccess(
    role: string,
    creatorId: number,
    storeId: number,
  ): Promise<void> {
    const adminStore = await storeQuery.getAllAdminByStoreId(storeId);

    if (role === 'store admin' && !adminStore.includes(creatorId)) {
      throw new HttpException(
        HttpStatus.UNAUTHORIZED,
        'Admin tidak memiliki akses ke toko ini',
      );
    }
  }

  public async checkDuplicatePromotionSource(
    source: $Enums.PromotionSource,
    promotionState: $Enums.State,
    afterMinPurchase: number | undefined,
    startedAt: Date,
    finishedAt: Date,
  ) {
    if (
      (source === $Enums.PromotionSource.REFEREE_BONUS ||
        source === $Enums.PromotionSource.REFERRAL_BONUS ||
        source === $Enums.PromotionSource.AFTER_MIN_TRANSACTION) &&
      promotionState === $Enums.State.PUBLISHED
    ) {
      const currentPromotion = await prisma.promotion.findMany({
        where: {
          source: source,
          promotionState: promotionState,
          OR: [
            {
              startedAt: {
                lte: finishedAt,
              },
              finishedAt: {
                gte: startedAt,
              },
            },
          ],
        },
      });
      console.log(currentPromotion);
      if (currentPromotion.length > 0) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Promosi dengan tipe ini tidak dapat diterbitkan karena sudah terdapat promosi yang aktif dengan tipe dan waktu yang sama',
        );
      }
    }

    if (
      source === $Enums.PromotionSource.AFTER_MIN_PURCHASE &&
      promotionState === $Enums.State.PUBLISHED
    ) {
      const currentPromotions = await prisma.promotion.findMany({
        where: {
          source: source,
          promotionState: promotionState,
        },
        select: {
          afterMinPurchase: true,
        },
      });

      const sameAfterMinPurchase = currentPromotions.filter(
        (value) => value.afterMinPurchase === afterMinPurchase,
      );

      if (sameAfterMinPurchase.length > 0) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Promosi dengan tipe ini tidak dapat diterbitkan karena sudah terdapat promosi yang aktif dengan nilai minimal transaksi yang sama',
        );
      }
    }
  }

  public async createGeneralPromotionAction(
    props: CreatePromotionInput,
  ): Promise<Promotion> {
    this.forbidCreateArchivedPromotion(props.promotionState);

    await this.checkDuplicatePromotionSource(
      props.source,
      props.promotionState,
      props.afterMinPurchase,
      props.startedAt,
      props.finishedAt,
    );

    if (
      props.source === $Enums.PromotionSource.PER_BRANCH ||
      props.storeId !== undefined
    ) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak dapat membuat promosi toko. API ini hanya untuk pembuatan promosi general',
      );
    }

    const promotion = await promotionQuery.createPromotion(props);

    return promotion;
  }

  public async createStorePromotionAction(
    props: CreatePromotionInput & { role: string },
  ): Promise<Promotion> {
    const { creatorId, storeId, role, ...otherProps } = props;
    storeId !== undefined && (await storeQuery.isStoreExist(storeId));
    this.forbidCreateArchivedPromotion(props.promotionState);
    if (storeId === undefined) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Toko belum dipilih');
    }

    const store = await storeQuery.findSingleStore(storeId);
    if (store === null) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Toko tidak ditemukan');
    }

    if (store.storeState !== $Enums.State.PUBLISHED) {
      throw new HttpException(
        HttpStatus.FORBIDDEN,
        'Tidak dapat menambahkan promosi pada toko yang tidak publish',
      );
    }

    await this.checkAdminAccess(role, creatorId, storeId);

    const promotion = await promotionQuery.createPromotion({
      ...otherProps,
      creatorId,
      storeId,
    });
    return promotion;
  }

  public async createFreeProductPromotionAction(
    props: CreateFreeProductPromotionInput & { role: string; storeId: number },
  ): Promise<FreeProductPerStore> {
    const { role, storeId, ...otherProps } = props;
    await storeQuery.isStoreExist(storeId);
    this.forbidCreateArchivedPromotion(props.freeProductState);
    await this.checkAdminAccess(role, props.creatorId, storeId);

    if (props.freeProductState === $Enums.State.PUBLISHED) {
      await this.checkOverlapDate(
        props.inventoryId,
        props.startedAt,
        props.finishedAt,
        'free',
      );
    }

    const promotion = await promotionQuery.createFreeProductPromotion({
      ...otherProps,
    });
    return promotion;
  }

  public async createDiscountProductPromotionAction(
    props: CreateDiscountProductPromotionInput & {
      role: string;
      storeId: number;
    },
  ): Promise<ProductDiscountPerStore> {
    const { role, storeId, ...otherProps } = props;
    await storeQuery.isStoreExist(storeId);
    this.forbidCreateArchivedPromotion(props.productDiscountState);
    await this.checkAdminAccess(role, props.creatorId, storeId);

    if (props.productDiscountState === $Enums.State.PUBLISHED) {
      await this.checkOverlapDate(
        props.inventoryId,
        props.startedAt,
        props.finishedAt,
        'discount',
      );
    }

    const promotion = await promotionQuery.createDiscountProductPromotion({
      ...otherProps,
    });
    return promotion;
  }
}

export default new CreatePromotionAction();
