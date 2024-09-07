import { HttpException } from '@/errors/httpException';
import getOrderQuery from '@/queries/getOrderQuery';
import { HttpStatus } from '@/types/error';

class GetOrderAction {
    public async getAllOrdersAction() {
        const orders = await getOrderQuery.getAllOrders();
    
        if (orders.length === 0) {
          throw new HttpException(HttpStatus.NOT_FOUND, 'No orders found');
        }
    
        return orders;
      }
    public async getOrderByIdAction(orderIdStr: string) {
        const orderId = parseInt(orderIdStr, 10);
    
        if (isNaN(orderId)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid orderId format');
        }
    
        const order = await getOrderQuery.getOrderById(orderId);
    
        if (!order) {
          throw new HttpException(HttpStatus.NOT_FOUND, 'Order not found');
        }
    
        return order;
      }
    public async getOrdersAction(customerIdStr: string) {
        const customerId = parseInt(customerIdStr, 10);
      
        if (isNaN(customerId)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid customerId format');
        }
    
        const orders = await getOrderQuery.getOrdersByUserId(customerId);
    
        if (!orders.length) {
          throw new HttpException(HttpStatus.NOT_FOUND, 'No orders found for the specified user');
        }
    
        return orders;
      }
    public async getFinishedOrdersAction(customerIdStr: string) {
        const customerId = parseInt(customerIdStr, 10);
      
        if (isNaN(customerId)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid customerId format');
        }
    
        return await getOrderQuery.getFinishedOrders(customerId);
      }

      public async getUnfinishedOrdersAction(customerIdStr: string) {
        const customerId = parseInt(customerIdStr, 10);
      
        if (isNaN(customerId)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid customerId format');
        }
    
        return await getOrderQuery.getUnfinishedOrders(customerId);
      }
    
    
  public async getOrdersByDateRangeAndUserId({
    customerId,
    from,
    to,
  }: {
    customerId: string;
    from: string;
    to: string;
  }): Promise<any> {
    const customerIdInt = parseInt(customerId, 10);
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Validation
    if (isNaN(customerIdInt)) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid customerId format');
    }
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid date format');
    }
    if (fromDate > toDate) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid date range: from date cannot be after to date');
    }

    // Call the query method to get orders
    const orders = await getOrderQuery.getOrdersByDateRangeAndUserId(customerIdInt, fromDate, toDate);

    if (!orders.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'No orders found for the specified user and date range');
    }

    return orders;
  }
}

export default new GetOrderAction();
