'use client'

import React, { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

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

const OrderPageView: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    if (!customerId) {
      toast({
        variant: 'destructive',
        title: 'Customer ID Required',
        description: 'Please enter a customer ID to view orders.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance().get('/orders/get-orders-by-user', {
        params: { customerId: parseInt(customerId, 10) },
      });

      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to fetch orders',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Order History</h1>
      <div>
        <h2>Customer ID</h2>
        <Input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Enter your customer ID"
        />
        <Button onClick={fetchOrders} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch Orders'}
        </Button>
      </div>
      {orders.length > 0 && (
        <div>
          <h2>Your Orders</h2>
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/orders/${order.id}`}>
                  <p style={{ cursor: 'pointer', margin: '10px 0' }}>
                    Order ID: {order.orderCode}
                  </p>
                  <p>Status: {order.orderStatus}</p>
                  <p>Total Amount: Rp{order.payment.amount.toFixed(2)}</p>
                  <p>Ordered On: {new Date(order.createdAt).toLocaleDateString()}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {orders.length === 0 && !isLoading && (
        <div>
          <p>No orders found for this customer ID.</p>
        </div>
      )}
    </div>
  );
};

export default OrderPageView;
