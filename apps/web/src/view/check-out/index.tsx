'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Address = {
  id: string;
  address: string;
  zipCode: string;
  latitude: string;
  longitude: string;
};

type NearestStore = {
  storeId: number;
  storeAddressId: number;
};

const CheckoutPageView = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [nearestStore, setNearestStore] = useState<NearestStore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCheckingInventory, setIsCheckingInventory] = useState<boolean>(false);
  const [inventoryIssues, setInventoryIssues] = useState<Map<string, string>>(
    new Map()
  );
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user.id.toString();

  useEffect(() => {
    const fetchOrderDetailsFromLocalStorage = async () => {
      setIsLoading(true); // Ensure loading state is true when starting the fetch
      try {
        const savedItems = JSON.parse(localStorage.getItem('selectedProducts') || '[]');

        if (savedItems.length > 0) {
          const productDetails = await Promise.all(
            savedItems.map((cartItem: { id: string, quantity: number }) =>
              axiosInstance().get(`/orders/get-product/${cartItem.id}`)
            )
          );

          const mappedItems: OrderItem[] = productDetails.map((response, index) => {
            const product = response.data.data;
            return {
              id: product.id,
              name: product.name,
              quantity: savedItems[index].quantity,
              price: product.price,
            };
          });

          setOrderItems(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to fetch product details',
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false); // Ensure loading state is false after the fetch
      }
    };

    fetchOrderDetailsFromLocalStorage();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAddresses(userId);
    }
  }, [userId]);

  const fetchAddresses = async (userId: string) => {
    try {
      const response = await axiosInstance().get('/orders/get-addresses', {
        params: { userId },
      });

      setAddresses(response.data.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to fetch addresses',
        description: 'Please try again later.',
      });
    }
  };

  const checkInventory = async (nearestStoreData: NearestStore) => {
    setIsCheckingInventory(true); // Set loading state to true
    try {
      const response = await axiosInstance().post('/orders/check-inventory', {
        storeId: nearestStoreData.storeId,
        items: orderItems.map(item => ({
          productId: item.id,
          qtyRequired: item.quantity,
        })),
      });
  
      const issues = new Map<string, string>();
      response.data.data.forEach((item: { productId: number; isAvailable: boolean }) => {
        if (!item.isAvailable) {
          issues.set(item.productId.toString(), `Insufficient stock for product ID: ${item.productId}`);
        }
      });
  
      setInventoryIssues(issues);
      return issues.size === 0;
    } catch (error) {
      console.error('Error checking inventory:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to check inventory',
        description: 'Please try again later.',
      });
      return false;
    } finally {
      setIsCheckingInventory(false); // Set loading state to false
    }
  };
  

  const handleCheckout = async () => {
    setIsSubmitting(true);

    if (nearestStore && !(await checkInventory(nearestStore))) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axiosInstance().post('/orders', {
        customerId: parseInt(userId, 10),
        price: calculateTotalPrice(),
        finalPrice: calculateTotalPrice(),
        paymentGateway: 'MidTrans',
        deliveryAddressId: selectedAddressId,
        orderStatus: 'MENUNGGU_PEMBAYARAN',
        additionalInfo: { note: additionalInfo },
        cartItems: orderItems.map(item => ({
          productId: item.id,
          qty: item.quantity,
        })),
      });

      const orderId = response.data.data.orderId;
      const totalPrice = calculateTotalPrice().toString();

      toast({
        variant: null,
        title: 'Order placed successfully!',
        description: 'Your order has been placed and you will be redirected to the payment page.',
      });
      console.log('Order ID:', orderId);
      console.log('Total Price:', totalPrice);
      console.log('User ID:', userId);

      const paymentPageUrl = `/payment?totalPrice=${totalPrice}&orderId=${orderId}&userId=${userId}`;
      console.log('Redirect URL:', paymentPageUrl);

      router.push(paymentPageUrl);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        variant: 'destructive',
        title: 'Checkout failed',
        description: 'There was an error placing your order. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressChange = async (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find((addr) => addr.id === addressId);
  
    if (selectedAddress) {
      try {
        const storeResponse = await axiosInstance().post('/orders/find-nearest-store', {
          deliveryLatitude: selectedAddress.latitude,
          deliveryLongitude: selectedAddress.longitude,
        });
  
        const nearestStoreData = storeResponse.data.data;
        setNearestStore(nearestStoreData);
  
        // Perform inventory check after ensuring nearestStore is set
        const hasInventoryIssues = !(await checkInventory(nearestStoreData));
  
        if (hasInventoryIssues) {
          toast({
            variant: 'destructive',
            title: 'Inventory Issues Detected',
            description: 'Some items are out of stock or insufficiently stocked.',
          });
        } else {
          toast({
            variant: 'default',
            title: 'Inventory Check Passed',
            description: 'All items are available for purchase.',
          });
        }
      } catch (error) {
        console.error('Error fetching nearest store or checking inventory:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an issue with fetching the nearest store or checking inventory.',
        });
      }
    }
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (isLoading) {
    return <div className="text-center text-lg font-medium">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Checkout</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-auto text-left px-20 py-2">
              {addresses.find((addr) => addr.id === selectedAddressId)?.address || 'Select Address'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto left-0">
            {addresses.map((address) => (
              <DropdownMenuItem
                key={address.id}
                onClick={() => handleAddressChange(address.id)}
              >
                {address.address} ({address.zipCode})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {nearestStore && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Nearest Store:</h3>
            <p>Store ID: {nearestStore.storeId}</p>
            <p>Store Address ID: {nearestStore.storeAddressId}</p>
          </div>
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
        <ul className="space-y-4">
          {orderItems.map((item) => (
            <li key={item.id} className="border p-4 rounded">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>
        <Input
          placeholder="Any additional information or notes"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold text-gray-800">Total Price: ${calculateTotalPrice().toFixed(2)}</span>
        <Button
  onClick={handleCheckout}
  disabled={isSubmitting || isCheckingInventory || inventoryIssues.size > 0}
>
  {isSubmitting ? 'Processing...' : 'Place Order'}
</Button>
      </div>
      {isCheckingInventory && <div className="text-center text-lg font-medium mt-4">Checking inventory...</div>}
    </div>
  );
};

export default CheckoutPageView;
