import OrderQuery from '@/queries/orderQuery';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import getOrderQuery from '@/queries/getOrderQuery';



class OrderAction {
    public async cancelOrderAction(orderId: string | number, userId: number) {
      const orderIdInt = parseInt(orderId as string, 10);
  
      if (isNaN(orderIdInt)) {
        throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid orderId format');
      }
  
      const order = await getOrderQuery.getOrderById(orderIdInt);
  
      if (!order) {
        throw new HttpException(HttpStatus.NOT_FOUND, 'Order not found');
      }
  
      const result = await OrderQuery.cancelOrderTransaction(order, userId);
      return result;
    }
  }
  
  export default new OrderAction();