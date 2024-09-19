'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
   
    Copy,
    CreditCard,
  
  } from "lucide-react"


  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
 

  import { Separator } from "@/components/ui/separator"
 
  

type Payment = {
  amount: number;
  paymentStatus: string;
  paymentGateway: string;
  paymentProof?: string;
};

type OrderItem = {
  qty: number;
  price: number;
  product: {
    name: string;
  };
};

type Order = {
  id: string;
  orderCode: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  payment: Payment;
  orderItems: OrderItem[];
  customer: {
    profile: {
      name: string;
    };
    email: string;
  };
  deliveryAddress: {
    address: string;
    zipCode: string;
  };
  
};

const OrderManagementDetailsView: React.FC = () => {
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
        const response = await axiosInstance().get(`/get-order/get-order-by-id`, {
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

  const updateOrderStatus = async (status: string) => {
    if (!orderId) return;
    setIsLoading(true);

    const endpoint = status === 'DIPROSES' 
      ? `/shipping/process-order`
      : `/shipping/shipping-order`;

      try {
        await axiosInstance().post(endpoint, {
          orderId: parseInt(orderId as string, 10), 
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

  const rejectPayment = async () => {
    if (!orderId) return;

    setIsLoading(true);

    try {
      await axiosInstance().post(`/payments/reject-payment`, {
        orderId: parseInt(orderId as string, 10),
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>No order found.</p>;
  }
  const apiUrl = process.env.PAYMENT_PROOF_API_URL;

  return (
    <div className="container px-4 md:px-12 lg:px-24 max-w-screen-2xl py-8">
      
      <Card
    className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
  >
    <CardHeader className="flex flex-row items-start bg-muted/50">
      <div className="grid gap-0.5">
        <CardTitle className="group flex items-center gap-2 text-lg">
        {order.orderCode}
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Copy className="h-3 w-3" />
            <span className="sr-only">Copy Order ID</span>
          </Button>
        </CardTitle>
        <CardDescription>Date: {formatDate(order.createdAt)}</CardDescription>
        
        <Badge variant="default" className="text-xs">{order.orderStatus}</Badge>
      </div>
      
    </CardHeader>
    <CardContent className="p-6 text-sm">
      <div className="grid gap-3">
        <div className="font-semibold">Order Details</div>
        <ul className="grid gap-3">
              {order.orderItems.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {item.product.name} x <span>{item.qty}</span>
                  </span>
                  <span>Rp{(item.price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
        <Separator className="my-2" />
        <ul className="grid gap-3">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>$299.00</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>$5.00</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>$25.00</span>
          </li>
          <li className="flex items-center justify-between font-semibold">
            <span className="text-muted-foreground">Total</span>
            <span>Rp{order.payment.amount.toFixed(2)}</span>
          </li>
        </ul>
      </div>
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-3">
          <div className="font-semibold">Shipping Information</div>
          <address className="grid gap-0.5 not-italic text-muted-foreground">
          <span>{order.customer.profile.name}</span>
          <span>{order.deliveryAddress.address}</span>
            
          </address>
        </div>
        
        
      </div>
      <Separator className="my-4" />
      <div className="grid gap-3">
        <div className="font-semibold">Customer Information</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Customer</dt>
            <dd>{order.customer.profile.name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd>
                  <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a>
                </dd>
          </div>
          
        </dl>
      </div>
      <Separator className="my-4" />
      <div className="grid gap-3">
        <div className="font-semibold">Payment Information</div>
        <dl className="grid gap-3">
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-1 text-muted-foreground">
              
              Status
            </dt>
            <Badge variant="default" className="text-xs">{order.payment.paymentStatus}</Badge>
          </div>
          {order.payment.paymentProof ? (
  <div className="flex items-center justify-between">
    <dt className="text-muted-foreground">Payment Proof</dt>
    <dd>
      <a
        href={`${apiUrl}/${order.payment.paymentProof}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View Proof
      </a>
    </dd>
  </div>
) : (
  <p className="text-muted-foreground">No payment proof</p>
)}
        </dl>
      </div>
      <Separator className="my-4" />
      {['MENUNGGU_PEMBAYARAN', 'DIPROSES'].includes(order.orderStatus) && (
  <div className="mt-4">
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
          <div className="mt-4">
          <Button
                onClick={() => updateOrderStatus('DIPROSES')}
                disabled={isLoading}
              >
                Proses Pesanan
              </Button>
              <Button variant="destructive" onClick={rejectPayment}>
              Tolak Pembayaran
            </Button>
          </div>
          )}
          
          {order.orderStatus === 'DIPROSES' && (
            <div className="mt-4">
          <Button
                onClick={() => updateOrderStatus('DIKIRIM')}
                disabled={isLoading}
              >
                Kirim Pesanan
              </Button>
          </div>
        )}
        <div className="mt-6">
        <Link href="/dashboard/order-management">
          <Button variant="outline">Kembali Ke Order Management</Button>
        </Link>
      </div>
    </CardContent>
  </Card>
    </div>
    
  );
};

export default OrderManagementDetailsView;
