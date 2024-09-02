import { AuthController } from '@/controllers/authController';
import { PasswordController } from '@/controllers/passwordController';
import { VerifyEmailController } from '@/controllers/verifyEmailController';
import {
  validateChangePassword,
  validateEmail,
  validateLogin,
  validatePassword,
  validateRegister,
} from '@/middlewares/authValidator';
import { AuthMiddleware } from '@/middlewares/tokenHandler';
import { Route } from '@/types/express';
import { Router } from 'express';

export class AuthRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly authController: AuthController;
  private readonly passwordController: PasswordController;
  private readonly verifyEmailController: VerifyEmailController;
  private guard: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.passwordController = new PasswordController();
    this.verifyEmailController = new VerifyEmailController();
    this.guard = new AuthMiddleware();
    this.path = '/auth';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/login`,
      validateLogin,
      this.authController.loginCredentials,
    );

    this.router.post(
      `${this.path}/register-request`,
      validateEmail,
      this.authController.initiateRegisterCredentials,
    );

    this.router.post(
      `${this.path}/register`,
      validateRegister,
      this.guard.verifyRegistrationToken,
      this.authController.registerCredentials,
    );

    this.router.get(
      `${this.path}/verify-email-request`,
      this.guard.verifyAccessToken,
      this.verifyEmailController.emailVerificationRequest,
    );

    this.router.post(
      `${this.path}/verify-email`,
      validatePassword,
      this.verifyEmailController.emailVerification,
    );

    this.router.post(
      `${this.path}/reset-password-request`,
      validateEmail,
      this.passwordController.resetPasswordRequest,
    );

    this.router.post(
      `${this.path}/reset-password`,
      validatePassword,
      this.passwordController.resetPassword,
    );

    this.router.get(
      `${this.path}/refresh-token`,
      this.guard.verifyAccessToken,
      this.authController.refreshAccessToken,
    );

    this.router.patch(
      `${this.path}/change-password`,
      validateChangePassword,
      this.guard.verifyAccessToken,
      this.passwordController.changePassword,
    );

    this.router.patch(
      `${this.path}/add-password`,
      this.guard.verifyAccessToken,
      this.authController.refreshAccessToken,
    );
  }
}
