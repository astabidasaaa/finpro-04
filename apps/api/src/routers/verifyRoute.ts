// src/routes/verifyStoreRoute.ts
import { Router } from 'express';
import { VerifyStoreController } from '@/controllers/verifyStoreController';
import type { RouteItems } from '@/interfaces/routesInterface';

export class VerifyStoreRoute implements RouteItems {
  readonly router: Router;
  readonly path: string;
  private readonly verifyStoreController: VerifyStoreController;

  constructor() {
    this.router = Router();
    this.path = '/verify-store';
    this.verifyStoreController = new VerifyStoreController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Verify if a store is the closest
    this.router.post(`${this.path}/check-closest`, this.verifyStoreController.checkClosestStore);
  }
}
