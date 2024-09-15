import displayStoreAction from '@/actions/displayStoreAction';
import passwordAction from '@/actions/passwordAction';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';

export class DisplayStoreController {
  public async getAllStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stores = await displayStoreAction.getAllStore();

      res.status(200).json({
        message: 'Berhasil menampilkan seluruh toko',
        data: stores,
      });
    } catch (err) {}
  }

  public async getSingleStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { storeId } = req.params;

      const store = await displayStoreAction.getStorebyStoreId(
        parseInt(storeId),
      );

      res.status(200).json({
        message: 'Berhasil menampilkan toko',
        data: store,
      });
    } catch (err) {}
  }

  public async getAdminStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { adminId } = req.params;

      const store = await displayStoreAction.getAdminStoreAction(
        parseInt(adminId),
      );

      res.status(200).json({
        message: 'Berhasil menampilkan toko dari admin',
        data: store,
      });
    } catch (err) {}
  }

  public async nearestStoreId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { latitude, longitude } = req.body;

      const storeId = await displayStoreAction.getNearestStoreId(
        latitude,
        longitude,
      );

      res.status(200).json({
        message: 'Berhasil menemukan toko terdekat',
        data: { storeId },
      });
    } catch (error) {
      next(error);
    }
  }

  public async nearestStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { storeId } = req.params;

      const categories =
        await displayStoreAction.getNearestStoreProductBasedOnCategory(
          Number(storeId),
        );

      res.status(200).json({
        message:
          'Berhasil mengambil data barang dari toko terdekat berdasarkan kategori',
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }
}
