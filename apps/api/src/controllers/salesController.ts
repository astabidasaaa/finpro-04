import { Request, Response, NextFunction } from 'express';
import { User } from '@/types/express';
import salesAction from '@/actions/salesAction';

export class SalesController {
  public async getAllStoreOverallPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { month, year, storeId } = req.query;

      const allStoreOverall =
        await salesAction.getAllStoreOverallPerMonthAction({
          month: Number(month),
          year: Number(year),
          storeId: Number(storeId),
        });

      res.status(200).json({
        message: 'Data keseluruhan seluruh toko berhasil ditampilkan',
        data: allStoreOverall,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getStoreOverallPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, role } = req.user as User;
      const storeId = parseInt(req.params.storeId);
      const { month, year } = req.query;

      const perStoreOverall = await salesAction.getStoreOverallPerMonthAction({
        id,
        role,
        month: Number(month),
        year: Number(year),
        storeId: storeId,
      });

      res.status(200).json({
        message: 'Data keseluruhan toko berhasil ditampilkan',
        data: perStoreOverall,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllStoreProductSalesPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        month,
        year,
        storeId,
        page = 1,
        pageSize = 20,
        keyword = '',
        orderBy = 'nameAsc',
      } = req.query;

      const allStoreProducts =
        await salesAction.getAllStoreProductSalesPerMonthAction({
          month: Number(month),
          year: Number(year),
          storeId: Number(storeId),
          page: Number(page),
          pageSize: Number(pageSize),
          keyword: String(keyword),
          orderBy: String(orderBy),
        });

      res.status(200).json({
        message: 'Data penjualan produk seluruh toko berhasil ditampilkan',
        data: allStoreProducts,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getStoreProductSalesPerMonth(
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
        page = 1,
        pageSize = 20,
        keyword = '',
        orderBy = 'nameAsc',
      } = req.query;

      const perStoreProducts =
        await salesAction.getStoreProductSalesPerMonthAction({
          id,
          month: Number(month),
          year: Number(year),
          storeId,
          role,
          page: Number(page),
          pageSize: Number(pageSize),
          keyword: String(keyword),
          orderBy: String(orderBy),
        });

      res.status(200).json({
        message: 'Data penjualan produk toko berhasil ditampilkan',
        data: perStoreProducts,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllStoreCategorySalesPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { month, year, storeId, orderBy = 'nameAsc' } = req.query;

      const allStoreCategory =
        await salesAction.getAllStoreCategorySalesPerMonthAction({
          month: Number(month),
          year: Number(year),
          orderBy: String(orderBy),
          storeId: Number(storeId),
        });

      res.status(200).json({
        message: 'Data penjualan kategori seluruh toko berhasil ditampilkan',
        data: allStoreCategory,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getStoreCategorySalesPerMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id, role } = req.user as User;
    const storeId = parseInt(req.params.storeId);
    const { month, year, orderBy = 'nameAsc' } = req.query;

    const perStoreCategory =
      await salesAction.getStoreCategorySalesPerMonthAction({
        id,
        role,
        month: Number(month),
        year: Number(year),
        orderBy: String(orderBy),
        storeId,
      });

    res.status(200).json({
      message: 'Data penjualan kategori toko berhasil ditampilkan',
      data: perStoreCategory,
    });
    try {
    } catch (err) {
      next(err);
    }
  }
}
