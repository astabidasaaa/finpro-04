import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';
import adminAction from '@/actions/adminAction';
import passwordAction from '@/actions/passwordAction';

export class AdminController {
  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        keyword = '',
        page = 1,
        pageSize = 20,
        role = '',
        storeId,
      } = req.query;

      const admins = await adminAction.getUsersAction({
        keyword: String(keyword),
        page: Number(page),
        pageSize: Number(pageSize),
        role: String(role),
        storeId: Number(storeId),
      });

      res.status(200).json({
        message: 'Data user berhasil ditampilkan',
        data: admins,
      });
    } catch (err) {
      next(err);
    }
  }

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
      const { name, email } = req.body;
      let { storeId } = req.body;

      if (storeId !== undefined) {
        storeId = parseInt(storeId);
      }

      const updatedAdmin = await adminAction.updateAdminAction({
        id: adminId,
        name,
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

  public async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password, newPassword } = req.body;

      await passwordAction.change(email, password, newPassword);

      res.status(200).json({
        message: 'Password berhasil diubah',
      });
    } catch (error) {
      next(error);
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

  public async getAllAdminToBeSelected(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { search, limit, offset } = req.query;

      const admins = await adminAction.getAllAdminsAction({
        search: search?.toString(),
        limit: limit?.toString(),
        offset: offset?.toString(),
      });

      res.status(200).json({
        message: 'Daftar admin berhasil diambil',
        data: { admins },
      });
    } catch (err) {
      next(err);
    }
  }
}
