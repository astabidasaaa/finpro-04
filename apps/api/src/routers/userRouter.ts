import { UserController } from '@/controllers/userController';
import { uploader } from '@/libs/uploader';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import {
  validateAddressCreate,
  validateAddressUpdate,
  validateUserUpdate,
} from '@/middlewares/userValidator';
import { Route } from '@/types/express';
import { Router } from 'express';

export class UserRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly userController: UserController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.guard = new AuthMiddleware();
    this.path = '/user';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}/profile`,
      this.guard.verifyAccessToken,
      this.userController.getSelfProfile,
    );

    this.router.patch(
      `${this.path}/profile`,
      validateUserUpdate,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['user']),
      uploader('avatar', '/avatar').single('file'),
      this.userController.updateSelfProfile,
    );

    this.router.get(
      `${this.path}/addresses`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['user']),
      this.userController.getUserAddresses,
    );

    this.router.post(
      `${this.path}/addresses`,
      validateAddressCreate,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['user']),
      this.userController.postUserAddresses,
    );

    this.router.patch(
      `${this.path}/addresses/:addressId`,
      validateAddressUpdate,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['user']),
      this.userController.updateUserAddresses,
    );

    this.router.delete(
      `${this.path}/addresses/:addressId`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['user']),
      this.userController.deleteUserAddresses,
    );

    this.router.get(
      `${this.path}/addresses/:addressId/change-main`,
      this.guard.verifyAccessToken,
      this.guard.verifyRole(['user']),
      this.userController.changeUserMainAddress,
    );
  }
}
