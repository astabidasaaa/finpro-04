import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';
import adminAction from '@/actions/adminAction';

export class AdminController {
  public async createAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password, role } = req.body;
      let { storeId } = req.body;

      if (storeId !== undefined) {
        storeId = parseInt(storeId);
      }

      const admin = await adminAction.createAdminAction({
        name,
        email,
        password,
        role,
        storeId,
      });

      res.status(200).json({
        message: 'Admin berhasil dibuat',
        data: admin,
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const adminId = parseInt(req.params.adminId);
      const { name, role, email } = req.body;
      let { storeId } = req.body;

      if (storeId !== undefined) {
        storeId = parseInt(storeId);
      }

      const updatedAdmin = await adminAction.updateAdminAction({
        id: adminId,
        name,
        role,
        email,
        storeId,
      });

      res.status(200).json({
        message: 'Admin berhasil diperbarui',
        data: updatedAdmin,
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const adminId = parseInt(req.params.adminId);

      const brand = await adminAction.deleteAdminAction(adminId);

      res.status(200).json({
        message: 'Admin berhasil dihapus',
        data: brand,
      });
    } catch (err) {
      next(err);
    }
  }
}
