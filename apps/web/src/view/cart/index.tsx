'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { getCartItems } from '@/utils/cartUtils'; 
import { useAppSelector } from '@/lib/hooks';
import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';

type CartItem = {
  productId: string;
  storeId: string;
  name: string;
  price: number;
  quantity: number;
  userId: string; // userId is now part of CartItem
  image: {
    title: string;
    alt?: string;
  };
};

const CartPageView = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id?.toString();

  useEffect(() => {
    if (userId) {
      // Load cart for the current user
      const userCart = getCartItems(userId);
      setCartItems(userCart);
    }
  }, [userId]);

  const handleCheckboxChange = (item: CartItem, isChecked: boolean) => {
    setCheckedItems((prev) => {
      const newCheckedItems = new Set(prev);
      if (isChecked) {
        newCheckedItems.add(JSON.stringify(item));
      } else {
        newCheckedItems.delete(JSON.stringify(item));
      }
      return newCheckedItems;
    });
  };

  const handleQuantityChange = (
    productId: string,
    storeId: string,
    userId: string,
    delta: number
  ) => {
    setCartItems((prev) => {
      const updatedCart = prev
        .map((item) => {
          if (
            item.productId === productId &&
            item.storeId === storeId &&
            item.userId === userId
          ) {
            const newQuantity = item.quantity + delta;
            if (newQuantity > 0) {
              return { ...item, quantity: newQuantity }; // Update quantity if it's positive
            }
            return { ...item, quantity: 0 }; // Set quantity to 0 if it's less than or equal to 0
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Filter out items with quantity 0

      // Update the cart in localStorage
      localStorage.setItem('cart', JSON.stringify({
        ...getCartItems(userId).reduce((acc: any, item: CartItem) => {
          if (!acc[userId]) acc[userId] = [];
          acc[userId].push(item);
          return acc;
        }, {}), 
        [userId]: updatedCart
      }));

      return updatedCart;
    });
  };

  const handleCheckoutClick = () => {
    // Save checked items to local storage
    localStorage.setItem('checkedCart', JSON.stringify(Array.from(checkedItems)));
    router.push('/cart/check-out');
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8 max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      {cartItems.length > 0 ? (
        <ul className="space-y-4 md:px-4">
          {cartItems.map((item) => (
            <li
              key={`${item.productId}-${item.storeId}-${item.userId}`} // Use unique key with userId
              className="flex flex-row justify-start items-center gap-4"
            >
              <Checkbox
                checked={checkedItems.has(JSON.stringify(item))}
                onCheckedChange={(isChecked: boolean) => handleCheckboxChange(item, isChecked)}
                className="h-5 w-5"
              />
              <Image
                src={`${process.env.PRODUCT_API_URL}/${item.image}`} // Make sure to handle image URL properly
                alt={item.image.alt || item.name}
                width={240}
                height={240}
                className="object-cover object-center size-20 rounded-md"
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-normal">{item.name}</p>
                <p className="text-sm font-semibold">
                  {item.price}
                </p>
                <div className="flex flex-row justify-center items-center gap-2 border rounded-lg px-2 py-2 text-sm w-max">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="!p-1 size-5 !rounded-full"
                    onClick={() => handleQuantityChange(item.productId, item.storeId, item.userId, -1)}
                  >
                    <Minus />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="!p-1 size-5 !rounded-full"
                    onClick={() => handleQuantityChange(item.productId, item.storeId, item.userId, 1)}
                  >
                    <Plus />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleCheckoutClick}
          disabled={checkedItems.size === 0}
          className="w-full max-w-md"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPageView;
