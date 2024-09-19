import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma'; 
import { OrderStatus, PaymentStatus } from '@prisma/client';
import OrderAction from '@/actions/orderAction';
import { HttpException } from '@/errors/httpException';
import { generateOrderCode } from '@/utils/orderUtils';
import { updateInventoryStock } from '@/utils/updateInventoryStock';
import { findNearestStore } from '@/utils/findNearestStore';
import { checkInventoryAvailability } from '@/utils/checkInventory';
import orderAction from '@/actions/orderAction';
import { generateRandomTrackingCode } from '@/utils/generateRandomTrackingCode';
import { handleStockAndMutations } from '@/utils/stockAndMutations';


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
        shippingAmount, // New field for shipping amount
        courier,
        additionalInfo,
        cartItems, // Array of items in the cart [{ productId, qty }]
      } = req.body;

      const deliveryAddress = await prisma.address.findUnique({
        where: { id: deliveryAddressId },
        select: { latitude: true, longitude: true },
      });
  

      if (!deliveryAddress) {
        throw new HttpException(404, 'Delivery address not found');
      }

      // Find the nearest store
      const nearestStore = await findNearestStore(
        deliveryAddress.latitude,
        deliveryAddress.longitude
      );
      console.log('Nearest Store Distance:', nearestStore.distance);

      // if (nearestStore.distance > 30) {
      //       throw new HttpException(
      //         500,
      //         `Jarak toko terlalu jauh dari alamat Anda, silahkan pilih alamat yang lain.`
      //       );
      //     }

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

        const trackingNumber = generateRandomTrackingCode();

        const newShipping = await prisma.shipping.create({
          data: {
            amount: shippingAmount, // Use shipping amount from request body
            courier, // Use courier from request body
            trackingNumber, // Randomly generated tracking code
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
            shippingId: newShipping.id,
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
          // const inventoryUpdated = await updateInventoryStock(
          //   nearestStore.storeId,
          //   item.productId,
          //   -item.qty,
          //   newOrder.id,
          //   customerId
          // );
  
          // if (!inventoryUpdated) {
          //   throw new HttpException(
          //     500,
          //     `Failed to update stock for product ID: ${item.productId}`
          //   );
          // }
        }

        return newOrder;
        
      });
      await handleStockAndMutations(
        cartItems,
        deliveryAddress,
        nearestStore.storeId,
        result.id,
        customerId
      );

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
      const result = await OrderAction.cancelOrderAction(orderId, userId);

      res.status(200).json({
        message: 'Order cancelled successfully',
        data: result,
      });
    } catch (err) {
      next(err);
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
      const { addressId } = req.body;
  
      if (!addressId) {
        throw new HttpException(400, 'Missing address ID');
      }
  
      // Fetch the address using the addressId
      const address = await prisma.address.findUnique({
        where: { id: addressId },
        select: { latitude: true, longitude: true },
      });
  
      if (!address) {
        throw new HttpException(404, 'Address not found');
      }
  
      const nearestStore = await findNearestStore(
        address.latitude,
        address.longitude
      );
  
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
  public async getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userIdStr = req.query.userId as string;

    

    const user = await orderAction.getUserAction(userIdStr);

    res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

}
