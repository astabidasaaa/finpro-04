import { UserController } from '@/controllers/userController';
import { uploader } from '@/libs/uploader';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { validateUserUpdate } from '@/middlewares/userValidator';
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
  }
}
