import OrderQuery from '@/queries/orderQuery';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import getOrderQuery from '@/queries/getOrderQuery';
import orderQuery from '@/queries/orderQuery';



class OrderAction {
    public async cancelOrderAction(orderId: string | number, userId: number) {
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

      if (userRole === 'user' && order.customerId !== userId) {
        throw new HttpException(HttpStatus.FORBIDDEN, 'User is not authorized for this order');
      }
  
      if (userRole === 'store admin' && order.storeId !== userStoreId?.store?.id) {
        throw new HttpException(HttpStatus.FORBIDDEN, 'Admin is not authorized for this order');
      }
  
      const result = await OrderQuery.cancelOrderTransaction(order, userId);
      return result;
    }
    public async getUserAction(userIdStr: string) {
      const userId = parseInt(userIdStr, 10);
    
      if (isNaN(userId)) {
        throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid userId format');
      }
    
      const user = await OrderQuery.getUserById(userId);
    
      if (!user) {
        throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
      }
    
      return user;
    }
    
  }
  
  export default new OrderAction();