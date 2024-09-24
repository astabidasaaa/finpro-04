
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import getOrderQuery from '@/queries/getOrderQuery';
import shippingQuery from '@/queries/shippingQuery';



class ShippingAction {
  public async confirmShippingAction(orderId: number, userId: number) {

    const order = await getOrderQuery.getOrderById(orderId);

    if (!order) {
      throw new HttpException(404, 'Order not found');
    }
    const result = await shippingQuery.confirmShipping(order, userId);
    return result;
  }

    public async processingOrderAction(orderId: string | number, userId: number) {
        const orderIdInt = parseInt(orderId as string, 10);
      
        if (isNaN(orderIdInt)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid orderId format');
        }
      
        const order = await getOrderQuery.getOrderById(orderIdInt);
      
        if (!order) {
          throw new HttpException(HttpStatus.NOT_FOUND, 'Order not found');
        }
      
        const result = await shippingQuery.processingOrder(order, userId);
        return result;
      }
      public async shippingOrderAction(orderId: string | number, userId: number) {
        const orderIdInt = parseInt(orderId as string, 10);
      
        if (isNaN(orderIdInt)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid orderId format');
        }
      
        const order = await getOrderQuery.getOrderById(orderIdInt);
      
        if (!order) {
          throw new HttpException(HttpStatus.NOT_FOUND, 'Order not found');
        }
      
        const result = await shippingQuery.shippingOrder(order, userId);
        return result;
      }
      
    }
  
  export default new ShippingAction();