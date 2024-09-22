import React from 'react';
import StoresContent from './StoresContent';

const PengelolaanTokoPageView = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pengelolaan Toko</h1>
      </div>
      <StoresContent />
    </div>
  );
};

export default PengelolaanTokoPageView;
