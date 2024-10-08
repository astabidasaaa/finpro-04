
import prisma from '@/prisma'; 
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { OrderStatusService } from '@/utils/orderStatusService';
import { HttpException } from '@/errors/httpException';



class PaymentQuery {

    public async rejectPayment(order: any, userId: number) {
        try {
          return await prisma.$transaction(async (prisma) => {
            const orderStatusResult = await OrderStatusService.updateOrderStatus(
              order.id,
              OrderStatus.MENUNGGU_PEMBAYARAN,
              userId,
              'Order status updated to MENUNGGU_PEMBAYARAN'
            );
      
            return orderStatusResult;
          });
        } catch (err) {
          throw new HttpException(500, 'Failed to update order status');
        }
      }
}

export default new PaymentQuery();