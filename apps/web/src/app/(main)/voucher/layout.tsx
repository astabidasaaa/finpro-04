import { Separator } from '@radix-ui/react-separator';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Voucher',
};

const MyVoucherLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full px-4 md:px-12 lg:px-24 py-8 space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Kupon Saya</h2>
        <p className="text-muted-foreground">
          Halaman ini berisi kupon aktif yang dimiliki oleh user
        </p>
      </div>
      <Separator className="my-6" />
      <div>{children}</div>
    </div>
  );
};

export default MyVoucherLayout;
