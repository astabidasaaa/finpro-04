import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { OrderStatus } from '@prisma/client';


class OrderQuery {
  public async getAllOrders(limit: number, offset: number) {
    try {
      return await prisma.$transaction(async (prisma) => {
        // Fetch paginated orders
        const orderList = await prisma.order.findMany({
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
          orderBy: { createdAt: 'desc' },
        });
  
        return orderList;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve orders from the database');
    }
  }
  
  // Count all orders for pagination
  public async countAllOrders() {
    try {
      return await prisma.order.count();
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
  
    
    public async getOrdersByUserId(customerId: number) {
        try {
          return await prisma.$transaction(async (prisma) => {
            const orderList = await prisma.order.findMany({
              where: { customerId },
              include: {
                orderItems: true,
                payment: true,
                shipping: true,
                orderStatusUpdates: true,
              },
            });
    
            return orderList;
          });
        } catch (err) {
          throw new HttpException(500, 'Failed to retrieve orders from the database');
        }
      }
    public async getFinishedOrders(customerId: number) {
        const finishedStatuses = [OrderStatus.DIKONFIRMASI, OrderStatus.DIBATALKAN];
    
        try {
          const orders = await prisma.order.findMany({
            where: {
              customerId,
              orderStatus: {
                in: finishedStatuses,
              },
            },
            include: {
              orderItems: true,
              payment: true,
              shipping: true,
              orderStatusUpdates: true,
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
      public async getUnfinishedOrders(customerId: number) {
        const unfinishedStatuses = [
          OrderStatus.MENUNGGU_PEMBAYARAN,
          OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN,
          OrderStatus.DIPROSES,
          OrderStatus.DIKIRIM,
        ];
    
        try {
          const orders = await prisma.order.findMany({
            where: {
              customerId,
              orderStatus: {
                in: unfinishedStatuses,
              },
            },
            include: {
              orderItems: true,
              payment: true,
              shipping: true,
              orderStatusUpdates: true,
            },
          });
    
          if (!orders.length) {
            throw new HttpException(404, 'No unfinished orders found for this user');
          }
    
          return orders;
        } catch (err) {
          throw new HttpException(500, 'Failed to retrieve unfinished orders');
        }
      }
    
  public async getOrdersByDateRangeAndUserId(
    customerId: number,
    fromDate: Date,
    toDate: Date
  ): Promise<any> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          customerId,
          createdAt: {
            gte: fromDate,
            lte: toDate,
          },
        },
        include: {
          orderItems: true,
          payment: true,
          shipping: true,
          orderStatusUpdates: true,
        },
      });

      return orders;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to retrieve orders',
      );
    }
  }
  public async getOrdersByStoreId(storeId: number, limit: number, offset: number) {
    try {
      return await prisma.$transaction(async (prisma) => {
        // Fetch paginated orders
        const orderList = await prisma.order.findMany({
          where: { storeId },
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

  public async countOrdersByStoreId(storeId: number) {
    try {
      return await prisma.order.count({
        where: {
          storeId: storeId, // Filter by storeId
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
