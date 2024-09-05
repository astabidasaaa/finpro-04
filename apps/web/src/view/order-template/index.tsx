'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Payment = {
  amount: number;
  paymentStatus: string;
  paymentGateway: string;
};

type Order = {
  id: string;
  orderCode: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  payment: Payment;
};

const OrderDetailsView: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);
  const userId = user.id.toString();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      setIsLoading(true);

      try {
        const response = await axiosInstance().get(`/orders/get-order-by-id`, {
          params: { orderId: parseInt(orderId as string, 10) },
        });

        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to fetch order details',
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const cancelOrder = async () => {
    if (!orderId) return;

    setIsLoading(true);

    try {
      await axiosInstance().post(`/orders/cancel`, {
        orderId: parseInt(orderId as string, 10),
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

  const confirmShipping = async () => {
    if (!orderId) return;

    setIsLoading(true);

    try {
      await axiosInstance().post(`/shipping/confirm`, {
        orderId: parseInt(orderId as string, 10),
        userId: parseInt(userId, 10),
      });

      toast({
        variant: 'success',
        title: 'Shipping Confirmed',
        description: 'The shipping has been successfully confirmed.',
      });

      // Reload the page after confirmation
      window.location.reload();
    } catch (error) {
      console.error('Error confirming shipping:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to confirm shipping',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>No order found.</p>;
  }

  return (
    <div className="container px-4 md:px-12 lg:px-24 max-w-screen-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      <div className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow">
        <p className="text-lg font-medium text-blue-600">Order ID: {order.orderCode}</p>
        <hr className="my-2 border-gray-300" />
        <p className="text-sm text-gray-600">Status: {order.orderStatus}</p>
        <p className="text-sm text-gray-600">Total Amount: Rp{order.payment.amount.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Payment Status: {order.payment.paymentStatus}</p>
        <p className="text-sm text-gray-600">Ordered On: {formatDate(order.createdAt)}</p>
        {/* Render the Cancel Order button only if the status is MENUNGGU_PEMBAYARAN */}
        {order.orderStatus === 'MENUNGGU_PEMBAYARAN' && (
          <div className="mt-4">
            <Button
              variant="destructive"
              onClick={cancelOrder}
              disabled={isLoading}
            >
              Cancel Order
            </Button>
          </div>
        )}
        {/* Render the Confirm Shipping button only if the status is DIKIRIM */}
        {order.orderStatus === 'DIKIRIM' && (
          <div className="mt-4">
            <Button
              
              onClick={confirmShipping}
              disabled={isLoading}
            >
              Confirm Shipping
            </Button>
          </div>
        )}
      </div>
      <div className="mt-6">
        <Link href="/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsView;
