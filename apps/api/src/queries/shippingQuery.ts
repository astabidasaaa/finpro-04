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

      
            return orderStatusResult;
          });
        } catch (err) {
          throw new HttpException(500, 'Failed to ship order');
        }
      }
    }
  


  export default new ShippingQuery()