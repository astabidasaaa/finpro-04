'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

const PaymentView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPrice = parseFloat(searchParams.get('totalPrice') || '0'); 

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleManualPayment = () => {
    setIsSubmitting(true);
    
    const orderId = searchParams.get('orderId');
    const userId = searchParams.get('userId');
    
    router.push(`/pembayaran/upload-pembayaran?orderId=${orderId}&userId=${userId}`);
  };
  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  return (
    <div className="container px-4 md:px-12 lg:px-24 max-w-screen-2xl py-8">
  <h1 className="text-3xl font-bold mb-6">Payment</h1>

  <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
    <div className="text-lg font-medium flex justify-between items-center">
      <span>Total Pembayaran: {IDR.format(totalPrice)}</span>
      
    </div>

    <div className="text-lg font-medium flex justify-between items-center">
      <span>Transfer BCA atas nama PT SIGMART ke nomor rekening: 258500000</span>
      
    </div>
    <div className="mt-6 flex justify-center">
    <Button 
      onClick={handleManualPayment} 
      disabled={isSubmitting} 
      className="w-full max-w-md bg-main-dark hover:bg-main-dark/80"

    >
      {isSubmitting ? 'Processing...' : 'Upload Bukti Pembayaran'}
    </Button>
    </div>
  </div>
</div>
  );
};

export default PaymentView;
