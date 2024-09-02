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
  const [userId, setUserId] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [nearestStore, setNearestStore] = useState<NearestStore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [inventoryIssues, setInventoryIssues] = useState<Map<string, string>>(
    new Map()
  ); // Track inventory issues
  const router = useRouter(); 

  useEffect(() => {
    const fetchOrderDetailsFromLocalStorage = async () => {
      const savedItems = JSON.parse(localStorage.getItem('selectedProducts') || '[]');

      if (savedItems.length > 0) {
        try {
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
        } catch (error) {
          console.error('Error fetching product details:', error);
          toast({
            variant: 'destructive',
            title: 'Failed to fetch product details',
            description: 'Please try again later.',
          });
        }
      }

      setIsLoading(false);
    };

    fetchOrderDetailsFromLocalStorage();
  }, []);

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

  const checkInventory = async () => {
    try {
      const response = await axiosInstance().post('/orders/check-inventory', {
        storeId: nearestStore?.storeId,
        items: orderItems.map(item => ({
          productId: item.id,
          qtyRequired: item.quantity,
        })),
      });

      const issues = new Map<string, string>();
      response.data.data.forEach((item: { productId: number, isAvailable: boolean }) => {
        if (!item.isAvailable) {
          issues.set(
            item.productId.toString(),
            `Insufficient stock for product ID: ${item.productId}`
          );
        }
      });

      setInventoryIssues(issues);
      return issues.size === 0; // Return true if no issues
    } catch (error) {
      console.error('Error checking inventory:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to check inventory',
        description: 'Please try again later.',
      });
      return false;
    }
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);

    if (!(await checkInventory())) {
      setIsSubmitting(false);
      return; // Don't proceed with checkout if there are inventory issues
    }

    try {
      const response = await axiosInstance().post('/orders', {
        customerId: parseInt(userId, 10),
        price: calculateTotalPrice(), // This should be calculated based on the order items
        finalPrice: calculateTotalPrice(), // This might differ if discounts are applied
        paymentGateway: 'MidTrans', // Hardcoded example, adjust as needed
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

      // Log the constructed URL object
    // console.log('Redirect URL:', {
    //   pathname: '/payment',
    //   query: {
    //     totalPrice: totalPrice,
    //     orderId: orderId.toString(),
    //     userId: userId.toString(),
    //   },
    // });

    // // Redirect to PaymentView with the total price
    // router.push({
    //   pathname: '/payment',
    //   query: {
    //     totalPrice: totalPrice,
    //     orderId: orderId,
    //     userId: userId,
    //   },
    // });

    const paymentPageUrl = `/payment?totalPrice=${totalPrice}&orderId=${orderId}&userId=${userId}`;
    console.log('Redirect URL:', paymentPageUrl);

    router.push(paymentPageUrl);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Checkout failed',
        description: 'There was an error placing your order. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUserId = e.target.value;
    setUserId(newUserId);
    if (newUserId) {
      fetchAddresses(newUserId);
    }
  };

  const handleAddressChange = async (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find((addr) => addr.id === addressId);

    if (selectedAddress) {
      try {
        // Fetch the nearest store based on the selected address
        const storeResponse = await axiosInstance().post('/orders/find-nearest-store', {
          deliveryLatitude: selectedAddress.latitude,
          deliveryLongitude: selectedAddress.longitude,
        });

        setNearestStore(storeResponse.data.data);

        // Check inventory availability for the items
        const hasInventoryIssues = !(await checkInventory());

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Checkout</h1>
      <div>
        <h2>Order Items</h2>
        <ul>
          {orderItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} x Rp{item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Total Price: Rp{calculateTotalPrice().toFixed(2)}</h3>
      </div>
      <div>
        <h2>User ID</h2>
        <Input value={userId} onChange={handleUserIdChange} />
      </div>
      <div>
        <h2>Delivery Address</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              {addresses.find((addr) => addr.id === selectedAddressId)?.address || 'Select Address'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
          <div>
            <h3>Nearest Store</h3>
            <p>Store ID: {nearestStore.storeId}</p>
            <p>Store Address ID: {nearestStore.storeAddressId}</p>
          </div>
        )}
      </div>
      <div>
        <h2>Additional Information</h2>
        <Input
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Enter any additional information for your order"
        />
      </div>
      <div>
        {Array.from(inventoryIssues.values()).map((issue, index) => (
          <p key={index} style={{ color: 'red' }}>{issue}</p>
        ))}
      </div>
      <Button
        onClick={handleCheckout}
        disabled={isSubmitting || !selectedAddressId}
      >
        {isSubmitting ? 'Processing...' : 'Checkout'}
      </Button>
    </div>
  );
};

export default CheckoutPageView;
