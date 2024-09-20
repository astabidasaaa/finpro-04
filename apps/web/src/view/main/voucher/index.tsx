'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import VoucherContainer from './VoucherContainer';

export default function VoucherPageView() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-md md:text-lg font-medium">Daftar kupon</h3>
      </div>
      <Separator />
      <VoucherContainer />
    </div>
  );
}
