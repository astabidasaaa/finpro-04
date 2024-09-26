
import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { Route } from '@/types/express';
import { AuthMiddleware } from '@/middlewares/tokenHandler';


export class PaymentRoute implements Route {
    readonly router: Router;
    readonly path: string;
    private readonly paymentController: PaymentController;
    private readonly guard: AuthMiddleware;
  
    constructor() {
      this.router = Router();
      this.path = '/payments';
      this.paymentController = new PaymentController();
      this.guard = new AuthMiddleware();
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      
      this.router.post(`${this.path}/upload-payment-proof`, 
        this.guard.verifyAccessToken,
        this.paymentController.uploadPaymentProof);

      this.router.post(`${this.path}/reject-payment`, 
        this.guard.verifyAccessToken,
        this.guard.verifyRole(['store admin', 'super admin']),
        this.paymentController.rejectPayment);
    }
  }
