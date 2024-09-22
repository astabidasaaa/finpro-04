import { HttpException } from '@/errors/httpException';
import getOrderQuery from '@/queries/getOrderQuery';
import { HttpStatus } from '@/types/error';
import countOrderQuery from '@/queries/countOrderQuery';
import getFinishedOrderQuery from '@/queries/getFinishedOrderQuery';

class GetOrderAction {
  public async getAllOrdersAction(page: number, limit: number, search?: string) {
    const offset = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      getOrderQuery.getAllOrders(limit, offset, search), 
      countOrderQuery.countAllOrders(search), 
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
      public async getOrdersAction({
        customerId,
        from,
        to,
        search,
        page,
        pageSize,
      }: {
        customerId: string;
        from?: string;
        to?: string;
        search?: string;
        page?: string;
        pageSize?: string;
      }): Promise<any> {
        const customerIdInt = parseInt(customerId, 10);
        
        if (isNaN(customerIdInt)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid customerId format');
        }
        let fromDate: Date | undefined;
        let toDate: Date | undefined;
        
        if (from && to) {
          fromDate = new Date(from);
          toDate = new Date(to);
        
          if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid date format');
          }
          if (fromDate > toDate) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid date range: from date cannot be after to date');
          }
        }
        const currentPage = page ? parseInt(page, 10) : 1;
        const pageSizeInt = pageSize ? parseInt(pageSize, 10) : 10;
        
        const orders = await getOrderQuery.getOrdersByUserId(
          customerIdInt,
          fromDate,
          toDate,
          search,
          currentPage,
          pageSizeInt
        );
        
        const totalOrders = await countOrderQuery.countOrdersByUserId(
          customerIdInt,
          fromDate,
          toDate,
          search
        );
        
        const totalPages = Math.ceil(totalOrders / pageSizeInt);
        
        return {
          orders,
          pagination: {
            total: totalOrders,
            page: currentPage,
            pageSize: pageSizeInt,
            totalPages
          },
        };
      }
      public async getFinishedOrdersAction({
        customerIdStr,
        from,
        to,
        search,
        page,
        pageSize,
      }: {
        customerIdStr: string;
        from?: string;
        to?: string;
        search?: string;
        page?: string;
        pageSize?: string;
      }): Promise<any> {
        const customerId = parseInt(customerIdStr, 10);
      
        if (isNaN(customerId)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid customerId format');
        }
      
        let fromDate: Date | undefined;
        let toDate: Date | undefined;
      
        if (from && to) {
          fromDate = new Date(from);
          toDate = new Date(to);
      
          if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid date format');
          }
      
          if (fromDate > toDate) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid date range: from date cannot be after to date');
          }
        }
      
        const pageNumber = page ? parseInt(page, 10) : 1;
        const pageSizeNumber = pageSize ? parseInt(pageSize, 10) : 10;
      
        const orders = await getFinishedOrderQuery.getFinishedOrders(
          customerId,
          fromDate,
          toDate,
          search,
          pageNumber,
          pageSizeNumber
        );
      
        const totalOrders = await countOrderQuery.countFinishedOrders(
          customerId,
          fromDate,
          toDate,
          search
        );
      
        const totalPages = Math.ceil(totalOrders / pageSizeNumber);
      
        return {
          orders,
          pagination: {
            total: totalOrders,
            page: pageNumber,
            pageSize: pageSizeNumber,
            totalPages,
          },
        };
      }

      public async getUnfinishedOrdersAction({
        customerIdStr,
        from,
        to,
        search,
        page,
        pageSize,
      }: {
        customerIdStr: string;
        from?: string;
        to?: string;
        search?: string;
        page?: string;
        pageSize?: string;
      }): Promise<any> {
        const customerId = parseInt(customerIdStr, 10);
        if (isNaN(customerId)) {
          throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid customerId format');
        }
        let fromDate: Date | undefined;
        let toDate: Date | undefined;
      
        if (from && to) {
          fromDate = new Date(from);
          toDate = new Date(to);
          if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid date format');
          }
          if (fromDate > toDate) {
            throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid date range: from date cannot be after to date');
          }
        }
      
        const pageNumber = page ? parseInt(page, 10) : 1;
        const pageSizeNumber = pageSize ? parseInt(pageSize, 10) : 10;
      
        // Retrieve finished orders with pagination, search, and date range
        const orders = await getFinishedOrderQuery.getUnfinishedOrders(
          customerId,
          fromDate,
          toDate,
          search,
          pageNumber,
          pageSizeNumber
        );
        const totalOrders = await countOrderQuery.countUnfinishedOrders(
          customerId,
          fromDate,
          toDate,
          search
        ); 
        const totalPages = Math.ceil(totalOrders / pageSizeNumber);
        return {
          orders,
          pagination: {
            total: totalOrders,
            page: pageNumber,
            pageSize: pageSizeNumber,
            totalPages,
          },
        };
      }
  public async getOrdersByStoreAction(storeIdStr: string, pageStr: string, limitStr: string, search?: string) {
    const storeId = parseInt(storeIdStr, 10);
    const page = parseInt(pageStr, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(limitStr, 10) || 10; // Default limit to 10 if not provided
    const offset = (page - 1) * limit; // Calculate offset
  
    if (isNaN(storeId)) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid storeId format');
    }
    const orders = await getOrderQuery.getOrdersByStoreId(storeId, limit, offset, search); // Pass search term
    const totalOrders = await countOrderQuery.countOrdersByStoreId(storeId, search); // Total order count
    if (!orders.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'No orders found for the specified store');
    }
    return { orders, totalOrders };
  }
  public async getAllStoresAction() {
    const stores = await countOrderQuery.getAllStores();
    if (!stores.length) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'No stores found');
    }
    return stores;
  }
}
export default new GetOrderAction();
