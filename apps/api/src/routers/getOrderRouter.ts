import { Router } from 'express';
import { GetOrderController } from '@/controllers/getOrderController';
import { Route } from '@/types/express';


export class GetOrderRouter implements Route {
  readonly router: Router;
  readonly path: string;
  private readonly getOrderController: GetOrderController;

  constructor() {
    this.router = Router();
    this.path = '/get-order';
    this.getOrderController = new GetOrderController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new order
    this.router.get(`${this.path}/get-all-order`, this.getOrderController.getAllOrders);
    this.router.get(`${this.path}/get-finished-orders-by-user`, this.getOrderController.getFinishedOrdersByUserId);
    this.router.get(`${this.path}/get-unfinished-orders-by-user`, this.getOrderController.getUnfinishedOrdersByUserId);
    this.router.get(`${this.path}/get-orders-by-user`, this.getOrderController.getOrdersByUserId);
    this.router.get(`${this.path}/get-order-by-id`, this.getOrderController.getOrderById);
    this.router.get(`${this.path}/get-orders-by-store`, this.getOrderController.getOrdersByStoreId);
    this.router.get(`${this.path}/get-all-stores`, this.getOrderController.getAllStores);
  }
}
