import storeAction from '@/actions/storeAction';
import verifyEmailAction from '@/actions/verifyEmailAction';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';

export class StoreController {
  public async getStoresWithQuery(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { keyword, state, sortBy, sortOrder, page, pageSize } = req.query;

      const stores = await storeAction.getStoresWithQuery({
        id,
        keyword: keyword?.toString(),
        state,
        sortBy: sortBy?.toString(),
        sortOrder: sortOrder?.toString(),
        page: page?.toString(),
        pageSize: pageSize?.toString(),
      });

      res.status(200).json({
        message: 'Berhasil mencari semua toko berdasarkan query',
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getSingleStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { storeId } = req.params;

      const store = await storeAction.getStoreById({
        userId: id,
        storeId: parseInt(storeId),
      });

      res.status(200).json({
        message: 'Berhasil mencari toko',
        data: { store },
      });
    } catch (error) {
      next(error);
    }
  }

  public async createStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { storeName, storeState, storeAddress, storeAdmins } = req.body;

      await storeAction.createStore({
        userId: id,
        storeName,
        storeState,
        storeAddress,
        storeAdmins,
      });

      res.status(201).json({
        message: 'Berhasil membuat toko',
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateSingleStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { storeId } = req.params;
      const { storeName, storeState, storeAddress, storeAdmins } = req.body;

      await storeAction.updateStore({
        userId: id,
        storeId: parseInt(storeId),
        storeName,
        storeState,
        storeAddress,
        storeAdmins,
      });

      res.status(200).json({
        message: 'Berhasil mengubah toko',
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { storeId } = req.params;

      await storeAction.deleteStore({
        userId: id,
        storeId: parseInt(storeId),
      });

      res.status(200).json({
        message: 'Berhasil menghapus toko',
      });
    } catch (error) {
      next(error);
    }
  }
}
