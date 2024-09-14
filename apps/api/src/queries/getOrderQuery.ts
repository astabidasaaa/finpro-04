import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { Prisma, OrderStatus } from '@prisma/client';
import { buildOrderSearchQuery } from './orderSearchQuery';


class OrderQuery {
  public async getAllOrders(limit: number, offset: number, search?: string) {
    try {
      return await prisma.$transaction(async (prisma) => {
        const searchFilter = buildOrderSearchQuery(search); // Use the reusable search query
  
        const orderList = await prisma.order.findMany({
          skip: offset, // Pagination: skip the previous records
          take: limit, // Pagination: take the number of records
          where: searchFilter, // Apply the search filter
          include: {
            orderItems: true,
            payment: true,
            shipping: true,
            orderStatusUpdates: true,
            store: {
              select: {
                name: true,
              },
            },
            customer: {
              include: {
                profile: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
  
        return orderList;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve orders from the database');
    }
  }
  
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
  
  
  public async getOrderById(orderId: number) {
    try {
      console.log(`Fetching order with ID: ${orderId}`);
  
      const orderData = await prisma.$transaction(async (prisma) => {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    name: true  // Only the product name
                  }
                },
                productDiscountPerStore: true,
                freeProductPerStore: true
              },
            
            },
            payment: {
              select: {
                paymentStatus: true,
                paymentGateway: true,
                paymentDate: true,
                paymentProof: true,  // Make sure paymentProof is included
                transactionId: true,
                amount: true
              }
            },
            shipping: true,
            orderStatusUpdates: true,
            deliveryAddress: true,
            customer: {
              include: {
                profile: {
                  select: {
                    name: true  // Only the customer's name
                  }
                }
              }
            }
          }
        });
  
        console.log(`Order data retrieved: ${JSON.stringify(order)}`);
        return order;
      });
  
      return orderData;
    } catch (err) {
      console.error("Error retrieving order from the database:", err);
      throw new HttpException(500, 'Failed to retrieve order from the database');
    }
  }
  
    
  public async getOrdersByUserId(customerId: number, fromDate?: Date, toDate?: Date, search?: string, page?: number, pageSize?: number): Promise<any> {
    try {
      return await prisma.$transaction(async (prisma) => {
        const whereCondition: Prisma.OrderWhereInput = {
          customerId,
          ...buildOrderSearchQuery(search), // Apply search query
        };
  
        // If both fromDate and toDate are provided, add the createdAt filter
        if (fromDate && toDate) {
          whereCondition.createdAt = {
            gte: fromDate,
            lte: toDate,
          };
        }
  
        // Set default pagination values if not provided
        const take = pageSize || 10;
        const skip = page ? (page - 1) * take : 0;
  
        const orderList = await prisma.order.findMany({
          where: whereCondition,
          include: {
            orderItems: true,
            payment: true,
            shipping: true,
            orderStatusUpdates: true,
          },
          skip,
          take,
          orderBy: {
            createdAt: 'desc', // Orders will be returned in descending order of creation date
          },
        });
  
        return orderList;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve orders from the database');
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
  
  
  public async getFinishedOrders(
    customerId: number, 
    fromDate?: Date, 
    toDate?: Date, 
    search?: string, 
    page?: number, 
    pageSize?: number
  ): Promise<any> {
    const finishedStatuses = [OrderStatus.DIKONFIRMASI, OrderStatus.DIBATALKAN];
  
    try {
      const whereCondition: Prisma.OrderWhereInput = {
        customerId,
        orderStatus: {
          in: finishedStatuses,
        },
        ...buildOrderSearchQuery(search), // Apply search query
      };
  
      // Add date range filter if provided
      if (fromDate && toDate) {
        whereCondition.createdAt = {
          gte: fromDate,
          lte: toDate,
        };
      }
  
      // Set default pagination values if not provided
      const take = pageSize || 10;
      const skip = page ? (page - 1) * take : 0;
  
      const orders = await prisma.order.findMany({
        where: whereCondition,
        include: {
          orderItems: true,
          payment: true,
          shipping: true,
          orderStatusUpdates: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc', // Orders will be returned in descending order of creation date
        },
      });
  
      if (!orders.length) {
        throw new HttpException(404, 'No finished orders found for this user');
      }
  
      return orders;
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve finished orders');
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


      public async getUnfinishedOrders(
        customerId: number, 
        fromDate?: Date, 
        toDate?: Date, 
        search?: string, 
        page?: number, 
        pageSize?: number
      ): Promise<any> {
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
            ...buildOrderSearchQuery(search), // Apply search query
          };
      
          // Add date range filter if provided
          if (fromDate && toDate) {
            whereCondition.createdAt = {
              gte: fromDate,
              lte: toDate,
            };
          }
      
          // Set default pagination values if not provided
          const take = pageSize || 10;
          const skip = page ? (page - 1) * take : 0;
      
          const orders = await prisma.order.findMany({
            where: whereCondition,
            include: {
              orderItems: true,
              payment: true,
              shipping: true,
              orderStatusUpdates: true,
            },
            skip,
            take,
            orderBy: {
              createdAt: 'desc', // Orders will be returned in descending order of creation date
            },
          });
      
          if (!orders.length) {
            throw new HttpException(404, 'No finished orders found for this user');
          }
      
          return orders;
        } catch (err) {
          throw new HttpException(500, 'Failed to retrieve finished orders');
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
    
  
  public async getOrdersByStoreId(storeId: number, limit: number, offset: number, search?: string) {
    try {
      return await prisma.$transaction(async (prisma) => {
        // Build the search filter if search term is provided
        const searchFilter = search ? buildOrderSearchQuery(search) : {};
  
        // Fetch paginated orders with optional search filter
        const orderList = await prisma.order.findMany({
          where: {
            storeId,
            ...searchFilter, // Include search filter
          },
          skip: offset, // Pagination: skip the previous records
          take: limit, // Pagination: take the number of records
          include: {
            orderItems: true,
            payment: true,
            shipping: true,
            orderStatusUpdates: true,
            store: {
              select: {
                name: true, // Include the store name
              },
            },
            customer: {
              include: {
                profile: {
                  select: {
                    name: true, // Include the user's name from the Profile
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' }, // Order by createdAt descending
        });
  
        return orderList;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve orders from the database');
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

export default new OrderQuery();
