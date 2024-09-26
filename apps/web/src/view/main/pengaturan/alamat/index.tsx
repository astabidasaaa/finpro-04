'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import AlamatContainer from './components/AlamatContainer';

const AlamatPageView = () => {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Daftar Alamat</h3>
      </div>
      <Separator />
      <AlamatContainer />
    </div>
  );
};

export default AlamatPageView;
