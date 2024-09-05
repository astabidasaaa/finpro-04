'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAppSelector } from '@/lib/hooks';
import { DatePickerWithRange } from './date-picker';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

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
  const customer = useAppSelector((state) => state.auth.user);
  const customerId = customer.id.toString();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (customerId) {
      fetchOrders('/orders/get-orders-by-user');
    }
  }, [customerId, dateRange]);

  const fetchOrders = async (url: string) => {
    if (!customerId) {
      toast({
        variant: 'destructive',
        title: 'Customer ID Required',
        description: 'Customer ID is missing, unable to fetch orders.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const params: any = { customerId: parseInt(customerId, 10) };

      if (dateRange?.from && dateRange.to) {
        params.from = dateRange.from.toISOString();
        params.to = dateRange.to.toISOString();
      }

      const endpoint = dateRange?.from && dateRange.to
        ? '/orders/get-orders-by-date-range-and-user'
        : url;

      const response = await axiosInstance().get(endpoint, { params });
      setOrders(response.data.data);
      setSelectedOrder(null); // Clear selected order when fetching new orders
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch orders',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance().get("/orders/get-order-by-id", {
        params: { orderId: parseInt(orderId, 10) },
      });
      setSelectedOrder(response.data.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch order details',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = event.target.value;
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setSelectedOrder(null); // Clear selected order if no option is selected
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="container px-4 md:px-12 lg:px-24 max-w-screen-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="mb-4 flex gap-4">
        <Button onClick={() => fetchOrders('/orders/get-finished-orders-by-user')}>
          Pesanan Selesai
        </Button>
        <Button onClick={() => fetchOrders('/orders/get-unfinished-orders-by-user')}>
          Pesanan Dalam Progress
        </Button>
        <Button onClick={() => fetchOrders('/orders/get-orders-by-user')}>
          Semua Pesanan
        </Button>
      </div>

      <DatePickerWithRange className="mb-4" onSelect={setDateRange} />

      <select
        className="mb-4 px-4 py-2 border border-gray-300 rounded"
        onChange={handleOrderSelect}
        value={selectedOrder?.id || ''}
      >
        <option value="">Select an Order</option>
        {orders.map((order) => (
          <option key={order.id} value={order.id}>
            {order.orderCode}
          </option>
        ))}
      </select>

      {isLoading && <p className="text-center">Loading...</p>}

      {selectedOrder ? (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Selected Order Details</h2>
    <Link href={`/orders/${selectedOrder.id}`}>
      <div className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
        <p className="text-lg font-medium text-blue-600">{selectedOrder.orderCode}</p>
        <hr className="my-2 border-gray-300" />
        <p className="text-sm text-gray-600">Status: {selectedOrder.orderStatus}</p>
        <p className="text-sm text-gray-600">Total Amount: Rp{selectedOrder.payment.amount.toFixed(2)}</p>
        <p className="text-sm text-gray-600">Ordered On: {formatDate(selectedOrder.createdAt)}</p>
      </div>
    </Link>
  </div>
) : (
  // Render list of orders when no order is selected
  <div>
    {orders.length > 0 ? (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
              <Link href={`/orders/${order.id}`}>
                <div className="cursor-pointer">
                  <p className="text-lg font-medium text-blue-600">{order.orderCode}</p>
                  <hr className="my-2 border-gray-300" />
                  <p className="text-sm text-gray-600">Status: {order.orderStatus}</p>
                  <p className="text-sm text-gray-600">Total Amount: Rp{order.payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Ordered On: {formatDate(order.createdAt)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="text-center">
        <p className="text-lg text-gray-500">No orders found for this customer.</p>
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default OrderPageView;
