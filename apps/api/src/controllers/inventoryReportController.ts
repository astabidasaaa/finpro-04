import { Request, Response, NextFunction } from 'express';
import { User } from '@/types/express';
import inventoryAction from '@/actions/inventoryAction';
import inventoryQuery from '@/queries/inventoryQuery';

export class InventoryReportController {
  public async getAllStoreProductStockPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        month,
        year,
        storeId,
        orderBy = 'nameAsc',
        page = 1,
        pageSize = 20,
        keyword = '',
      } = req.query;

      const allProductStockOverall =
        await inventoryAction.getAllStoreProductStockPerMonthAction({
          month: Number(month),
          year: Number(year),
          storeId: Number(storeId),
          page: Number(page),
          pageSize: Number(pageSize),
          keyword: String(keyword),
          orderBy: String(orderBy),
        });

      res.status(200).json({
        message: 'Data stok produk seluruh toko berhasil ditampilkan',
        data: allProductStockOverall,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getStoreProductStockPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const storeId = parseInt(req.params.storeId);
      const {
        month,
        year,
        orderBy = 'nameAsc',
        page = 1,
        pageSize = 20,
        keyword = '',
      } = req.query;

      const allProductStockOverall =
        await inventoryAction.getStoreProductStockPerMonthAction({
          id,
          role,
          month: Number(month),
          year: Number(year),
          storeId,
          page: Number(page),
          pageSize: Number(pageSize),
          keyword: String(keyword),
          orderBy: String(orderBy),
        });

      res.status(200).json({
        message: 'Data stok produk toko berhasil ditampilkan',
        data: allProductStockOverall,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getProductInventoryChangePerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const {
        month,
        year,
        orderBy = 'timeDesc',
        productId,
        storeId,
      } = req.query;

      const inventory = await inventoryQuery.getInventoryBuyProductIdAndStoreId(
        Number(productId),
        Number(storeId),
      );

      const allProductStockOverall =
        await inventoryAction.getProductInventoryChangePerMonthAction({
          id,
          role,
          month: Number(month),
          year: Number(year),
          inventoryId: inventory.id,
          orderBy: String(orderBy),
        });

      res.status(200).json({
        message: 'Data perubahan stok produk berhasil ditampilkan',
        data: allProductStockOverall,
      });
    } catch (err) {
      next(err);
    }
  }
}
