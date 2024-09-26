import React from 'react';
import { ShoppingBag } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from './ui/button';
import Link from 'next/link';
import { handleCartNotVerified } from '@/lib/utils';

const CartBtn = ({ isVerified }: { isVerified: boolean }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {isVerified ? (
            <Button variant="ghost" type="button" asChild>
              <Link href="/cart" className="!p-0 h-max hidden md:block">
                <ShoppingBag className="size-4 md:size-5" />
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              type="button"
              className="!p-0 h-max hidden md:block"
              onClick={handleCartNotVerified}
            >
              <ShoppingBag className="size-4 md:size-5" />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>Lihat keranjang</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CartBtn;
