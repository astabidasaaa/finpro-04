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
    <div>
      <h1>Payment</h1>
      <p>Total Payment: Rp{totalPrice}</p>
      <Button onClick={handleManualPayment} disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Manual Payment'}
      </Button>
    </div>
  );
};

export default PaymentView;
