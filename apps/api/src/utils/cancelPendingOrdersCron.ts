import cron from 'node-cron';
import prisma from '@/prisma';   
import { OrderStatus } from '@prisma/client';
import orderAction from '@/actions/orderAction';
import shippingAction from '@/actions/shippingAction';


const getSystemUserId = async (): Promise<number> => {
  try {
    const systemUser = await prisma.user.findFirst({
      where: {
        roleId: 3,  
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!systemUser) {
      throw new Error('System user not found');
    }

    return systemUser.id; 
  } catch (error) {
    throw new Error('Failed to fetch system user');
  }
};


export const cancelPendingOrdersCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const SYSTEM_USER_ID = await getSystemUserId();
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const pendingOrders = await prisma.order.findMany({
        where: {
          orderStatus: OrderStatus.MENUNGGU_PEMBAYARAN,
          createdAt: {
            lte: oneHourAgo,  
          },
        },
      });


      for (const order of pendingOrders) {
        try {
          await orderAction.cancelOrderAction(order.id, SYSTEM_USER_ID);
        } catch (error) {

        }
      }
    } catch (error) {
    }
  });
};

export const confirmShippedOrdersCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const SYSTEM_USER_ID = await getSystemUserId();
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); 


      const shippedOrders = await prisma.order.findMany({
        where: {
          orderStatus: OrderStatus.DIKIRIM,
          updatedAt: {
            lte: sevenDaysAgo, 
          },
        },
      });


      for (const order of shippedOrders) {
        try {

          await shippingAction.confirmShippingAction(order.id, SYSTEM_USER_ID);  
        } catch (error) {
        }
      }
    } catch (error) {

    }
  });
};

