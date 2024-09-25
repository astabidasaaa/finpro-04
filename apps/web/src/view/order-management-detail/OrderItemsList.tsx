'use client'
import React from 'react';

import { Badge } from "@/components/ui/badge";
import { Order, OrderItem } from '@/types/paymentTypes';
  
const OrderItemsList: React.FC<{ order: Order }> = ({ order }) => {
    const IDR = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    });
  
    
  
    return (
      <div className="grid gap-3">
        <div className="font-semibold">Detail Pesanan</div>
        <ul className="grid gap-3">
          {order.orderItems.map((item, index) => (
            <li key={index} className="flex flex-row justify-between items-center gap-4 border-b pb-4">
              <div className="flex flex-col gap-1">
                <p className="font-normal [overflow-wrap:anywhere]">{item.product.name} x {item.qty}</p>
                {item.freeProductPerStore && item.freeProductPerStore.buy > 0 && (
                  <Badge className="text-xs md:text-sm font-medium py-2 px-4 shadow-md bg-orange-500/70 text-black max-w-[155px]">
                    Buy {item.freeProductPerStore.buy}, Get {item.freeProductPerStore.get} Free!
                  </Badge>
                )}
              </div>
              <div className="flex flex-col items-end">
                <p className="text-xs md:text-lg text-black">
                  {item.finalPrice < item.price ? (
                    <span className="line-through text-gray-500 text-xs md:text-sm">
                      {IDR.format(item.price * item.qty)}
                    </span>
                  ) : (
                    IDR.format(item.price * item.qty)
                  )}
                </p>
                {item.finalPrice < item.price && (
                  <p className="text-xs md:text-lg text-black">
                    {IDR.format(item.finalPrice * item.qty)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <Summary order={order} />
      </div>
    );
  };
  
  const Summary: React.FC<{ order: Order }> = ({ order }) => {
    const IDR = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    });
  
    const calculateTotalPrice = (orderItems: OrderItem[]): number => {
      return orderItems.reduce((total, item) => {
        const itemPrice = item.productDiscountPerStore ? item.finalPrice : item.price;
        return total + itemPrice * item.qty;
      }, 0);
    };
  
    const calculateStoreDiscount = (order: Order): number => {
      const voucher = order.selectedTransactionVoucher;
      if (!voucher || !voucher.promotion) return 0;
    
      const { discountType, discountValue, maxDeduction } = voucher.promotion;
      const originalTotalPrice = calculateTotalPrice(order.orderItems);
    
      let discount = 0;
    
      if (discountType === 'PERCENT') {
        discount = (originalTotalPrice * discountValue) / 100;

        if (maxDeduction !== undefined && discount > maxDeduction) {
          discount = maxDeduction;
        }
      } else if (discountType === 'FLAT') {
        discount = discountValue;
      }
      return Math.max(discount, 0);
    };
    
  
    return (
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{IDR.format(calculateTotalPrice(order.orderItems))}</span>
        </li>
        {calculateStoreDiscount(order) > 0 && (
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Diskon</span>
            <span>{IDR.format(calculateStoreDiscount(order))}</span>
          </li>
        )}
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Pengiriman</span>
          <span>{IDR.format(order.shipping.amount)}</span>
        </li>
        <li className="flex items-center justify-between font-semibold">
          <span className="text-muted-foreground">Total</span>
          <span>{IDR.format(order.payment.amount)}</span>
        </li>
      </ul>
    );
  };
  
  export default OrderItemsList;