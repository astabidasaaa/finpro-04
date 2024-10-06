import React, { useEffect, useState } from 'react';
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
import { useAppSelector } from '@/lib/hooks';
import clsx from 'clsx';

const CartBtn = ({ isVerified }: { isVerified: boolean }) => {
  const [cartCount, setCartCount] = useState(0);
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id?.toString();

  const updateCartCount = () => {
    if (userId) {
      const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
      const userCart = cartData[userId] || [];
      const itemCount = userCart.length; 
      setCartCount(itemCount);
    }
  };

  useEffect(() => {
    updateCartCount(); 

    
    const intervalId = setInterval(() => {
      updateCartCount();
    }, 1000);

    return () => {
      clearInterval(intervalId); 
    };
  }, [userId]);
  
  
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
        <div className="relative">
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

            {cartCount > 0 && (
              <span
                className={clsx(
                  'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2',
                  'bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center',
                  'hidden md:flex'
                )}
              >
                {cartCount}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Lihat keranjang</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CartBtn;
