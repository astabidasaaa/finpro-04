import { Loader2Icon } from 'lucide-react';
import React from 'react';

const MainLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <Loader2Icon className="size-4 animate-spin" />
      Loading...
    </div>
  );
};

export default MainLoading;
