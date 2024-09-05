'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

const PaymentView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPrice = searchParams.get('totalPrice'); // Get the total price from query params

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleManualPayment = () => {
    setIsSubmitting(true);
    
    const orderId = searchParams.get('orderId');
    const userId = searchParams.get('userId');
    
    // Redirect to payment proof upload page with orderId and userId
    router.push(`/payment/upload?orderId=${orderId}&userId=${userId}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-12 lg:px-24 py-8 max-w-screen-md">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
        <p className="text-lg font-medium mb-4">Total Pembayaran: <span className="text-blue-600">Rp{totalPrice}</span></p>
        <p className="text-lg font-medium mb-4">Transfer BCA ke: <span className="text-blue-600">25...</span></p>
        <Button 
          onClick={handleManualPayment} 
          disabled={isSubmitting}
          className="w-full mt-4"
        >
          {isSubmitting ? 'Processing...' : 'Upload Bukti Pembayaran'}
        </Button>
      </div>
    </div>
  );
};

export default PaymentView;
