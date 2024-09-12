import { HttpException } from '@/errors/httpException';
import getOrderQuery from '@/queries/getOrderQuery';
import { HttpStatus } from '@/types/error';

class GetOrderAction {
  public async getAllOrdersAction(page: number, limit: number) {
    const offset = (page - 1) * limit;
  
    // Fetch paginated orders and total count in parallel
    const [orders, total] = await Promise.all([
      getOrderQuery.getAllOrders(limit, offset), // Fetch paginated data
      getOrderQuery.countAllOrders(), // Fetch total count of orders
    ]);
  
    if (orders.length === 0) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'No orders found');
    }
  
    const totalPages = Math.ceil(total / limit);
  
    return {
      data: orders,
      total,
      totalPages,
    };
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
  public async getOrdersByStoreAction(storeIdStr: string, pageStr: string, limitStr: string) {
    const storeId = parseInt(storeIdStr, 10);
    const page = parseInt(pageStr, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(limitStr, 10) || 10; // Default limit to 10 if not provided
    const offset = (page - 1) * limit; // Calculate offset
  
    if (isNaN(storeId)) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid storeId format');
    }
  
    const orders = await getOrderQuery.getOrdersByStoreId(storeId, limit, offset);
    const totalOrders = await getOrderQuery.countOrdersByStoreId(storeId); // Total order count
  
    if (!orders.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'No orders found for the specified store');
    }
  
    return { orders, totalOrders };
  }
  
  public async getAllStoresAction() {
    const stores = await getOrderQuery.getAllStores();
  
    if (!stores.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'No stores found');
    }
  
    return stores;
  }
  
}

export default new GetOrderAction();
