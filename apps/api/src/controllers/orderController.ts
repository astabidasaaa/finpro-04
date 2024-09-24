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
  id: number; 
  type: 'DELIVERY' | 'TRANSACTION';
};
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
        shippingAmount, 
        courier,
        additionalInfo,
        vouchers,
        cartItems, 
      } = req.body;

      const deliveryAddress = await prisma.address.findUnique({
        where: { id: deliveryAddressId },
        select: { latitude: true, longitude: true },
      });

      if (!deliveryAddress) {
        throw new HttpException(404, 'Delivery address not found');
      }
      const nearestStore = await findNearestStore(
        deliveryAddress.latitude,
        deliveryAddress.longitude
      );

      if (nearestStore.distance > 30) {
            throw new HttpException(
              500,
              `Jarak toko terlalu jauh dari alamat Anda, silahkan pilih alamat yang lain.`
            );
          }

      const validatedVouchers = await Promise.all(
        vouchers.map(async (voucher: Voucher) => {
          const { id } = voucher;
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
  
          return id;
        })
      );

      const result = await prisma.$transaction(async (prisma) => {
        const orderCode = generateOrderCode();
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
            amount: shippingAmount, 
            courier, 
            trackingNumber,
          },
        });
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
                orderId: newOrder.id,
              },
            });
          })
        );


        for (const item of cartItems) {
          const inventoryProduct = await productDetailQuery.getProductByIdAndStoreId(
            item.productId,
            nearestStore.storeId
          );
  
          if (!inventoryProduct) {
            throw new HttpException(404, 'Product not found');
          }
          let freeProductPromotion = null;
          if (inventoryProduct.freeProductPerStores.length > 0) {
            const freeProduct = inventoryProduct.freeProductPerStores[0];
            if (item.qty >= freeProduct.buy) {
              const setsOfBuy = Math.floor(item.qty / freeProduct.buy);
              freeProductPromotion = setsOfBuy * freeProduct.get;
            }
          }
          let discountAmount = 0;
          if (inventoryProduct.productDiscountPerStores.length > 0) {
            const discount = inventoryProduct.productDiscountPerStores[0];
            if (discount.discountType === 'PERCENT') {
              discountAmount = (inventoryProduct.product.prices[0].price * discount.discountValue) / 100;
            } else if (discount.discountType === 'FLAT') {
              discountAmount = discount.discountValue;
            }
          }
          const productPrice = inventoryProduct.product.prices[0].price;
          const finalPrice = productPrice - discountAmount;
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
          ...result, 
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        next(new HttpException(500, 'Failed to create order', err.message));
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
      } 
    }
  }
  public async checkInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId, items } = req.body;
  
      if (!storeId || !items || !Array.isArray(items)) {
        throw new HttpException(400, 'Invalid request data');
      }
      const inventoryChecks = await Promise.all(
        items.map(async (item: { productId: number, qtyRequired: number }) => {
          const isAvailable = await checkInventoryAvailability(storeId, item.productId, item.qtyRequired);
          return {
            productId: item.productId,
            isAvailable,
          };
        })
      );
  
      res.status(200).json({
        message: 'Inventory check completed',
        data: inventoryChecks,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        next(err);
      } else if (err instanceof Error) {
        next(new HttpException(500, 'Failed to check inventory', err.message));
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
