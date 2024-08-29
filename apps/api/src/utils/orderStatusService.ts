import prisma from '@/prisma';
import { OrderStatus} from '@prisma/client';
import { HttpException } from '@/errors/httpException';

export class OrderStatusService {
  public static async updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus,
    userId?: number,
    description?: string
  ) {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        // Update the order status
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: newStatus },
        });

        // Record the status update in the history table
        const statusUpdate = await prisma.orderStatusUpdate.create({
          data: {
            userId: userId ? parseInt(userId.toString(), 10) : null,
            orderId: orderId,
            orderStatus: newStatus,
            description: description || `Order status updated to ${newStatus}`,
          },
        });

        return { updatedOrder, statusUpdate };
      });

      return result;
    } catch (error) {
      throw new HttpException(500, `Failed to update order status to ${newStatus}`);
    }
  }
}
