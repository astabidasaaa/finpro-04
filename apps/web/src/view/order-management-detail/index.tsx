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
 

  import { Separator } from "@/components/ui/separator"
 
  type Promotion = {
    discountType: 'FLAT' | 'PERCENT'; // Type of discount (flat or percentage)
    discountValue: number;            // Discount value based on type
  };
  
  type Voucher = {
    promotion: Promotion;              // Promotion details for the voucher
  };

type Payment = {
  amount: number;
  paymentStatus: string;
  paymentGateway: string;
  paymentProof?: string;
};

type OrderItem = {
  qty: number;
  price: number;
  finalPrice: number;                 // Final price after discount
  productDiscountPerStore?: Promotion; // Discount details if applicable
  freeProductPerStore?: {
    buy: number;
    get: number;
  };                                  // "Buy X get Y" promotion if applicable
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
  orderItems: OrderItem[];            // List of order items
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
  shipping: {
    courier: string;
    trackingNumber: string;
    amount: number;
  };
  selectedTransactionVoucher?: Voucher; // Transaction-level voucher for discounts
  selectedDeliveryVoucher?: Voucher;    // Delivery voucher for reduced shipping
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

  const formatOrderStatus = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  const calculateTotalPrice = (orderItems: OrderItem[]): number => {
    return orderItems.reduce((total, item) => {
      // Check if a discount is applied, otherwise use the original price
      const itemPrice = item.productDiscountPerStore
        ? item.finalPrice // Use the final price with discount applied
        : item.price;     // Use the original price if no discount
  
      // Calculate the quantity of paid items (exclude the free ones)
      const paidQuantity = calculatePaidQuantity(item);
  
      // Multiply the price by the paid quantity (not including free items)
      return total + itemPrice * paidQuantity;
    }, 0);
  };
  

  const calculateTotalPriceWithShipping = (order: Order): number => {
    const originalTotalPrice = calculateTotalPrice(order.orderItems); // Original price before discounts
    const storeDiscount = calculateStoreDiscount(order.selectedTransactionVoucher, order.orderItems); // Store discount
    const itemsTotalWithDiscount = originalTotalPrice - storeDiscount;
  
    // Calculate the shipping cost (use hardcoded shipping if no shipping info available)
    const shippingAmount = order.shipping?.amount 
    const finalShippingAmount = order.selectedDeliveryVoucher
      ? calculateReducedShippingCost(order.selectedDeliveryVoucher, order.shipping?.amount)
      : shippingAmount;
  
    // Ensure the total price doesn't go negative and then add the shipping cost
    return Math.max(itemsTotalWithDiscount, 0) + finalShippingAmount;
  };

  const calculatePaidQuantity = (item: OrderItem): number => {
    let paidQuantity = item.qty;
  
    // Check if there's a "buy X get Y" promotion for this item
    if (item.freeProductPerStore && item.freeProductPerStore.buy > 0 && item.freeProductPerStore.get > 0) {
      // Calculate how many sets of "buy X" are present in the quantity
      const setsOfBuy = Math.floor(item.qty / item.freeProductPerStore.buy);
  
      // Subtract the number of free items from the paid quantity
      const freeItems = setsOfBuy * item.freeProductPerStore.get;
      paidQuantity -= freeItems; // Remove free items from the paid quantity
    }
  
    return paidQuantity;
  };

  const calculateReducedShippingCost = (voucher: Voucher, shippingAmount?: number): number => {
   
  
    const { discountType, discountValue } = voucher.promotion;
    const originalShippingCost = shippingAmount 
  
    let reducedShippingCost;
    if (discountType === 'FLAT') {
      // Flat discount: reduce the shipping cost by a fixed amount
      reducedShippingCost = originalShippingCost - discountValue;
    } else if (discountType === 'PERCENT') {
      // Percentage discount: reduce the shipping by a percentage of the original amount
      reducedShippingCost = originalShippingCost * (1 - discountValue / 100);
    } else {
      reducedShippingCost = originalShippingCost; // No discount if type is unknown
    }
  
    return Math.max(reducedShippingCost, 0); // Ensure the shipping cost doesn't go below zero
  };

  const calculateStoreDiscount = (voucher: Voucher | undefined, orderItems: OrderItem[]): number => {
    if (!voucher) return 0;
  
    const { discountType, discountValue } = voucher.promotion;
    const originalTotalPrice = calculateTotalPrice(orderItems);
  
    if (discountType === 'PERCENT') {
      // Percentage discount: calculate discount based on a percentage of the total price
      return Math.max((originalTotalPrice * discountValue) / 100, 0);
    } else if (discountType === 'FLAT') {
      // Flat discount: subtract a fixed amount from the total price
      return Math.max(discountValue, 0);
    }
  
    return 0; // No discount if type is unknown
  };
  
  
  
  

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      
      <Card
    className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
  >
    <CardHeader className="flex flex-col items-start bg-muted/50 text-lg">
  <div className="grid gap-2">
    <CardTitle className="group flex items-center gap-2">
      {order.orderCode}
    </CardTitle>
    <CardDescription className="text-lg">
      Tanggal Pemesanan: {formatDate(order.createdAt)}
    </CardDescription>
  </div>
  {/* Move Badge out of the grid and ensure it's inline-block */}
  <Badge
    className={`text-xs px-2 font-semibold inline-block self-start ${
      order.orderStatus === 'DIKONFIRMASI'
        ? 'bg-green-400'
        : order.orderStatus === 'DIBATALKAN'
        ? 'bg-red-900'
        : 'bg-main-dark hover:bg-main-dark/80'
    }`}
  >
    {formatOrderStatus(order.orderStatus)}
  </Badge>
</CardHeader>
    <CardContent className="p-6 text-lg">
      <div className="grid gap-3">
      <div className="font-semibold">Order Details</div>
<ul className="grid gap-3">
  {order.orderItems.map((item, index) => (
    <li key={index} className="flex items-center justify-between">
      <span className="text-muted-foreground">
        {item.product.name} x <span>{item.qty}</span>
      </span>
      <div className="flex items-center">
        {/* Check if there's a discount and display the original price */}
        {item.finalPrice < item.price ? (
          <>
            <span className="line-through text-muted-foreground mr-2">
              {IDR.format(item.price * item.qty)}
            </span>
            <span>{IDR.format(item.finalPrice * item.qty)}</span>
          </>
        ) : (
          <span>{IDR.format(item.price * item.qty)}</span>
        )}
      </div>
    </li>
  ))}

  {/* Handle "Buy X get Y" promotion */}
  {order.orderItems.map((item, index) =>
    item.freeProductPerStore ? (
      <li key={`promo-${index}`} className="text-sm text-muted-foreground">
        Buy {item.freeProductPerStore.buy}, Get {item.freeProductPerStore.get} Free!
      </li>
    ) : null
  )}
</ul>

<Separator className="my-2" />

<ul className="grid gap-3">
  <li className="flex items-center justify-between">
    <span className="text-muted-foreground">Subtotal</span>
    <span>{IDR.format(calculateTotalPrice(order.orderItems))}</span>
  </li>
  <li className="flex items-center justify-between">
    <span className="text-muted-foreground">Pengiriman</span>
    <span>{IDR.format(order.shipping.amount)}</span>
  </li>
  {/* <li className="flex items-center justify-between">
    <span className="text-muted-foreground">Tax</span>
    <span>{IDR.format(calculateTax(order))}</span>
  </li> */}
  <li className="flex items-center justify-between font-semibold">
    <span className="text-muted-foreground">Total</span>
    <span>{IDR.format(order.payment.amount)}</span>
  </li>
</ul>

      </div>
      <Separator className="my-4" />
      
        <div className="grid gap-3">
          <div className="font-semibold">Shipping Information</div>
          
          <ul className="grid gap-3">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Alamat</span>
            <span>{order.deliveryAddress.address}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Kurir</span>
            <span>{order.shipping.courier}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Kode Tracking</span>
            <span>{order.shipping.trackingNumber}</span>
          </li>
          </ul>
          
          
            
         
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
