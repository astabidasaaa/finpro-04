import prisma from '@/prisma';
import { OrderStatus} from '@prisma/client';
import { HttpException } from '@/errors/httpException';
import voucherAction from '@/actions/voucherAction';
import promotionQuery from '@/queries/promotionQuery';

export class OrderStatusService {
  public static async updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
    userId?: number,
    description?: string
  ) {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        // 1. Update the order status
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: newStatus },
        });

        // 2. Record the status update in the history table
        const statusUpdate = await prisma.orderStatusUpdate.create({
          data: {
            userId: userId ? parseInt(userId.toString(), 10) : null,
            orderId: orderId,
            orderStatus: newStatus,
            description: description || `Order status updated to ${newStatus}`,
          },
        });

        // 3. Check if the status is 'DIKONFIRMASI' to trigger promotion validation and voucher creation
        if (newStatus === 'DIKONFIRMASI') {
          await OrderStatusService.checkAndCreateVoucherForGeneralPromotions(orderId);
        }

        return { updatedOrder, statusUpdate };
      });

      return result;
    } catch (error) {
      throw new HttpException(500, `Failed to update order status to ${newStatus}`);
    }
  }

  // New method to check for general promotions and create vouchers if applicable
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
  
      // Check for purchase promotions
      for (const promotion of purchasePromotions) {
        if (promotion.afterMinPurchase && order.finalPrice >= promotion.afterMinPurchase) {
          const existingVoucher = await prisma.voucher.findFirst({
            where: {
              promotionId: promotion.id,
              customerId: customerId,
            },
          });
  
          if (!existingVoucher) {
            console.log(`Creating voucher for purchase promotion ID: ${promotion.id}`);
            await voucherAction.createVoucher(promotion.id, customerId);
          } else {
            console.log(`Voucher already exists for promotion ID: ${promotion.id}`);
          }
        }
      }
  
      // Check for transaction promotions
      for (const promotion of transactionPromotions) {
        if (promotion.afterMinTransaction) {
          const customerOrderCount = await prisma.orderStatusUpdate.count({
            where: {
              order: { customerId },
              orderStatus: 'DIKONFIRMASI',
              createdAt: { gte: promotion.createdAt },
            },
          });
          console.log(`Customer order count for promotion ID ${promotion.id}: ${customerOrderCount}`);

  
          if (customerOrderCount >= promotion.afterMinTransaction) {
            const existingVoucher = await prisma.voucher.findFirst({
              where: {
                promotionId: promotion.id,
                customerId: customerId,
              },
            });
  
            if (!existingVoucher) {
              console.log(`Creating voucher for transaction promotion ID: ${promotion.id}`);
              await voucherAction.createVoucher(promotion.id, customerId);
            } else {
              console.log(`Voucher already exists for promotion ID: ${promotion.id}`);
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
