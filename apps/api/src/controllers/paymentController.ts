import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import upload from '@/middlewares/multerConfig';
import { OrderStatusService } from '@/utils/orderStatusService'; 
import { OrderStatus } from '@prisma/client'; 
import paymentAction from '@/actions/paymentAction';

export class PaymentController {
    public async uploadPaymentProof(req: Request, res: Response, next: NextFunction): Promise<void> {
      upload.single('paymentProof')(req, res, async (err: any) => {
        if (err) {
          return next(new HttpException(500, 'Failed to upload payment proof', err.message));
        }
  
        try {
          const { orderId, userId } = req.body;
          
  
          if (!req.file) {
            throw new HttpException(400, 'No file uploaded');
          }
  
          const paymentProofPath = req.file.filename;
  
          const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId, 10) },
            include: { payment: true },
          });
  
          if (!order) {
            throw new HttpException(404, 'Order not found');
          }
  
          if (!order.payment) {
            throw new HttpException(404, 'Payment record not found');
          }
  
          const updatedPayment = await prisma.payment.update({
            where: { id: order.payment.id },
            data: { paymentProof: paymentProofPath },
          });
  
          const { updatedOrder, statusUpdate } = await OrderStatusService.updateOrderStatus(
            order.id,
            OrderStatus.MENUNGGU_KONFIRMASI_PEMBAYARAN,
            userId,
            'Payment proof uploaded and status updated to MENUNGGU_KONFIRMASI_PEMBAYARAN'
          );
  
          res.status(200).json({
            message: 'Payment proof uploaded, order status updated, and status history recorded successfully',
            data: { updatedPayment, updatedOrder, statusUpdate },
          });
        } catch (error) {
          next(new HttpException(500, 'Failed to update payment proof, order status, and status history'));
        }
      });
    }
    public async rejectPayment(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const { orderId, userId } = req.body;
        const orderIdInt = parseInt(orderId, 10);
        
        const result = await paymentAction.rejectPaymentAction(orderIdInt, userId);
    
        res.status(200).json({
          message: 'Order status updated to MENUNGGU_PEMBAYARAN',
          data: result,
        });
      } catch (err) {
        next(err);
      }
    }
  }
