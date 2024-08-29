// src/routes/paymentRoutes.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import type { RouteItems } from '@/interfaces/routesInterface';


export class PaymentRoute implements RouteItems {
    readonly router: Router;
    readonly path: string;
    private readonly paymentController: PaymentController;
  
    constructor() {
      this.router = Router();
      this.path = '/payments';
      this.paymentController = new PaymentController();
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      
      
      this.router.post(`${this.path}/upload-payment-proof`, this.paymentController.uploadPaymentProof);
    }
  }
