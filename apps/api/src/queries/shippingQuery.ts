import prisma from '@/prisma'; 
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { OrderStatusService } from '@/utils/orderStatusService';
import { HttpException } from '@/errors/httpException';

class ShippingQuery {
  public async confirmShipping(order: any, userId: number) {
    try {
      return await prisma.$transaction(async (prisma) => {
        const orderStatusResult = await OrderStatusService.updateOrderStatus(
          order.id,
          OrderStatus.DIKONFIRMASI,
          userId,
          'Order confirmed and status updated to DIKONFIRMASI'
        );

        

        return orderStatusResult;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to confirm order shipping');
    }
  }

  
    public async processingOrder(order: any, userId: number) {
        try {
          return await prisma.$transaction(async (prisma) => {
            await prisma.payment.update({
              where: { id: order.paymentId },
              data: { paymentStatus: PaymentStatus.COMPLETED },
            });
      
            const orderStatusResult = await OrderStatusService.updateOrderStatus(
              order.id,
              OrderStatus.DIPROSES,
              userId,
              'Order processed and status updated to DIPROSES'
            );
      
            return orderStatusResult;
          });
        } catch (err) {
          throw new HttpException(500, 'Failed to process order');
        }
      }
      public async shippingOrder(order: any, userId: number) {
        try {
          return await prisma.$transaction(async (prisma) => {
            
            const orderStatusResult = await OrderStatusService.updateOrderStatus(
              order.id,
              OrderStatus.DIKIRIM,
              userId,
              'Order processed and status updated to DIKIRIM'
            );

        await this.scheduleAutomaticConfirmation(order.id, userId);
      
            return orderStatusResult;
          });
        } catch (err) {
          throw new HttpException(500, 'Failed to ship order');
        }
      }
      public async scheduleAutomaticConfirmation(orderId: number, userId: number) {
        try {
          const latestOrderStatus = await prisma.orderStatusUpdate.findFirst({
            where: {
              orderId,
              orderStatus: OrderStatus.DIKIRIM,
            },
            orderBy: { createdAt: 'desc' },
          });
      
          if (latestOrderStatus) {
            const createdAt = latestOrderStatus.createdAt;
            const sevenDaysInMs = 2 * 24 * 60 * 60 * 1000;
            const confirmationTime = new Date(createdAt.getTime() + sevenDaysInMs);
      
            setTimeout(async () => {
              try {
                const currentOrderStatus = await prisma.orderStatusUpdate.findFirst({
                  where: {
                    orderId,
                    orderStatus: OrderStatus.DIKIRIM,
                  },
                  orderBy: { createdAt: 'desc' },
                });
                if (currentOrderStatus) {
                  await OrderStatusService.updateOrderStatus(
                    orderId,
                    OrderStatus.DIKONFIRMASI,
                    userId,
                    'Order automatically confirmed after 7 days'
                  );
                  }
              } catch (err) {
                console.error(`Failed to automatically update order ${orderId} status:`, err);
              }
            }, confirmationTime.getTime() - Date.now()); 
          }
        } catch (err) {
          console.error(`Failed to schedule automatic confirmation for order ${orderId}:`, err);
        }
      }
    }
  


  export default new ShippingQuery()