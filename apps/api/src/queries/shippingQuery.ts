import prisma from '@/prisma'; 
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { OrderStatusService } from '@/utils/orderStatusService';
import { HttpException } from '@/errors/httpException';

import { updateInventoryStock } from '@/utils/updateInventoryStock';


class ShippingQuery {
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
            // Retrieve order items
            const orderItems = await prisma.orderItem.findMany({
              where: { orderId: order.id },
            });
      
            // Update inventory for each item (decrease stock)
            for (const item of orderItems) {
              const inventoryUpdated = await updateInventoryStock(
                order.storeId,
                item.productId,
                -item.qty, // Decrease the stock
                order.id,
                order.customerId
              );
      
              if (!inventoryUpdated) {
                throw new HttpException(
                  500,
                  `Failed to update stock for product ID: ${item.productId}`
                );
              }
            }
      
            // Update the order status to DIKIRIM
            const orderStatusResult = await OrderStatusService.updateOrderStatus(
              order.id,
              OrderStatus.DIKIRIM,
              userId,
              'Order shipped and status updated to DIKIRIM'
            );
      
            return orderStatusResult;
          });
        } catch (err) {
          throw new HttpException(500, 'Failed to ship order');
        }
      }
      
  }


  export default new ShippingQuery()