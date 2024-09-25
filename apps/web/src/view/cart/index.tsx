'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';
import { getCartItems, clearCheckedCart } from '@/utils/cartUtils';
import { useAppSelector } from '@/lib/hooks';
import { Minus, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { CartItem } from '@/types/cartType';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from '@/components/ui/use-toast';

const CartPageView = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id?.toString();

  useEffect(() => {
    if (userId) {
      clearCheckedCart(userId);
      const userCart = getCartItems(userId);
      fetchProductDetails(userCart);
      loadCheckedItems();
    }
  }, [userId]);

  const fetchProductDetails = async (userCart: CartItem[]) => {
    try {
      const productDetailsPromises = userCart.map(async (item) => {
        const productResult = await axiosInstance().get(
          `${process.env.API_URL}/products/single-store?productId=${item.productId}&storeId=${item.storeId}`
        );
        const productData = productResult.data.data;

        if (productData) {
          let productPrice = productData.product.prices[0].price;
          let discountedPrice = productPrice;
          let buy = 0;
          let get = 0;

          const discountProduct = productData.productDiscountPerStores;
          const freeProduct = productData.freeProductPerStores;

          if (discountProduct !== undefined && discountProduct.length > 0) {
            if (discountProduct[0].discountType === 'FLAT') {
              discountedPrice = productPrice - discountProduct[0].discountValue;
            } else if (discountProduct[0].discountType === 'PERCENT') {
              discountedPrice =
                (productPrice * (100 - discountProduct[0].discountValue)) / 100;
            }
          }

          if (freeProduct !== undefined && freeProduct.length > 0) {
            buy = freeProduct[0].buy;
            get = freeProduct[0].get;
          }

          return {
            ...item,
            name: productData.product.name,
            image: productData.product.images[0].title || { title: '', alt: '' },
            price: productPrice,
            discountedPrice,
            buy,
            get,
          };
        }

        return undefined; 
      });

      const products = await Promise.all(productDetailsPromises);
      const validProducts = products.filter((product) => product !== undefined) as CartItem[];

      setCartItems(validProducts);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch cart items',
        description: 'Please try again later.',
      });
    }
  };

  const loadCheckedItems = () => {
    const storedCheckedCart = localStorage.getItem('checkedCart');
    if (storedCheckedCart) {
      const parsedCheckedCart = JSON.parse(storedCheckedCart);
      if (parsedCheckedCart[userId]) {
        const userCheckedItems = parsedCheckedCart[userId];
        const itemSet = new Set<string>(userCheckedItems.map((item: any) => JSON.stringify(item)));
setCheckedItems(itemSet);

      }
    }
  };

  const handleCheckboxChange = (item: CartItem, isChecked: boolean) => {
    const itemKey = JSON.stringify({ storeId: item.storeId, productId: item.productId, quantity: item.quantity });

    setCheckedItems((prev) => {
      const newCheckedItems = new Set(prev);
      if (isChecked) {
        [...newCheckedItems].forEach((checkedItem) => {
          const checkedItemObj = JSON.parse(checkedItem);
          if (checkedItemObj.productId === item.productId) {
            newCheckedItems.delete(checkedItem);
          }
        });
        newCheckedItems.add(itemKey);
      } else {
        newCheckedItems.delete(itemKey);
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
              return { ...item, quantity: newQuantity };
            }
            return null;
          }
          return item;
        })
        .filter((item) => item !== null); 
  
      const itemKey = JSON.stringify({ storeId, productId });
      if (checkedItems.has(itemKey)) {
        const updatedCheckedItems = new Set(checkedItems);
        updatedCheckedItems.delete(itemKey); 
  
        const updatedQuantity = updatedCart.find(
          (item) => item?.productId === productId
        )?.quantity;
        if (updatedQuantity && updatedQuantity > 0) {
          updatedCheckedItems.add(
            JSON.stringify({ storeId, productId, quantity: updatedQuantity })
          );
        }
        setCheckedItems(updatedCheckedItems);
      }
      localStorage.setItem(
        'cart',
        JSON.stringify({
          ...getCartItems(userId).reduce((acc: any, item: CartItem) => {
            if (!acc[userId]) acc[userId] = [];
            acc[userId].push(item);
            return acc;
          }, {}),
          [userId]: updatedCart,
        })
      );
  
      return updatedCart;
    });
  };
  
  const handleCheckoutClick = () => {
    const checkedItemsByUserId = {
      [userId]: Array.from(checkedItems)
        .map((item) => JSON.parse(item))
        .filter((checkedItem) => {
          const currentCartItem = cartItems.find(
            (cartItem) =>
              cartItem.productId === checkedItem.productId &&
              cartItem.storeId === checkedItem.storeId
          );
          return currentCartItem && currentCartItem.quantity === checkedItem.quantity;
        }),
    };

    if (checkedItemsByUserId[userId].length === 0) {
      toast({
        variant: 'destructive',
        title: 'Checkout gagal',
        description: 'Tidak ada produk yang dipilih',
      });
      return;
    }
  
    localStorage.setItem('checkedCart', JSON.stringify(checkedItemsByUserId));
    router.push('/cart/check-out');
  };
  

  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  return (
    <div className="container px-4 md:px-12 lg:px-24 max-w-screen-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      {cartItems.length > 0 ? (
        <ul className="space-y-4 md:px-4">
          {cartItems.map((item) => (
            <li
              key={`${item.productId}-${item.storeId}-${item.userId}`}
              className="flex justify-between items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={checkedItems.has(JSON.stringify({ storeId: item.storeId, productId: item.productId, quantity: item.quantity }))}
                  onCheckedChange={(isChecked: boolean) => handleCheckboxChange(item, isChecked)}
                  className="h-5 w-5"
                />
                <Image
                  src={`${process.env.PRODUCT_API_URL}/${item.image}`} 
                  alt={item.image.alt || item.name}
                  width={240}
                  height={240}
                  className="object-cover object-center size-20 rounded-md hidden md:block"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-normal [overflow-wrap:anywhere]">{item.name}</p>
                  <p className="text-sm font-semibold">
                    { item.discountedPrice > 0 ? (
                      <span className="line-through text-gray-500">{IDR.format(item.price)}</span>
                    ) : (
                      IDR.format(item.price)
                    )}
                  </p>
                  {item.discountedPrice > 0 && (
                    <p className="text-lg font-semibold text-main-dark">
                      {IDR.format(item.discountedPrice)}
                    </p>
                  )}
                  {item.buy !== undefined && item.get !== undefined && item.buy > 0 && item.get > 0 && (
                    <Badge className="text-sm font-medium py-2 px-4 shadow-md bg-orange-500/70 text-black max-w-[130px]">
                      Beli {item.buy} gratis {item.get}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="!p-1 size-5 !rounded-full"
                  onClick={() => handleQuantityChange(item.productId, item.storeId, item.userId, -1)}
                >
                  <Minus />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="!p-1 size-5 !rounded-full"
                  onClick={() => handleQuantityChange(item.productId, item.storeId, item.userId, 1)}
                >
                  <Plus />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <div className="mt-6 flex justify-center">
        <Button
          
          className="w-full max-w-md bg-main-dark hover:bg-main-dark/80"
          onClick={handleCheckoutClick}
          disabled={checkedItems.size === 0} 
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPageView;
