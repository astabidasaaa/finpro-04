'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import PengirimanCard from './PengirimanCard';
import { NearestStore, OrderItem, TShipping } from '@/types/orderTypes';
import { Address } from '@/types/addressType';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AxiosError } from 'axios';
import DialogUseVoucher from './DialogUseVoucher';
import { VoucherDetail } from '@/types/voucherType';
import { Badge } from '@/components/ui/badge';

type Props = {
  addresses: Address[] | null;
  setAddresses: React.Dispatch<React.SetStateAction<Address[] | null>>;
  selectedAddressId: string;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
  setNearestStore: React.Dispatch<React.SetStateAction<any>>; // Adjust type as needed
  nearestStore: any; // Adjust type as needed
};
const CheckoutPageView = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [addresses, setAddresses] = useState<Address[] | null>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [nearestStore, setNearestStore] = useState<NearestStore | null>(null);
  const [shipping, setShipping] = useState<TShipping | null>(null);

  const [selectedDeliveryVoucher, setSelectedDeliveryVoucher] =
    useState<VoucherDetail | null>(null);
  const [selectedTransactionVoucher, setSelectedTransactionVoucher] =
    useState<VoucherDetail | null>(null);

  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
 
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user.id.toString();

  useEffect(() => {
    const fetchOrderDetailsFromLocalStorage = async () => {
      setIsLoading(true);
      try {
        const storedCheckedItems = JSON.parse(localStorage.getItem('checkedCart') || '[]');

        // Log fetched checked items to verify structure
        console.log('Fetched Checked Items:', storedCheckedItems);

        if (Array.isArray(storedCheckedItems) && storedCheckedItems.length > 0) {
          // Parse each item and map to OrderItem
          const mappedItems: OrderItem[] = storedCheckedItems.map((itemStr: string) => {
            const item = JSON.parse(itemStr); // Parse string to object
            return {
              id: item.productId,
              name: item.name || 'Unknown Name',
              quantity: parseInt(item.quantity, 10) || 0,
              price: parseFloat(item.price) || 0,
              image: item.image || 'default.png',
              discountedPrice: parseFloat(item.discountedPrice) || 0, // New property
              buy: item.buy || 0, // New property
              get: item.get || 0, // New property
            };
          });

          console.log('Mapped Items:', mappedItems);

          setOrderItems(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        // Handle error (e.g., show a toast)
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetailsFromLocalStorage();
  }, []);

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  

  const handleCheckout = async () => {
    setIsSubmitting(true);

    try {
      const updatedCartItems = orderItems.map((item) => ({
        productId: item.id,
        qty: item.quantity, 
        finalQty: calculateFinalQuantity(item),
      }));

      const appliedVouchers = [];
    if (selectedDeliveryVoucher) {
      appliedVouchers.push({
        id: selectedDeliveryVoucher.id,
        type: 'DELIVERY',
      });
    }
    if (selectedTransactionVoucher) {
      appliedVouchers.push({
        id: selectedTransactionVoucher.id,
        type: 'TRANSACTION',
      });
    }

    console.log('Vouchers being sent to backend:', appliedVouchers);
      
      const response = await axiosInstance().post('/orders', {
        customerId: parseInt(userId, 10),
        price: calculateTotalPrice(),
        finalPrice: calculateTotalPriceWithShipping(),
        paymentGateway: 'Manual',
        deliveryAddressId: parseInt(selectedAddressId, 10),
        orderStatus: 'MENUNGGU_PEMBAYARAN',
        additionalInfo: { note: additionalInfo },
        shippingAmount: shipping?.amount || hardcodedShipping.amount,  // Include the shipping amount
      courier: shipping?.courier || hardcodedShipping.courier, // Include the courier information
        cartItems: updatedCartItems,
        vouchers: appliedVouchers,
        })
      
      const orderId = response.data.data.orderId;
      const totalPrice = calculateTotalPriceWithShipping().toString();

      toast({
        variant: null,
        title: 'Order placed successfully!',
        description:
          'Your order has been placed and you will be redirected to the payment page.',
      });
      console.log('Order ID:', orderId);
      console.log('Total Price:', totalPrice);
      console.log('User ID:', userId);

      const paymentPageUrl = `/pembayaran?totalPrice=${totalPrice}&orderId=${orderId}&userId=${userId}`;
      console.log('Redirect URL:', paymentPageUrl);

      router.push(paymentPageUrl);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage = error.response.data?.error || 'There was an error placing your order. Please try again.';
        toast({
          variant: 'destructive',
          title: 'Checkout gagal',
          description: errorMessage,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Checkout gagal',
          description: 'Terjadi error. Tolong coba lagi.',
        });
      }
      console.error('Error placing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const fetchNearestStoreOnLoad = async () => {
      if (!selectedAddressId) return;
      const addressId = parseInt(selectedAddressId, 10);
      console.log('Selected address ID:', selectedAddressId);
      
  
      try {
        // Send the addressId directly
        const storeResponse = await axiosInstance().post(
          '/orders/find-nearest-store',
          {
            addressId: addressId,
          }
        );
  
        const nearestStoreData = storeResponse.data.data;
        setNearestStore(nearestStoreData);
        console.log('nearest store', nearestStoreData)
  
      } catch (error) {
        console.error(
          'Error fetching nearest store or checking inventory:',
          error
        );
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'There was an issue with fetching the nearest store or checking inventory.',
        });
      }
    };
  
    fetchNearestStoreOnLoad();
  }, [selectedAddressId]);
  

  const calculateTotalPrice = () => {
    return orderItems.reduce(
      (total, item) => total + (item.discountedPrice > 0 ? item.discountedPrice : item.price) * item.quantity,
      0,
    );
  };
  const hardcodedShipping = {
    amount: 10000.0, // Hardcoded shipping amount
    courier: 'JNE', // Hardcoded courier
  };

  const calculateTotalPriceWithShipping = () => {
    // Calculate the total for order items before applying discounts
    const originalTotalPrice = calculateTotalPrice();
  
    // Calculate the store discount
    const storeDiscount = calculateStoreDiscount();
  
    // Apply the store discount to the total price
    const itemsTotalWithDiscount = originalTotalPrice - storeDiscount;
  
    // Calculate the shipping cost (with or without delivery voucher)
    const shippingAmount = shipping?.amount || hardcodedShipping.amount;
    const finalShippingAmount = selectedDeliveryVoucher
      ? calculateReducedShippingCost() // Apply reduced shipping cost if delivery voucher is selected
      : shippingAmount;
  
    // Ensure items total is not negative, and add the shipping cost to the discounted total
    return Math.max(itemsTotalWithDiscount, 0) + finalShippingAmount;
  };

  const calculateFinalQuantity = (item: OrderItem) => {
    let finalQuantity = item.quantity;
  
    // Check if the item has a "buy X get Y" promotion
    if (item.buy !== undefined && item.get !== undefined && item.buy > 0 && item.get > 0) {
      // Calculate how many free items to add based on how many sets of "buy X" are in the quantity
      const setsOfBuy = Math.floor(item.quantity / item.buy);
      finalQuantity += setsOfBuy * item.get; // Add free items to the final quantity
    }
  
    return finalQuantity;
  };

  const calculateReducedShippingCost = () => {
    if (!selectedDeliveryVoucher) return shipping?.amount || hardcodedShipping.amount;
  
    const { discountType, discountValue } = selectedDeliveryVoucher.promotion; // Extract type and value
    const originalShippingCost = shipping?.amount || hardcodedShipping.amount;
  
    let reducedShippingCost;
  
    if (discountType === 'FLAT') {
      // For FLAT discount, subtract the discount value directly
      reducedShippingCost = originalShippingCost - discountValue;
    } else if (discountType === 'PERCENT') {
      // For PERCENT discount, reduce the shipping by the percentage of the original amount
      reducedShippingCost = originalShippingCost * (1 - discountValue / 100);
    } else {
      // Default to no discount if the type is unknown
      reducedShippingCost = originalShippingCost;
    }
  
    // Ensure the reduced cost doesn't go below zero
    return Math.max(reducedShippingCost, 0);
  };
  

  const calculateStoreDiscount = () => {
    if (!selectedTransactionVoucher) return 0;
  
    const discountValue = selectedTransactionVoucher.promotion.discountValue; // Get the discount value
    const originalTotalPrice = calculateTotalPrice(); // Fallback to a default if totalPrice is undefined
  
    // Calculate the discount based on the type (percentage or flat)
    if (selectedTransactionVoucher.promotion.discountType === 'PERCENT') {
      // Calculate percentage discount
      return Math.max((originalTotalPrice * discountValue) / 100, 0); 
    } else if (selectedTransactionVoucher.promotion.discountType === 'FLAT') {
      // Subtract flat discount
      return Math.max(discountValue, 0); // Return the flat discount value
    }
  
    return 0; // Ensure total price doesn't go below zero
  };
  

  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  if (isLoading) {
    return <div className="text-center text-lg font-medium">Loading...</div>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_400px] md:gap-8 lg:gap-12 px-4 md:px-12 lg:px-24 max-w-screen-2xl">
      <div className="w-full">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
          Pemesanan Belanja
        </h1>
        <p className="text-base font-light text-muted-foreground max-w-md mb-6">
          Ini halaman terakhir dari proses belanja Anda. Pastikan semua
          informasi sudah benar.
        </p>
        
        <div className="mb-6">
          <h3 className="mb-2 font-semibold tracking-tight text-base md:text-lg">
            Barang yang dibeli
          </h3>
          <ul className="space-y-4 md:px-4">
          {orderItems.map((item) => {
    return (
      <li key={item.id} className="flex flex-row justify-between items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <Image
            src={`${process.env.PRODUCT_API_URL}/${item.image}`}
            alt={item.name}
            width={240}
            height={240}
            className="object-cover object-center size-20 rounded-md"
          />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-normal">{item.name}</p>
            <p className="text-sm font-semibold">
    {item.discountedPrice > 0 ? (
      <span className="line-through text-gray-500">{IDR.format(item.price)}</span>
    ) : (
      IDR.format(item.price)
    )}
  </p>
  
  {/* Display the discounted price below the original price if applicable */}
  {item.discountedPrice > 0 && (
    <p className="text-lg font-semibold text-main-dark">
      {IDR.format(item.discountedPrice)}
    </p>
  )}
  
  {/* Badge for "Buy X Get Y" promotion */}
  {item.buy !== undefined && item.get !== undefined && item.buy > 0 && item.get > 0 && (
    <Badge className="text-sm font-medium py-2 px-4 shadow-md bg-orange-500/70 text-black">
      Beli {item.buy} gratis {item.get}
    </Badge>
  )}
            </div>
        </div>
        <div className="flex items-center gap-2 border rounded-lg px-2 py-2 text-sm w-max">
          <Button
            variant="ghost"
            size="icon"
            className="!p-1 size-5 !rounded-full"
            onClick={() => updateItemQuantity(item.id, Math.max(item.quantity - 1, 0))}
          >
            <Minus />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="!p-1 size-5 !rounded-full"
            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
          >
            <Plus />
          </Button>
        </div>
      </li>
    );
  })}
          </ul>
        </div>
        <div className="mb-6">
          <PengirimanCard
            addresses={addresses}
            setAddresses={setAddresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            nearestStore={nearestStore}
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            shipping={shipping}
            setShipping={setShipping}
          />
        </div>
        <div className="mb-6">
          <h3 className="mb-2 font-semibold tracking-tight text-base md:text-lg">
            Informasi Tambahan
          </h3>
          <Input
            placeholder="Catatan atau informasi tambahan lainnya (opsional)"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>
      </div>
      <div className="">
        <div className="p-0 lg:p-6 lg:border rounded-lg">
          <div className="flex flex-col gap-6">
            <DialogUseVoucher
              selectedDeliveryVoucherId={selectedDeliveryVoucher?.id}
              selectedTransactionVoucherId={selectedTransactionVoucher?.id}
              setDeliveryVoucher={setSelectedDeliveryVoucher}
              setTransactionVoucher={setSelectedTransactionVoucher}
              nearestStore={nearestStore}
              totalPrice={calculateTotalPrice()}
            />
            <Separator />
            <div className="flex flex-col justify-start items-start">
  <h3 className="mb-2 font-semibold tracking-tight text-base md:text-lg">
    Ringkasan Belanja
  </h3>
  <div className="w-full">
    <div className="flex flex-row justify-between w-full text-sm text-muted-foreground">
      <span>Total Harga</span>
      <span className={selectedTransactionVoucher ? 'line-through' : ''}>
        {IDR.format(calculateTotalPrice())}
      </span>
    </div>
    
    {selectedTransactionVoucher && (
      <div className="flex flex-row justify-between w-full text-sm text-muted-foreground mt-1">
        <span>Total Harga Setelah Diskon</span>
        <span>
          {IDR.format(Math.max(calculateTotalPrice() - calculateStoreDiscount(), 0))}
        </span>
      </div>
    )}

    <div className="flex flex-col w-full text-sm text-muted-foreground">
      <div className="flex flex-row justify-between">
        <span>Total Ongkos Kirim</span>
        <span className={selectedDeliveryVoucher ? 'line-through' : ''}>
          {IDR.format(shipping?.amount || hardcodedShipping.amount)}
        </span>
      </div>
      
      {selectedDeliveryVoucher && (
        <div className="flex flex-row justify-between mt-1">
          <span>Total Ongkos Kirim Setelah Diskon</span>
          <span>
            {IDR.format(calculateReducedShippingCost())}
          </span>
        </div>
      )}
    </div>

    <div className="flex flex-row justify-between w-full text-sm text-muted-foreground">
                  <span>Kupon digunakan</span>
                  <span>Ongkir: {selectedDeliveryVoucher?.id}</span>
                  <span>Transaksi: {selectedTransactionVoucher?.id}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col justify-start items-start">
              <h3 className="flex flex-row justify-between w-full font-semibold tracking-tight text-base md:text-lg">
                <span>Total Tagihan</span>
                <span>
                  {IDR.format(calculateTotalPriceWithShipping())}
                </span>
              </h3>
            </div>
            <Separator />
            <Button
              onClick={handleCheckout}
              className="bg-main-dark hover:bg-main-dark/80"
            >
              {isSubmitting ? 'Diproses...' : 'Pesan Sekarang'}
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageView;
