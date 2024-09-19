import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';
import inventoryAction from '@/actions/inventoryAction';
import { $Enums } from '@prisma/client';

export class InventoryController {
  public async getAllInventory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { page = 1, pageSize = 20, keyword = '', storeId } = req.query;

      const inventories = await inventoryAction.getAllInventoryAction({
        id,
        keyword: String(keyword),
        page: Number(page),
        pageSize: Number(pageSize),
        storeId: Number(storeId),
      });

      res.status(200).json({
        message: 'Seluruh inventaris berhasil ditampilkan',
        data: inventories,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getStoreInventory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const storeId = parseInt(req.params.storeId);
      const { page = 1, pageSize = 20, keyword = '' } = req.query;

      const allBrand = await inventoryAction.getStoreInventoryAction({
        id,
        role,
        keyword: String(keyword),
        page: Number(page),
        pageSize: Number(pageSize),
        storeId,
      });

      res.status(200).json({
        message: 'Inventaris dari toko berhasil ditampilkan',
        data: allBrand,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllInventoryUpdates(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const {
        page = 1,
        pageSize = 20,
        keyword = '',
        storeId,
        sortCol = 'timeDesc',
        filterType = '',
      } = req.query;

      const inventoryUpdates =
        await inventoryAction.getAllInventoryUpdatesAction({
          id,
          keyword: String(keyword),
          page: Number(page),
          pageSize: Number(pageSize),
          storeId: Number(storeId),
          sortCol: String(sortCol),
          filterType: String(filterType),
        });

      res.status(200).json({
        message: 'Seluruh riwayat inventaris berhasil ditampilkan',
        data: inventoryUpdates,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getStoreInventoryUpdates(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const storeId = parseInt(req.params.storeId);
      const {
        page = 1,
        pageSize = 20,
        keyword = '',
        sortCol = 'timeDesc',
        filterType = '',
      } = req.query;

      const inventoryUpdates =
        await inventoryAction.getStoreInventoryUpdatesAction({
          id,
          role,
          keyword: String(keyword),
          page: Number(page),
          pageSize: Number(pageSize),
          filterType: String(filterType),
          sortCol: String(sortCol),
          storeId,
        });

      res.status(200).json({
        message: 'Riwayat inventaris dari toko berhasil ditampilkan',
        data: inventoryUpdates,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getProductInventoryUpdates(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const inventoryId = parseInt(req.params.inventoryId);

      const inventoryUpdates =
        await inventoryAction.getProductInventoryUpdatesAction(
          id,
          inventoryId,
          role,
        );

      res.status(200).json({
        message: 'Inventaris dari toko berhasil ditampilkan',
        data: inventoryUpdates,
      });
    } catch (err) {
      next(err);
    }
  }

  public async addInventoryChange(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;

      const {
        productId,
        storeId,
        updateType,
        updateDetail,
        description,
        stockChange,
      } = req.body;

      const inventoryUpdate = await inventoryAction.addInventoryAction({
        id,
        role,
        productId: parseInt(productId),
        storeId: parseInt(storeId),
        updateType,
        updateDetail,
        description,
        stockChange: parseInt(stockChange),
      });

      res.status(200).json({
        message: 'Inventori berhasil ditambah',
        data: inventoryUpdate,
      });
    } catch (err) {
      next(err);
    }
  }
}
