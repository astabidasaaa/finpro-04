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
  //   private readonly passwordController: PasswordController;
  //   private readonly verifyEmailController: VerifyEmailController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    // this.passwordController = new PasswordController();
    // this.verifyEmailController = new VerifyEmailController();
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
      uploader('avatar', '/avatar').single('file'),
      this.userController.updateSelfProfile,
    );
  }
}
