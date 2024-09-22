import React from 'react';

import { Badge } from "@/components/ui/badge";
import { Order, OrderItem } from '@/types/paymentTypes';
  

const CustomerInfo: React.FC<{ order: Order }> = ({ order }) => (
    <div className="grid gap-3">
      <div className="font-semibold">Informasi Pelanggan</div>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Nama</span>
          <span>{order.customer.profile.name}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Email</span>
          <span>{order.customer.email}</span>
        </li>
        
      </ul>
    </div>
  );
  
  export default CustomerInfo;