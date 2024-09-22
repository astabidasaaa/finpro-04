'use client';

import React, { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';

import { toast } from '@/components/ui/use-toast';
import { Order, OrderItem } from '@/types/paymentTypes';




  const OrderActions: React.FC<{ order: Order; userId: string; orderId: string; }> = ({ order, userId, orderId }) => {
    const [isLoading, setIsLoading] = useState(false);
  
    const updateOrderStatus = async (status: string) => {
      if (!orderId) return;
      setIsLoading(true);
  
      const endpoint = status === 'DIPROSES' 
        ? `/shipping/process-order`
        : `/shipping/shipping-order`;
  
      try {
        await axiosInstance().post(endpoint, {
          orderId: parseInt(orderId, 10), 
          userId: parseInt(userId, 10),
        });
  
        toast({
          variant: 'success',
          title: 'Order Status Updated',
          description: `Order status updated to ${status}.`,
        });
  
        // Reload the page after updating the status
        window.location.reload();
      } catch (error) {
        console.error(`Error updating order status to ${status}:`, error);
        toast({
          variant: 'destructive',
          title: `Failed to update status to ${status}`,
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    const cancelOrder = async () => {
      if (!orderId) return;
  
      setIsLoading(true);
  
      try {
        await axiosInstance().post(`/orders/cancel`, {
          orderId: parseInt(orderId, 10),
          userId: parseInt(userId, 10),
        });
  
        toast({
          variant: 'success',
          title: 'Order Cancelled',
          description: 'Your order has been successfully cancelled.',
        });
  
        // Reload the page after cancellation
        window.location.reload();
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to cancel order',
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    const rejectPayment = async () => {
      if (!orderId) return;
  
      setIsLoading(true);
  
      try {
        await axiosInstance().post(`/payments/reject-payment`, {
          orderId: parseInt(orderId, 10),
          userId: parseInt(userId, 10),
        });
  
        toast({
          variant: 'success',
          title: 'Payment Rejected',
          description: 'Payment has been successfully rejected.',
        });
  
        // Reload the page after rejecting payment
        window.location.reload();
      } catch (error) {
        console.error('Error rejecting payment:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to reject payment',
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
        <div className="mt-6">
          {['MENUNGGU_PEMBAYARAN', 'DIPROSES'].includes(order.orderStatus) && (
            <div className="text-xs md:text-lg">
              <Button
                variant="destructive"
                onClick={cancelOrder}
                disabled={isLoading}
              >
                Batalkan Pesanan
              </Button>
            </div>
          )}
    
          {order.orderStatus === 'MENUNGGU_KONFIRMASI_PEMBAYARAN' && (
            <div className="flex gap-2">
              <Button
                onClick={() => updateOrderStatus('DIPROSES')}
                disabled={isLoading}
                className='text-xs md:text-lg bg-green-400'
              >
                Proses Pesanan
              </Button>
              <Button
                variant="destructive"
                onClick={rejectPayment}
                className='text-xs md:text-lg'
              >
                Tolak Pembayaran
              </Button>
            </div>
          )}
    
          {order.orderStatus === 'DIPROSES' && (
            <div className="text-xs md:text-lg">
              <Button
                onClick={() => updateOrderStatus('DIKIRIM')}
                disabled={isLoading}
                className='bg-green-400 text-xs md:text-lg'
              >
                Kirim Pesanan
              </Button>
            </div>
          )}
        </div>
      );
    };
  
  export default OrderActions;
