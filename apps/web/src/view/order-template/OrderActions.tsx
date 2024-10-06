'use client';

import React, { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Order } from '@/types/paymentTypes';
import { getCookie } from 'cookies-next';

const OrderActions: React.FC<{ order: Order; userId: string; orderId: string; }> = ({ order, userId, orderId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = getCookie('access-token');

  const cancelOrder = async () => {
    if (!orderId) return;

    setIsLoading(true);

    try {
      await axiosInstance().post(`/orders/cancel`, {
        orderId: parseInt(orderId, 10),
        userId: parseInt(userId, 10),
      },
      {headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },});

      toast({
        variant: 'success',
        title: 'Order Cancelled',
        description: 'Your order has been successfully cancelled.',
      });
      window.location.reload();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to cancel order',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmShipping = async () => {
    if (!orderId) return;

    setIsLoading(true);

    try {
      await axiosInstance().post(`/shipping/confirm`, {
        orderId: parseInt(orderId, 10),
        userId: parseInt(userId, 10),
        
      },
    
      {headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }},);

      toast({
        variant: 'success',
        title: 'Shipping Confirmed',
        description: 'The shipping has been successfully confirmed.',
      });
      window.location.reload();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to confirm shipping',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {order.orderStatus === 'MENUNGGU_PEMBAYARAN' && (
        <div className="mt-4">
          <Button
            variant="destructive"
            onClick={cancelOrder}
            disabled={isLoading}
            className='text-xs md:text-lg'
          >
            Batalkan Pesanan
          </Button>
        </div>
      )}

      {order.orderStatus === 'DIKIRIM' && (
        <div className="mt-4">
          <Button
            onClick={confirmShipping}
            disabled={isLoading}
            className='text-xs md:text-lg bg-green-400'
          >
            Konfirmasi Pengiriman
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderActions;
