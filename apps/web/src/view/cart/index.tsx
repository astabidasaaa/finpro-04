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
    router.push('/cart/check-out');
  };

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-8 max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>
      <ul className="space-y-4">
        {products.map(product => {
          const cartItem = selectedProducts.get(product.id);
          const quantity = cartItem?.quantity || 0;

          // Extract the price from the prices array
          const price = product.prices[0]?.price || 0;

          return (
            <li key={product.id} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
              <div className="flex items-center space-x-4">
              <Checkbox
                checked={quantity > 0}
                onCheckedChange={(isChecked) => handleQuantityChange(product.id, isChecked ? 1 : -quantity)} className="h-5 w-5"
              />
              <span className="text-lg font-medium">{product.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">Rp{price.toFixed(2)}</span>
                {quantity > 0 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleCheckoutClick}
          disabled={selectedProducts.size === 0}
          className="w-full max-w-md" 
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPageView;
