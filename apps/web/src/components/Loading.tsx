import { Loader2Icon } from 'lucide-react';
import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-row justify-center items-center w-full min-h-[120px] md:min-h-[320px]">
      <Loader2Icon className="size-4 animate-spin mr-2" />
      Loading...
    </div>
  );
};

export default Loading;
