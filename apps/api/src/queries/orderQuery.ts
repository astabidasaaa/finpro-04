
import prisma from '@/prisma'; 
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { OrderStatusService } from '@/utils/orderStatusService';
import { HttpException } from '@/errors/httpException';

import { updateInventoryStock } from '@/utils/updateInventoryStock';


class OrderQuery {
    
  
  public async cancelOrderTransaction(order: any, userId: number) {
    try {
      return await prisma.$transaction(async (prisma) => {
        const orderItems = await prisma.orderItem.findMany({
          where: { orderId: order.id },
          include: {
            freeProductPerStore: true,  
          },
        });
  
        for (const item of orderItems) {
          let quantityToRestore = item.qty;
  
          if (item.freeProductPerStore) {
            const { buy, get } = item.freeProductPerStore;
            const multiplier = Math.floor(item.qty / buy); 
            quantityToRestore += multiplier * get; 
          }
  
          const inventoryUpdate = await updateInventoryStock(
            order.storeId,
            item.productId,
            quantityToRestore, 
            order.id,
            order.customerId
          );
  
          if (!inventoryUpdate) {
            throw new HttpException(400, `Failed to restore stock for product ID: ${item.productId}`);
          }
        }
  
        await prisma.payment.update({
          where: { id: order.paymentId },
          data: { paymentStatus: PaymentStatus.FAILED },
        });
  
        const orderStatusResult = await OrderStatusService.updateOrderStatus(
          order.id,
          OrderStatus.DIBATALKAN,
          userId,
          'Order cancelled and status updated to DIBATALKAN'
        );
  
        return orderStatusResult;
      });
    } catch (err) {
      throw new HttpException(500, 'Failed to cancel order');
    }
  }
  
    public async getUserById(userId: number) {
      try {
        return await prisma.$transaction(async (prisma) => {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              store: true,
              orders: true,
            },
          });
    
          return user;
        });
      } catch (err) {
        throw new HttpException(500, 'Failed to retrieve user from the database');
      }
    }
    
  }
  
  export default new OrderQuery();