import React from 'react';

import { Badge } from "@/components/ui/badge";
import { Order, OrderItem } from '@/types/paymentTypes';

const PaymentInfo: React.FC<{ order: Order; apiUrl: string }> = ({ order, apiUrl }) => (
    <div className="grid gap-3">
      <div className="font-semibold">Informasi Pembayaran</div>
      <ul className="grid gap-3">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Status Pembayaran</span>
          <Badge variant="default" className="text-xs md:text-lg">{order.payment.paymentStatus}</Badge>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Bukti Pembayaran</span>
          <span>
          {order.payment.paymentProof ? (
      <a
        href={`${apiUrl}/${order.payment.paymentProof}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Lihat Bukti
      </a>
    ) : (
      <span className="text-gray-500">Tidak ada bukti</span>
    )}
          </span>
        </li>
      </ul>
    </div>
  );
  
  export default PaymentInfo;