import userAction from '@/actions/userAction';
import { User } from '@/types/express';
import { NextFunction, Request, Response } from 'express';

export class UserController {
  public async getSelfProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const result = await userAction.getSelfProfile(id);

      res.status(200).json({
        message: `Profil pengguna`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateSelfProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { file } = req;
      const { email, name, phone, dob } = req.body;

      await userAction.updateSelfProfile({
        id,
        email,
        avatar: file?.filename,
        name,
        phone,
        dob,
      });

      res.status(200).json({
        message: `Update profil berhasil`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserAddresses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const addresses = await userAction.getAllAddresses(id);

      res.status(200).json({
        message: `Mengambil alamat user berhasil`,
        data: { addresses },
      });
    } catch (error) {
      next(error);
    }
  }

  public async postUserAddresses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { name, address, zipCode, latitude, longitude } = req.body;

      await userAction.createAddress({
        id,
        name,
        address,
        zipCode,
        latitude,
        longitude,
      });

      res.status(201).json({
        message: `Membuat alamat user berhasil`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateUserAddresses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { addressId } = req.params;

      const { name, address, zipCode, latitude, longitude } = req.body;

      await userAction.updateAddress({
        id,
        addressId: parseInt(addressId),
        name,
        address,
        zipCode,
        latitude,
        longitude,
      });

      res.status(200).json({
        message: `Mengupdate alamat user berhasil`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteUserAddresses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { addressId } = req.params;

      await userAction.deleteAddress({
        id,
        addressId: parseInt(addressId),
      });

      res.status(200).json({
        message: `Menghapus alamat user berhasil`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async changeUserMainAddress(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const { addressId } = req.params;

      await userAction.changeMainAddress({
        id,
        addressId: parseInt(addressId),
      });

      res.status(200).json({
        message: `Mengubah alamat utama berhasil`,
      });
    } catch (error) {
      next(error);
    }
  }
}
