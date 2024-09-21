import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import inventoryQuery from '@/queries/inventoryQuery';
import {
  CreateInventoryChangeInput,
  InventoryProps,
  InventoryUpdateProps,
  ProductInventoryChange,
  ProductStockChange,
  SearchAllInventoryInput,
  SearchAllInventoryUpdatesInput,
  SearchStoreInventoryInput,
  SearchStoreInventoryUpdatesInput,
  UpdateDetailDesc,
  UpdateTypeDesc,
} from '@/types/inventoryTypes';
import storeQuery from '@/queries/storeQuery';
import productQuery from '@/queries/productQuery';
import { $Enums, InventoryUpdate } from '@prisma/client';
import inventoryUpdatesQuery from '@/queries/inventoryUpdatesQuery';
import createPromotionAction from './createPromotionAction';
import {
  SearchAllStoreProductPerMonth,
  SearchPerStoreProductPerMonth,
} from '@/types/reportTypes';
import inventoryReportQuery from '@/queries/inventoryReportQuery';

class InventoryAction {
  public async getAllInventoryAction(props: SearchAllInventoryInput): Promise<{
    inventories: InventoryProps[];
    totalCount: number;
  }> {
    const allInventory = await inventoryQuery.getAllInventories(props);

    return allInventory;
  }

  public async getStoreInventoryAction(
    props: SearchStoreInventoryInput,
  ): Promise<{
    inventories: InventoryProps[];
    totalCount: number;
  }> {
    const { id, storeId, role } = props;
    await createPromotionAction.checkAdminAccess(role, id, storeId);

    const storeInventories =
      await inventoryQuery.getStoreInventoriesByStoreId(props);

    return storeInventories;
  }

  public async getAllInventoryUpdatesAction(
    props: SearchAllInventoryUpdatesInput,
  ): Promise<{
    inventoryUpdates: InventoryUpdateProps[];
    totalCount: number;
  }> {
    const allInventory =
      await inventoryUpdatesQuery.getAllInventoryUpdates(props);

    return allInventory;
  }

  public async getStoreInventoryUpdatesAction(
    props: SearchStoreInventoryUpdatesInput,
  ): Promise<{
    inventoryUpdates: InventoryUpdateProps[];
    totalCount: number;
  }> {
    const { id, storeId, role } = props;
    await createPromotionAction.checkAdminAccess(role, id, storeId);

    const storeInventories =
      await inventoryUpdatesQuery.getStoreInventoryUpdates(props);

    return storeInventories;
  }

  public async getProductInventoryUpdatesAction(
    id: number,
    inventoryId: number,
    role: string,
  ): Promise<InventoryUpdateProps[]> {
    const inventory =
      await inventoryQuery.getInventoryByInventoryId(inventoryId);
    if (inventory === null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Inventaris tidak ditemukan',
      );
    }
    await createPromotionAction.checkAdminAccess(role, id, inventory.storeId);

    const storeInventories =
      await inventoryUpdatesQuery.getProductInventoryUpdatesByInventoryId(
        inventoryId,
      );

    return storeInventories;
  }

  public async addInventoryAction(
    props: CreateInventoryChangeInput,
  ): Promise<InventoryUpdate> {
    const { id, role, storeId, productId, updateType, updateDetail } = props;

    await createPromotionAction.checkAdminAccess(role, id, storeId);

    const product = await productQuery.getProductById(productId);
    if (product === null) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Produk tidak ditemukan');
    }

    if (product.productState !== $Enums.State.PUBLISHED) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Stok produk tidak dapat diperbarui karena produk tidak dipublish',
      );
    }

    const updateTypeMap = new Map<string, string>(
      Object.entries(UpdateTypeDesc),
    );
    const updateDetailMap = new Map<string, string>(
      Object.entries(UpdateDetailDesc),
    );

    if (
      updateType === $Enums.InventoryUpdateType.ADD &&
      (updateDetail === $Enums.InventoryUpdateDetail.STOCK_OUT ||
        updateDetail === $Enums.InventoryUpdateDetail.DAMAGED ||
        updateDetail === $Enums.InventoryUpdateDetail.EXPIRATION)
    ) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        `Tipe perubahan ${updateTypeMap.get(updateType)?.toUpperCase()} dan detail perubahan ${updateDetailMap.get(updateDetail)?.toUpperCase()} tidak selaras`,
      );
    }

    if (
      updateType === $Enums.InventoryUpdateType.REMOVE &&
      (updateDetail === $Enums.InventoryUpdateDetail.STOCK_IN ||
        updateDetail === $Enums.InventoryUpdateDetail.CANCELLED_ORDER)
    ) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        `Tipe perubahan ${updateTypeMap.get(updateType)?.toUpperCase()} dan detail perubahan ${updateDetailMap.get(updateDetail)?.toUpperCase()} tidak selaras`,
      );
    }

    const inventoryUpdates = await inventoryQuery.addInventoryChange(props);

    return inventoryUpdates;
  }

  public async getAllStoreProductStockPerMonthAction(
    props: SearchAllStoreProductPerMonth,
  ): Promise<{
    products: ProductStockChange[];
    totalCount: number;
  }> {
    const allProductStock =
      await inventoryReportQuery.getStoresProductStockPerMonth(props);

    return allProductStock;
  }

  public async getStoreProductStockPerMonthAction(
    props: SearchPerStoreProductPerMonth,
  ): Promise<{
    products: ProductStockChange[];
    totalCount: number;
  }> {
    const { id, role, storeId, ...otherProps } = props;
    await createPromotionAction.checkAdminAccess(role, id, storeId);

    const storeProductStock =
      await inventoryReportQuery.getStoresProductStockPerMonth({
        ...otherProps,
        storeId,
      });
    return storeProductStock;
  }

  public async getProductInventoryChangePerMonthAction(
    props: ProductInventoryChange,
  ) {}
}

export default new InventoryAction();
