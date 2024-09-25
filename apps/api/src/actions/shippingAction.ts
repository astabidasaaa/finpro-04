
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import getOrderQuery from '@/queries/getOrderQuery';
import shippingQuery from '@/queries/shippingQuery';
import orderQuery from '@/queries/orderQuery';



class ShippingAction {
  public async confirmShippingAction(orderId: number, userId: number) {
    const order = await getOrderQuery.getOrderById(orderId);
    const userRole = await getOrderQuery.getRoleByUserId(userId);

    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    if (userRole === 'user' && order.customerId !== userId) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'User is not authorized for this order');
    }
    const result = await shippingQuery.confirmShipping(order, userId);
    return result;
  }

    public async processingOrderAction(orderId: string | number, userId: number) {
        const orderIdInt = parseInt(orderId as string, 10);
        const userRole = await getOrderQuery.getRoleByUserId(userId);
    const userStoreId = await orderQuery.getUserById(userId)
      
        if (isNaN(orderIdInt)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid orderId format');
        }
      
        const order = await getOrderQuery.getOrderById(orderIdInt);
      
        if (!order) {
          throw new HttpException(HttpStatus.NOT_FOUND, 'Order not found');
        }
        if (userRole === 'store admin' && order.storeId !== userStoreId?.store?.id) {
          throw new HttpException(HttpStatus.FORBIDDEN, 'Admin is not authorized for this order');
        }
      
        const result = await shippingQuery.processingOrder(order, userId);
        return result;
      }
      public async shippingOrderAction(orderId: string | number, userId: number) {
        const orderIdInt = parseInt(orderId as string, 10);
        const userRole = await getOrderQuery.getRoleByUserId(userId);
    const userStoreId = await orderQuery.getUserById(userId)
      
        if (isNaN(orderIdInt)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid orderId format');
        }
      
        const order = await getOrderQuery.getOrderById(orderIdInt);
      
        if (!order) {
          throw new HttpException(HttpStatus.NOT_FOUND, 'Order not found');
        }
        if (userRole === 'store admin' && order.storeId !== userStoreId?.store?.id) {
          throw new HttpException(HttpStatus.FORBIDDEN, 'Admin is not authorized for this order');
        }
      
        const result = await shippingQuery.shippingOrder(order, userId);
        return result;
      }
      
    }
  
  export default new ShippingAction();