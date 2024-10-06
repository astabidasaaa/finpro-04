import type { Request, Response, NextFunction } from 'express';
import type { User } from '@/types/express';
import salesAction from '@/actions/salesAction';

export default class TopSalesController {
  public async getAllStoreTopProductSalesPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { month, year, storeId, top = 5 } = req.query;

      const topAllStoreProducts =
        await salesAction.getAllStoreTopProductSalesPerMonthAction({
          month: Number(month),
          year: Number(year),
          storeId: Number(storeId),
          top: Number(top),
        });

      res.status(200).json({
        message: 'Data produk terbaik seluruh toko berhasil ditampilkan',
        data: topAllStoreProducts,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getStoreTopProductSalesPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const storeId = parseInt(req.params.storeId);
      const { month, year, top = 5 } = req.query;

      const topAllStoreProducts =
        await salesAction.getStoreTopProductSalesPerMonthAction({
          id,
          role,
          month: Number(month),
          year: Number(year),
          storeId: storeId,
          top: Number(top),
        });

      res.status(200).json({
        message: 'Data produk terbaik toko berhasil ditampilkan',
        data: topAllStoreProducts,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllStoreTopCategorySalesPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { month, year, storeId, top = 5 } = req.query;

      const topAllStoreProducts =
        await salesAction.getAllStoreTopCategorySalesPerMonthAction({
          month: Number(month),
          year: Number(year),
          storeId: Number(storeId),
          top: Number(top),
        });

      res.status(200).json({
        message: 'Data kategori terbaik seluruh toko berhasil ditampilkan',
        data: topAllStoreProducts,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getStoreTopCategorySalesPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const storeId = parseInt(req.params.storeId);
      const { month, year, top = 5 } = req.query;

      const topAllStoreProducts =
        await salesAction.getStoreTopCategorySalesPerMonthAction({
          id,
          role,
          month: Number(month),
          year: Number(year),
          storeId: storeId,
          top: Number(top),
        });

      res.status(200).json({
        message: 'Data kategori terbaik toko berhasil ditampilkan',
        data: topAllStoreProducts,
      });
    } catch (err) {
      next(err);
    }
  }
}
