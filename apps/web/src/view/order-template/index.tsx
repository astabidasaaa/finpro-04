'use client'

import React, { useEffect, useState } from 'react';
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
  const { orderId } = useParams(); // Use useParams from next/navigation to get orderId
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>No order found.</p>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.orderCode}</p>
      <p>Status: {order.orderStatus}</p>
      <p>Total Amount: Rp{order.payment.amount.toFixed(2)}</p>
      <p>Payment Status: {order.payment.paymentStatus}</p>
      <p>Ordered On: {new Date(order.createdAt).toLocaleDateString()}</p>
      {/* Add more details like shipping, order items, etc. as needed */}
      <Link href="/orders">
        <Button>Back to Orders</Button>
      </Link>
    </div>
  );
};

export default OrderDetailsView;
