import { Router } from 'express';
import type { Route } from '@/types/express';
import { AdminController } from '@/controllers/adminController';
import {
  validateAdminCreation,
  validateAdminUpdate,
  validateChangeAdminPassword,
} from '@/middlewares/adminValidator';
import { AuthMiddleware } from '@/middlewares/tokenHandler';

export class AdminRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly adminController: AdminController;
  private readonly guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.adminController = new AdminController();
    this.guard = new AuthMiddleware();
    this.path = '/admins';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/create`,
      validateAdminCreation,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.adminController.createAdmin,
    );

    // pagination and filter to show users
    this.router.get(
      `${this.path}/users`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.adminController.getUsers,
    );

    this.router.get(
      `${this.path}/select`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.adminController.getAllAdminToBeSelected,
    );

    this.router.patch(
      `${this.path}/update/:adminId`,
      validateAdminUpdate,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.adminController.updateAdmin,
    );

    this.router.patch(
      `${this.path}/change-password`,
      validateChangeAdminPassword,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.adminController.changePassword,
    );

    this.router.patch(
      `${this.path}/delete/:adminId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['super admin']),
      this.adminController.deleteAdmin,
    );
  }
}
