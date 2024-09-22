import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { Prisma, OrderStatus } from '@prisma/client';
import { buildOrderSearchQuery } from './orderSearchQuery';

class CountOrderQuery {
    // Count all orders for pagination
  public async countAllOrders(search?: string) {
    try {
      // Build the search filter if search term is provided
      const searchFilter = search ? buildOrderSearchQuery(search) : {};
  
      // Count all orders with optional search filter
      return await prisma.order.count({
        where: searchFilter,
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to count orders in the database');
    }
  }
  public async countOrdersByUserId(customerId: number, fromDate?: Date, toDate?: Date, search?: string): Promise<number> {
    try {
      const whereCondition: Prisma.OrderWhereInput = {
        customerId,
        ...buildOrderSearchQuery(search), // Apply search filter
      };
  
      if (fromDate && toDate) {
        whereCondition.createdAt = {
          gte: fromDate,
          lte: toDate,
        };
      }
  
      const totalOrders = await prisma.order.count({
        where: whereCondition,
      });
  
      return totalOrders;
    } catch (err) {
      throw new HttpException(500, 'Failed to count orders in the database');
    }
  }
  public async countFinishedOrders(
    customerId: number, 
    fromDate?: Date, 
    toDate?: Date, 
    search?: string
  ): Promise<number> {
    const finishedStatuses = [OrderStatus.DIKONFIRMASI, OrderStatus.DIBATALKAN];
  
    try {
      const whereCondition: Prisma.OrderWhereInput = {
        customerId,
        orderStatus: {
          in: finishedStatuses,
        },
        ...buildOrderSearchQuery(search), // Apply search filter
      };
  
      // Add date range filter if provided
      if (fromDate && toDate) {
        whereCondition.createdAt = {
          gte: fromDate,
          lte: toDate,
        };
      }
  
      const totalFinishedOrders = await prisma.order.count({
        where: whereCondition,
      });
  
      return totalFinishedOrders;
    } catch (err) {
      throw new HttpException(500, 'Failed to count finished orders in the database');
    }
  }
  public async countUnfinishedOrders(
    customerId: number, 
    fromDate?: Date, 
    toDate?: Date, 
    search?: string
  ): Promise<number> {
    const unfinishedStatuses = [
      OrderStatus.MENUNGGU_PEMBAYARAN,
      OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN,
      OrderStatus.DIPROSES,
      OrderStatus.DIKIRIM,
    ];
  
    try {
      const whereCondition: Prisma.OrderWhereInput = {
        customerId,
        orderStatus: {
          in: unfinishedStatuses,
        },
        ...buildOrderSearchQuery(search), // Apply search filter
      };
  
      // Add date range filter if provided
      if (fromDate && toDate) {
        whereCondition.createdAt = {
          gte: fromDate,
          lte: toDate,
        };
      }
  
      const totalUnfinishedOrders = await prisma.order.count({
        where: whereCondition,
      });
  
      return totalUnfinishedOrders;
    } catch (err) {
      throw new HttpException(500, 'Failed to count finished orders in the database');
    }
  }
  public async countOrdersByStoreId(storeId: number, search?: string) {
    try {
      // Build the search filter if search term is provided
      const searchFilter = search ? buildOrderSearchQuery(search) : {};
  
      // Count orders with optional search filter
      return await prisma.order.count({
        where: {
          storeId: storeId, // Filter by storeId
          ...searchFilter,  // Include search filter
        },
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to count orders for the specified store');
    }
  }
  public async getAllStores() {
    try {
      return await prisma.$transaction(async (prisma) => {
        const storeList = await prisma.store.findMany({
          include: {
            creator: true,
            admins: true,
            inventories: true,
            orders: true,
            mutationsFrom: true,
            mutationsTo: true,
            promotions: true,
            addresses: true,
          },
        });
  
        return storeList;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve stores from the database');
    }
  }
}

export default new CountOrderQuery