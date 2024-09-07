import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { OrderStatus } from '@prisma/client';


class OrderQuery {
  public async getAllOrders() {
    try {
      return await prisma.$transaction(async (prisma) => {
        const orderList = await prisma.order.findMany({
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
    public async getOrderById(orderId: number) {
        try {
          return await prisma.$transaction(async (prisma) => {
            const orderData = await prisma.order.findUnique({
              where: { id: orderId },
              include: {
                orderItems: true,
                payment: true,
                shipping: true,
                orderStatusUpdates: true,
              },
            });
    
            return orderData;
          });
        } catch (err) {
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
}

export default new OrderQuery();
