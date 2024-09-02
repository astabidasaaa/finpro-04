'use client'

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; 
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  prices: { price: number }[];
};

type CartItem = {
  id: string;
  quantity: number;
};

const CartPageView = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, CartItem>>(new Map());

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance().get('/orders/get-all-products');
        setProducts(response.data.data);
        // Debugging: Log the response to ensure prices are included
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: string, delta: number) => {
    setSelectedProducts(prev => {
      const newSelection = new Map(prev);
      const currentItem = newSelection.get(productId) || { id: productId, quantity: 0 };
      const newQuantity = currentItem.quantity + delta;

      if (newQuantity > 0) {
        newSelection.set(productId, { ...currentItem, quantity: newQuantity });
      } else {
        newSelection.delete(productId);
      }

      localStorage.setItem('selectedProducts', JSON.stringify(Array.from(newSelection.values())));
      return newSelection;
    });
  };

  const handleCheckoutClick = () => {
    router.push('/check-out');
  };

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {products.map(product => {
          const cartItem = selectedProducts.get(product.id);
          const quantity = cartItem?.quantity || 0;

          // Extract the price from the prices array
          const price = product.prices[0]?.price || 0;

          return (
            <li key={product.id}>
              <Checkbox
                checked={quantity > 0}
                onCheckedChange={(isChecked) => handleQuantityChange(product.id, isChecked ? 1 : -quantity)}
              />
              {product.name} - Rp{price.toFixed(2)}
              {quantity > 0 && (
                <div>
                  <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                  {quantity}
                  <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <Button onClick={handleCheckoutClick} disabled={selectedProducts.size === 0}>
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default CartPageView;
