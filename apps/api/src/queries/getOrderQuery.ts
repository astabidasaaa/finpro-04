import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { Prisma } from '@prisma/client';
import { buildOrderSearchQuery } from './orderSearchQuery';

class OrderQuery {
  public async getAllOrders(limit: number, offset: number, search?: string) {
    try {
      return await prisma.$transaction(async (prisma) => {
        const searchFilter = buildOrderSearchQuery(search); 
        const orderList = await prisma.order.findMany({
          skip: offset, 
          take: limit, 
          where: searchFilter, 
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
  
  public async getOrderById(orderId: number) {
    try {
  
      const orderData = await prisma.$transaction(async (prisma) => {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true, 
                },
              },
              productDiscountPerStore: {
                select: {
                  discountType: true,
                  discountValue: true,
                  startedAt: true,
                  finishedAt: true
                },
              },
              freeProductPerStore: {
                select: {
                  buy: true, 
                  get: true,  
                  startedAt: true,
                  finishedAt: true
                },
              },
            },
          },
          payment: {
            select: {
              paymentStatus: true,
              paymentGateway: true,
              paymentDate: true,
              paymentProof: true,  
              transactionId: true,
              amount: true,
            },
          },
          shipping: true,
          orderStatusUpdates: true,
          deliveryAddress: true,
          customer: {
            include: {
              profile: {
                select: {
                  name: true,  
                },
              },
            },
          },
          vouchers: {  
            where: {
              promotion: {
                promotionType: 'TRANSACTION',

              },
            },
            include: {
              promotion: {
                select: {
                  discountType: true,
                  discountValue: true,
                  maxDeduction: true
                },
              },
            },
          },
        },
      });
        return order;
      });
  
      return orderData;
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve order from the database');
    }
  }
  public async getRoleByUserId(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          role: {
            select: {
              name: true, 
            },
          },
        },
      });
  
      if (!user || !user.role) {
        throw new HttpException(404, 'User or role not found');
      }
  
      return user.role.name; 
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve user role');
    }
  }
     
  public async getOrdersByUserId(customerId: number, fromDate?: Date, toDate?: Date, search?: string, page?: number, pageSize?: number): Promise<any> {
    try {
      return await prisma.$transaction(async (prisma) => {
        const whereCondition: Prisma.OrderWhereInput = {
          customerId,
          ...buildOrderSearchQuery(search), 
        };

        if (fromDate && toDate) {

          const startOfDay = new Date(fromDate);
          startOfDay.setUTCHours(0, 0, 0, 0); 
  
          const endOfDay = new Date(toDate);
          endOfDay.setUTCHours(23, 59, 59, 999); 
  
          whereCondition.createdAt = {
            gte: startOfDay,
            lte: endOfDay,
          };
        }
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
            createdAt: 'desc', 
          },
        });
  
        return orderList;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to retrieve orders from the database');
    }
  }
      
  public async getOrdersByStoreId(storeId: number, limit: number, offset: number, search?: string) {
    try {
      return await prisma.$transaction(async (prisma) => {

        const searchFilter = search ? buildOrderSearchQuery(search) : {};
        const orderList = await prisma.order.findMany({
          where: {
            storeId,
            ...searchFilter, 
          },
          skip: offset, 
          take: limit, 
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
}

export default new OrderQuery();
