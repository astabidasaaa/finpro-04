import React from 'react';

import { Badge } from "@/components/ui/badge";
import { Order } from '@/types/paymentTypes';

const PaymentInfo: React.FC<{ order: Order; apiUrl: string }> = ({ order, apiUrl }) => (
    <div className="grid gap-3">
      <div className="font-semibold">Informasi Pembayaran</div>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Status Pembayaran</span>
          <Badge variant="default" className="text-xs md:text-lg">{order.payment.paymentStatus}</Badge>
        </li>
        
      </ul>
    </div>
  );
  
  export default PaymentInfo;