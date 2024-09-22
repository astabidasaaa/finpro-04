'use client'
import React from 'react';

import { Badge } from "@/components/ui/badge";
import { Order, OrderItem } from '@/types/paymentTypes';
  

const ShippingInfo: React.FC<{ order: Order }> = ({ order }) => (
    <div className="grid gap-3">
      <div className="font-semibold">Informasi Pengiriman</div>
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
          <span className="text-muted-foreground">Nomor Resi</span>
          <span>{order.shipping.trackingNumber}</span>
        </li>
      </ul>
    </div>
  );
  
  export default ShippingInfo;