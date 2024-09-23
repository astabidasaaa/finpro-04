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
import productDetailQuery from '@/queries/productDetailQuery';
import { handleStockAndMutations } from '@/utils/stockAndMutations';

type Voucher = {
  id: number; // Assuming ID is a number
  type: 'DELIVERY' | 'TRANSACTION'; // Adjust based on your application
};
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
        vouchers,
        cartItems, // Array of items in the cart [{ productId, qty }]
      } = req.body;

      console.log('cart items:', cartItems)

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

      const validatedVouchers = await Promise.all(
        vouchers.map(async (voucher: Voucher) => {
          const { id } = voucher; // Extract ID from the voucher object
          const existingVoucher = await prisma.voucher.findUnique({
            where: { id },
            select: { status: true, expiredAt: true },
          });
  
          if (!existingVoucher) {
            throw new HttpException(404, `Voucher with ID ${id} not found`);
          }
  
          if (existingVoucher.status !== 'UNUSED') {
            throw new HttpException(400, `Voucher with ID ${id} is not valid for use`);
          }
  
          const now = new Date();
          if (existingVoucher.expiredAt <= now) {
            throw new HttpException(400, `Voucher with ID ${id} is expired`);
          }
  
          return id; // Return valid voucher ID
        })
      );

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
        await prisma.orderStatusUpdate.create({
          data: {
            userId: customerId,
            orderId: newOrder.id,
            orderStatus: OrderStatus.MENUNGGU_PEMBAYARAN,
            description: 'Order created, awaiting payment.',
          },
        });

        await Promise.all(
          validatedVouchers.map((id) => {
            return prisma.voucher.update({
              where: { id },
              data: {
                status: 'USED',
                orderId: newOrder.id, // Link the order ID to the voucher
              },
            });
          })
        );

        // Create order items and update inventory
        for (const item of cartItems) {
          // Fetch the active product price, discount, and free product details
          const inventoryProduct = await productDetailQuery.getProductByIdAndStoreId(
            item.productId,
            nearestStore.storeId
          );
  
          if (!inventoryProduct) {
            throw new HttpException(404, 'Product not found');
          }
  
          // Validate the free product promotion
          let freeProductPromotion = null;
          if (inventoryProduct.freeProductPerStores.length > 0) {
            const freeProduct = inventoryProduct.freeProductPerStores[0];
            if (item.qty >= freeProduct.buy) {
              // Calculate free products based on the buy/get promotion
              const setsOfBuy = Math.floor(item.qty / freeProduct.buy);
              freeProductPromotion = setsOfBuy * freeProduct.get;
            }
          }
  
          // Validate product discounts
          let discountAmount = 0;
          if (inventoryProduct.productDiscountPerStores.length > 0) {
            const discount = inventoryProduct.productDiscountPerStores[0];
            if (discount.discountType === 'PERCENT') {
              discountAmount = (inventoryProduct.product.prices[0].price * discount.discountValue) / 100;
            } else if (discount.discountType === 'FLAT') {
              discountAmount = discount.discountValue;
            }
          }
  
          // Final price calculation
          const productPrice = inventoryProduct.product.prices[0].price;
          const finalPrice = productPrice - discountAmount;
  
          // Create the order item
          await prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              qty: item.qty,
              price: productPrice,
              productDiscountPerStoreId: inventoryProduct.productDiscountPerStores.length > 0
              ? inventoryProduct.productDiscountPerStores[0].id
              : null,
            freeProductPerStoreId: inventoryProduct.freeProductPerStores.length > 0
              ? inventoryProduct.freeProductPerStores[0].id
              : null,
              finalPrice: finalPrice,
            },
          });         
        }

        // Handle stock deduction and free product inventory updates
        await handleStockAndMutations(
          cartItems,
          deliveryAddress,
          nearestStore.storeId,
          newOrder.id,
          customerId
        );
  
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
      const result = await OrderAction.cancelOrderAction(orderId, userId);

      res.status(200).json({
        message: 'Order cancelled successfully',
        data: result,
      });
    } catch (err) {
      next(err);
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
