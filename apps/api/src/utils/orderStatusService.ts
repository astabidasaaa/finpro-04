import prisma from '@/prisma';
import { OrderStatus} from '@prisma/client';
import { HttpException } from '@/errors/httpException';
import voucherAction from '@/actions/voucherAction';
import promotionQuery from '@/queries/promotionQuery';
import OrderAction from '@/actions/orderAction';

export class OrderStatusService {
  public static async updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
    userId?: number,
    description?: string
  ) {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: newStatus },
        });
        const statusUpdate = await prisma.orderStatusUpdate.create({
          data: {
            userId: userId ? parseInt(userId.toString(), 10) : null,
            orderId: orderId,
            orderStatus: newStatus,
            description: description || `Order status updated to ${newStatus}`,
          },
        });


        if (newStatus === 'DIKONFIRMASI') {
          await OrderStatusService.checkAndCreateVoucherForGeneralPromotions(orderId);
        }

        if (newStatus === 'MENUNGGU_PEMBAYARAN') {
          const createdAt = statusUpdate.createdAt; 
          const cancelTime = new Date(createdAt.getTime() + 3600000);

          setTimeout(async () => {
            const currentOrder = await prisma.order.findUnique({ where: { id: orderId } });
            if (currentOrder?.orderStatus === 'MENUNGGU_PEMBAYARAN') {
            
              if (userId !== undefined) {
                await OrderAction.cancelOrderAction(orderId, userId);
              } else {
                console.error(`User ID is undefined for order ID: ${orderId}`);
              }
            }
          }, cancelTime.getTime() - Date.now()); 
        }

        return { updatedOrder, statusUpdate };
      });

      return result;
    } catch (error) {
      throw new HttpException(500, `Failed to update order status to ${newStatus}`);
    }
  }


  private static async checkAndCreateVoucherForGeneralPromotions(orderId: number) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { customer: true },
      });
  
      if (!order) {
        throw new HttpException(404, 'Order not found');
      }
  
      const customerId = order.customerId;
      const purchasePromotions = await promotionQuery.getActiveGeneralPromotionBySource('AFTER_MIN_PURCHASE');
      const transactionPromotions = await promotionQuery.getActiveGeneralPromotionBySource('AFTER_MIN_TRANSACTION');
  
      for (const promotion of purchasePromotions) {
        if (promotion.afterMinPurchase && order.finalPrice >= promotion.afterMinPurchase) {
          const existingVoucher = await prisma.voucher.findFirst({
            where: {
              promotionId: promotion.id,
              customerId: customerId,
            },
          });
  
          if (!existingVoucher) {
            await voucherAction.createVoucher(promotion.id, customerId);
          }
        }
      }
  
      for (const promotion of transactionPromotions) {
        if (promotion.afterMinTransaction) {
          const customerOrderCount = await prisma.orderStatusUpdate.count({
            where: {
              order: { customerId },
              orderStatus: 'DIKONFIRMASI',
              createdAt: { gte: promotion.createdAt },
            },
          });


  
          if (customerOrderCount === promotion.afterMinTransaction -1) {
            const existingVoucher = await prisma.voucher.findFirst({
              where: {
                promotionId: promotion.id,
                customerId: customerId,
              },
            });
  
            if (!existingVoucher) {
              await voucherAction.createVoucher(promotion.id, customerId);
            } 
          }
        }
      }
    } catch (err) {
      console.error(err);
      throw new HttpException(500, 'Failed to check and create voucher for promotions');
    }
  }
  
}
