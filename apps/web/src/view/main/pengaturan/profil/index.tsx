'use client';

import React from 'react';
import { Separator } from '@/components/ui/separator';
import ProfilContainer from './components/ProfilContainer';

const ProfilPageView = () => {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
      </div>
      <Separator />
      <ProfilContainer />
    </div>
  );
};

export default ProfilPageView;
