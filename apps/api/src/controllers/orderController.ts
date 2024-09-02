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
    console.log('Received request data:', req.body);
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
      console.log('Delivery Address:', deliveryAddress);

      if (!deliveryAddress) {
        throw new HttpException(404, 'Delivery address not found');
      }

      // Find the nearest store
      const nearestStore = await findNearestStore(
        deliveryAddress.latitude,
        deliveryAddress.longitude
      );
      console.log('Nearest Store:', nearestStore);

      // Validate inventory for all items
      for (const item of cartItems) {
        const inventory = await checkInventoryAvailability(
          nearestStore.storeId,
          item.productId,
          item.qty, 
          
        );
        console.log(`Inventory for Product ID ${item.productId}:`, inventory);

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
        data: {
          orderId: result.id,
          ...result, // Include other fields if necessary
        },
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
  public async getAddressesByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.query.userId as string;
      const userIdInt = parseInt(userId, 10);

      if (isNaN(userIdInt)) {
        throw new HttpException(400, 'Invalid userId format');
      }

      const addresses = await prisma.address.findMany({
        where: {
          userId: userIdInt,
          deleted: false,
        },
        select: {
          id: true,
          address: true,
          zipCode: true,
          latitude: true,
          longitude: true,
          isMain: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          isMain: 'desc', // Main address first
        },
      });

      if (!addresses || addresses.length === 0) {
        throw new HttpException(404, 'No addresses found for the specified user');
      }

      res.status(200).json({
        message: 'Addresses retrieved successfully',
        data: addresses,
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to retrieve addresses', err.message));
      } else {
        next(new HttpException(500, 'Failed to retrieve addresses', 'An unknown error occurred'));
      }
    }
  }
  public async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await prisma.$transaction(async (prisma) => {
        const productList = await prisma.product.findMany({
          include: {
            creator: true,
            prices: {
              where: {
                active: true,
              },
              select: {
                price: true,
              },
            },
            images: true,
            inventories: true,
            brand: true,
            subcategory: true,
            orderItems: true,
          },
        });
  
        if (productList.length === 0) {
          throw new HttpException(404, 'No products found');
        }
  
        return productList;
      });
  
      res.status(200).json({
        message: 'All products retrieved successfully',
        data: products,
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to retrieve all products', err.message));
      } else {
        next(new HttpException(500, 'Failed to retrieve all products', 'An unknown error occurred'));
      }
    }
  }
  
  public async getAllOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orders = await prisma.$transaction(async (prisma) => {
        const orderList = await prisma.order.findMany({
          include: {
            orderItems: true,  // Include order items related to the order
            payment: true,     // Include payment details
            shipping: true,    // Include shipping details if any
            orderStatusUpdates: true,  // Include status update history
          },
        });
  
        if (orderList.length === 0) {
          throw new HttpException(404, 'No orders found');
        }
  
        return orderList;
      });
  
      res.status(200).json({
        message: 'All orders retrieved successfully',
        data: orders,
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to retrieve all orders', err.message));
      } else {
        next(new HttpException(500, 'Failed to retrieve all orders', 'An unknown error occurred'));
      }
    }
  }
  public async getOrdersByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extracting 'customerId' from the query parameters, since the API is sending 'customerId'
      const customerIdStr = req.query.customerId as string;
      const customerId = parseInt(customerIdStr, 10);
  
      if (isNaN(customerId)) {
        throw new HttpException(400, 'Invalid customerId format');
      }
  
      const orders = await prisma.$transaction(async (prisma) => {
        const orderList = await prisma.order.findMany({
          where: {
            customerId, // Filtering by customerId, which corresponds to the user
          },
          include: {
            orderItems: true,  // Include order items related to the order
            payment: true,     // Include payment details
            shipping: true,    // Include shipping details if any
            orderStatusUpdates: true,  // Include status update history
          },
        });
  
        if (orderList.length === 0) {
          throw new HttpException(404, 'No orders found for the specified user');
        }
  
        return orderList;
      });
  
      res.status(200).json({
        message: 'Orders retrieved successfully',
        data: orders,
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to retrieve orders by user ID', err.message));
      } else {
        next(new HttpException(500, 'Failed to retrieve orders by user ID', 'An unknown error occurred'));
      }
    }
  }
  public async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extracting 'orderId' from the query parameters
      const orderIdStr = req.query.orderId as string;
      const orderId = parseInt(orderIdStr, 10);

      if (isNaN(orderId)) {
        throw new HttpException(400, 'Invalid orderId format');
      }

      const order = await prisma.$transaction(async (prisma) => {
        const orderData = await prisma.order.findUnique({
          where: {
            id: orderId, // Filtering by orderId
          },
          include: {
            orderItems: true,  // Include order items related to the order
            payment: true,     // Include payment details
            shipping: true,    // Include shipping details if any
            orderStatusUpdates: true,  // Include status update history
          },
        });

        if (!orderData) {
          throw new HttpException(404, 'Order not found');
        }

        return orderData;
      });

      res.status(200).json({
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to retrieve order by ID', err.message));
      } else {
        next(new HttpException(500, 'Failed to retrieve order by ID', 'An unknown error occurred'));
      }
    }
  }
  public async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Convert productId from string to number if necessary
    const productId = parseInt(req.params.productId, 10);
  
    if (isNaN(productId)) {
      return next(new HttpException(400, 'Invalid product ID format'));
    }
  
    try {
      const product = await prisma.$transaction(async (prisma) => {
        const productDetail = await prisma.product.findUnique({
          where: {
            id: productId,  // Now productId is a number
          },
          include: {
            creator: true,
            prices: true,
            images: true,
            inventories: true,
            brand: true,
            subcategory: true,
            orderItems: true,
          },
        });
  
        if (!productDetail) {
          throw new HttpException(404, 'Product not found');
        }
  
        const productPrice = productDetail.prices.length > 0 ? productDetail.prices[0].price : null;

        return {
          ...productDetail,
          price: productPrice, // Include the price in the response
        };
      });
  
      res.status(200).json({
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to retrieve product', err.message));
      } else {
        next(new HttpException(500, 'Failed to retrieve product', 'An unknown error occurred'));
      }
    }
  }
  public async findNearestStore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { deliveryLatitude, deliveryLongitude } = req.body;

      if (!deliveryLatitude || !deliveryLongitude) {
        throw new HttpException(400, 'Missing delivery latitude or longitude');
      }

      const nearestStore = await findNearestStore(deliveryLatitude, deliveryLongitude);

      res.status(200).json({
        message: 'Nearest store found successfully',
        data: nearestStore,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        next(err);
      } else if (err instanceof Error) {
        next(new HttpException(500, 'Failed to find nearest store', err.message));
      } else {
        next(new HttpException(500, 'Failed to find nearest store', 'An unknown error occurred'));
      }
    }
  }
  public async checkInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, items } = req.body;
  
      console.log('Request body:', req.body); // Log request data
  
      if (!storeId || !items || !Array.isArray(items)) {
        throw new HttpException(400, 'Invalid request data');
      }
  
      // Check inventory availability for each item
      const inventoryChecks = await Promise.all(
        items.map(async (item: { productId: number, qtyRequired: number }) => {
          console.log(`Checking inventory for Store ID: ${storeId}, Product ID: ${item.productId}, Quantity Required: ${item.qtyRequired}`);
          const isAvailable = await checkInventoryAvailability(storeId, item.productId, item.qtyRequired);
          return {
            productId: item.productId,
            isAvailable,
          };
        })
      );
  
      console.log('Inventory check results:', inventoryChecks); // Log results
  
      res.status(200).json({
        message: 'Inventory check completed',
        data: inventoryChecks,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        next(err);
      } else if (err instanceof Error) {
        next(new HttpException(500, 'Failed to check inventory', err.message));
      } else {
        next(new HttpException(500, 'Failed to check inventory', 'An unknown error occurred'));
      }
    }
  }
}
