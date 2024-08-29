import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma'; 
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { OrderStatusService } from '@/utils/orderStatusService';
import { HttpException } from '@/errors/httpException';
import { generateOrderCode } from '@/utils/orderUtils';
import { findNearestStore, checkInventoryAvailability, updateInventoryStock } from '@/actions/orderActions';

export class OrderController {
  public async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        customerId,
        price,
        finalPrice,
        paymentGateway,
        deliveryAddressId,
        orderStatus,
        shippingId,
        additionalInfo,
        cartItems, // Array of items in the cart [{ productId, qty }]
      } = req.body;

      const deliveryAddress = await prisma.address.findUnique({
        where: { id: deliveryAddressId },
      });

      if (!deliveryAddress) {
        throw new HttpException(404, 'Delivery address not found');
      }

      // Find the nearest store
      const nearestStore = await findNearestStore(
        deliveryAddress.latitude,
        deliveryAddress.longitude
      );

      // Validate inventory for all items
      for (const item of cartItems) {
        const inventory = await checkInventoryAvailability(
          nearestStore.storeId,
          item.productId,
          item.qty, 
          
        );

        if (!inventory) {
          throw new HttpException(
            400,
            `Insufficient stock or product not available in the store for product ID: ${item.productId}`
          );
        }
      }

      // Process order if all items are valid
      const result = await prisma.$transaction(async (prisma) => {
        // Generate order code
        const orderCode = generateOrderCode();

        // Create a new payment record
        const newPayment = await prisma.payment.create({
          data: {
            paymentStatus: PaymentStatus.PENDING,
            paymentGateway,
            amount: finalPrice,
            additionalInfo,
          },
        });

        // Create the order
        const newOrder = await prisma.order.create({
          data: {
            customerId,
            storeId: nearestStore.storeId,
            orderCode,
            price,
            finalPrice,
            paymentId: newPayment.id,
            shippingId: shippingId || null,
            deliveryAddressId,
            orderStatus: orderStatus as OrderStatus,
            storeAddressId: nearestStore.storeAddressId,
          },
        });

        // Create order items and update inventory
        for (const item of cartItems) {
          // Fetch the active product price from ProductPriceHistory
          const productPriceHistory = await prisma.productPriceHistory.findFirst({
            where: {
              productId: item.productId,
              active: true,
            },
            orderBy: {
              startDate: 'desc',
            },
          });

          if (!productPriceHistory) {
            throw new HttpException(404, 'Active price not found for the product');
          }

          // Create the order item
          await prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              qty: item.qty,
              price: productPriceHistory.price,
              finalPrice: productPriceHistory.price, // Final price is the active price
            },
          });
          const inventoryUpdated = await updateInventoryStock(
            nearestStore.storeId,
            item.productId,
            -item.qty,
            newOrder.id,
            customerId
          );
  
          if (!inventoryUpdated) {
            throw new HttpException(
              500,
              `Failed to update stock for product ID: ${item.productId}`
            );
          }
        }

        return newOrder;
      });

      res.status(201).json({
        message: 'Order created successfully',
        data: result,
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to create order', err.message));
      } else {
        next(new HttpException(500, 'Failed to create order', 'An unknown error occurred'));
      }
    }
  }


  public async cancelOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { orderId, userId } = req.body;
      const orderIdInt = parseInt(orderId, 10);

      if (isNaN(orderIdInt)) {
        throw new HttpException(400, 'Invalid orderId format');
      }

      const result = await prisma.$transaction(async (prisma) => {
        const order = await prisma.order.findUnique({
          where: { id: orderIdInt },
        });

        if (!order) {
          throw new HttpException(404, 'Order not found');
        }

        const orderItems = await prisma.orderItem.findMany({
          where: { orderId: orderIdInt },
        });

        for (const item of orderItems) {
          const inventoryUpdate = await updateInventoryStock(
            order.storeId,
            item.productId,
            item.qty,
            orderIdInt,
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
          orderIdInt,
          OrderStatus.DIBATALKAN,
          userId, 
          'Order cancelled and status updated to DIBATALKAN'
        );

        return orderStatusResult;
      });

      res.status(200).json({
        message: 'Order cancelled successfully',
        data: result,
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to cancel order', err.message));
      } else {
        next(new HttpException(500, 'Failed to cancel order', 'An unknown error occurred'));
      }
    }
  }
}
