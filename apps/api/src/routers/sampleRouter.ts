import { SampleController } from '@/controllers/sampleController';
import { Route } from '@/types/express';
import { Router } from 'express';

export class SampleRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly sampleController: SampleController;

  constructor() {
    this.router = Router();
    this.sampleController = new SampleController();
    this.path = '/sample';
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.sampleController.getSampleData);
    this.router.get(
      `${this.path}/:id`,
      this.sampleController.getSampleDataById,
    );
    this.router.post(`${this.path}`, this.sampleController.createSampleData);
  }
}
