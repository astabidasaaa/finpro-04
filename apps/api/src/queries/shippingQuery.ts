import prisma from '@/prisma'; 
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { OrderStatusService } from '@/utils/orderStatusService';
import { HttpException } from '@/errors/httpException';

class ShippingQuery {
  public async confirmShipping(order: any, userId: number) {
    try {
      return await prisma.$transaction(async (prisma) => {
        // Update the order status to DIKIRIM
        const orderStatusResult = await OrderStatusService.updateOrderStatus(
          order.id,
          OrderStatus.DIKONFIRMASI,
          userId,
          'Order confirmed and status updated to DIKONFIRMASI'
        );

        // Schedule automatic update to DIKONFIRMASI after 7 days
        await this.scheduleAutomaticConfirmation(order.id, userId);

        return orderStatusResult;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to confirm order shipping');
    }
  }

  // Schedule automatic confirmation after 7 days
  
    public async processingOrder(order: any, userId: number) {
        try {
          return await prisma.$transaction(async (prisma) => {
            // Update payment status to COMPLETED
            await prisma.payment.update({
              where: { id: order.paymentId },
              data: { paymentStatus: PaymentStatus.COMPLETED },
            });
      
            // Update the order status to DIPROSES
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
            
      
            // Update the order status to DIPROSES
            const orderStatusResult = await OrderStatusService.updateOrderStatus(
              order.id,
              OrderStatus.DIKIRIM,
              userId,
              'Order processed and status updated to DIKIRIM'
            );
      
            return orderStatusResult;
          });
        } catch (err) {
          throw new HttpException(500, 'Failed to ship order');
        }
      }
      public async scheduleAutomaticConfirmation(orderId: number, userId: number) {
        const sevenDaysInMs = 0.2 * 24 * 60 * 60 * 1000;
    
        setTimeout(async () => {
          try {
            // Check if the current status is still 'DIKIRIM'
            const latestOrderStatus = await prisma.orderStatusUpdate.findFirst({
              where: {
                orderId,
                orderStatus: OrderStatus.DIKIRIM,
              },
              orderBy: { createdAt: 'desc' },
            });
    
            // If the order is still in 'DIKIRIM', update to 'DIKONFIRMASI'
            if (latestOrderStatus) {
              await OrderStatusService.updateOrderStatus(
                orderId,
                OrderStatus.DIKONFIRMASI,
                userId,
                'Order automatically confirmed after 7 days'
              );
              console.log(`Order ${orderId} status automatically updated to DIKONFIRMASI`);
            }
          } catch (err) {
            console.error(`Failed to automatically update order ${orderId} status:`, err);
          }
        }, sevenDaysInMs);
      }
    }
  


  export default new ShippingQuery()