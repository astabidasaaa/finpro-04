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
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
 
  import { Order } from '@/types/paymentTypes';
  import { Separator } from "@/components/ui/separator"
 
  import OrderItemsList from './OrderItemsList';
import ShippingInfo from './ShippingInfo';
import CustomerInfo from './CustomerInfo';
import PaymentInfo from './PaymentInfo';
import OrderActions from './OrderActions';

  


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
        const fetchedOrder = response.data.data;
        if (fetchedOrder.vouchers && fetchedOrder.vouchers.length > 0) {
          fetchedOrder.selectedTransactionVoucher = fetchedOrder.vouchers[0];
        }
        setOrder(fetchedOrder);
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const apiUrl = process.env.PAYMENT_PROOF_API_URL;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col items-start bg-muted/50 text-xs md:text-lg">
          <div className="grid gap-2">
            <CardTitle className="group flex items-center gap-2">
              {order.orderCode}
            </CardTitle>
            <CardDescription className="text-xs md:text-lg">
            Tanggal Pemesanan: {formatDate(order.createdAt)}
            </CardDescription>
          </div>
          <Badge className={`text-xs px-2 font-semibold inline-block self-start ${getBadgeClass(order.orderStatus)}`}>
            {formatOrderStatus(order.orderStatus)}
          </Badge>
        </CardHeader>
        <CardContent className="p-6 text-xs md:text-lg">
          <OrderItemsList order={order} />
          <Separator className="my-4" />
          <ShippingInfo order={order} />
          <Separator className="my-4" />
          <CustomerInfo order={order} />
          <Separator className="my-4" />
          <PaymentInfo order={order} apiUrl={apiUrl || ''} />
          <Separator className="my-4" />
          <OrderActions order={order} orderId={Array.isArray(orderId) ? orderId[0] : orderId} userId={userId} />

          <div className="mt-6">
            <Link href="/dashboard/order-management">
              <Button variant="outline" className='text-xs md:text-lg'>Kembali Ke Order Management</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getBadgeClass = (status: string) => {
  switch (status) {
    case 'DIKONFIRMASI':
      return 'bg-green-400';
    case 'DIBATALKAN':
      return 'bg-red-900';
    default:
      return 'bg-main-dark hover:bg-main-dark/80';
  }
};

const formatOrderStatus = (status: string) => {
  return status.replace(/_/g, ' ');
};

export default OrderManagementDetailsView;