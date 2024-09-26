import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { Prisma, OrderStatus } from '@prisma/client';
import { buildOrderSearchQuery } from './orderSearchQuery';

class CountOrderQuery {
  public async countAllOrders(search?: string) {
    try {
      const searchFilter = search ? buildOrderSearchQuery(search) : {};
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
        ...buildOrderSearchQuery(search), 
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
        ...buildOrderSearchQuery(search),
      };
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
        ...buildOrderSearchQuery(search), 
      };

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

      const searchFilter = search ? buildOrderSearchQuery(search) : {};
  
      return await prisma.order.count({
        where: {
          storeId: storeId, 
          ...searchFilter, 
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
          where: {
            storeState: 'PUBLISHED', 
          },
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