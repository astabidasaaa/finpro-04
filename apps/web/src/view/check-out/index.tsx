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
import { getCartItems, updateCartForUser } from '@/utils/cartUtils';
import { CartItem } from '@/types/cartType';

type Props = {
  addresses: Address[] | null;
  setAddresses: React.Dispatch<React.SetStateAction<Address[] | null>>;
  selectedAddressId: string;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
  setNearestStore: React.Dispatch<React.SetStateAction<any>>; 
  nearestStore: any; 
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

        if (Array.isArray(storedCheckedItems) && storedCheckedItems.length > 0) {

          const mappedItems: OrderItem[] = storedCheckedItems.map((itemStr: string) => {
            const item = JSON.parse(itemStr);
            return {
              id: item.productId,
              name: item.name || 'Unknown Name',
              quantity: parseInt(item.quantity, 10) || 0,
              price: parseFloat(item.price) || 0,
              image: item.image || 'default.png',
              discountedPrice: parseFloat(item.discountedPrice) || 0,
              buy: item.buy || 0,
              get: item.get || 0, 
            };
          });

          setOrderItems(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
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
      const updatedCartItems = orderItems
      .filter((item) => item.quantity > 0) 
      .map((item) => ({
        productId: item.id,
        qty: item.quantity,
        finalQty: calculateFinalQuantity(item),
      }));
      if (updatedCartItems.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Checkout gagal',
          description: 'Tidak ada item dalam keranjang untuk checkout.',
        });
        setIsSubmitting(false);
        return;
      }

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
      
      const response = await axiosInstance().post('/orders', {
        customerId: parseInt(userId, 10),
        price: calculateTotalPrice(),
        finalPrice: calculateTotalPriceWithShipping(),
        paymentGateway: 'Manual',
        deliveryAddressId: parseInt(selectedAddressId, 10),
        orderStatus: 'MENUNGGU_PEMBAYARAN',
        additionalInfo: { note: additionalInfo },
        shippingAmount: calculateReducedShippingCost(),  
      courier: shipping?.courier ,
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

const storedCheckedItems: CartItem[] = JSON.parse(localStorage.getItem('checkedCart') || '[]').map((item: string) => JSON.parse(item));

const userCart: CartItem[] = getCartItems(userId);

const filteredCart = userCart.filter(
  (cartItem: CartItem) => {
    const isInCheckedCart = storedCheckedItems.some((checkedItem: CartItem) => checkedItem.productId === cartItem.productId);
    return !isInCheckedCart; 
  }
);

updateCartForUser(userId, filteredCart);

localStorage.removeItem('checkedCart');

      const paymentPageUrl = `/pembayaran?totalPrice=${totalPrice}&orderId=${orderId}&userId=${userId}`;

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
  const isCheckoutDisabled = () => {
    return orderItems.every((item) => item.quantity === 0);
  };

  useEffect(() => {
    const fetchNearestStoreOnLoad = async () => {
      if (!selectedAddressId) return;
      const addressId = parseInt(selectedAddressId, 10);
      
      try {
        const storeResponse = await axiosInstance().post(
          '/orders/find-nearest-store',
          {
            addressId: addressId,
          }
        );
  
        const nearestStoreData = storeResponse.data.data;
        setNearestStore(nearestStoreData); 
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


  const calculateTotalPriceWithShipping = () => {
    const originalTotalPrice = calculateTotalPrice();

    const storeDiscount = calculateStoreDiscount();

    const itemsTotalWithDiscount = originalTotalPrice - storeDiscount;
    console.log('shipping amount', shipping?.amount)
console.log('calculateReducedShipping', calculateReducedShippingCost())
    const shippingAmount = shipping?.amount || 0;
    const finalShippingAmount = selectedDeliveryVoucher
      ? calculateReducedShippingCost() 
      : shippingAmount;
  

    return Math.max(itemsTotalWithDiscount, 0) + finalShippingAmount;
  };

  const calculateFinalQuantity = (item: OrderItem) => {
    let finalQuantity = item.quantity;
  

    if (item.buy !== undefined && item.get !== undefined && item.buy > 0 && item.get > 0) {

      const setsOfBuy = Math.floor(item.quantity / item.buy);
      finalQuantity += setsOfBuy * item.get; 
    }
  
    return finalQuantity;
  };

  const calculateReducedShippingCost = () => {
    if (!selectedDeliveryVoucher) return shipping?.amount || 0;
  
    const { discountType, discountValue, maxDeduction } = selectedDeliveryVoucher.promotion; 
    const originalShippingCost = shipping?.amount || 0;
    let reducedShippingCost = 0;
  
    if (discountType === 'FLAT') {
      reducedShippingCost = originalShippingCost - discountValue;
    } else if (discountType === 'PERCENT') {
      reducedShippingCost = originalShippingCost * (1 - discountValue / 100);
    } else {
      reducedShippingCost = originalShippingCost;
    }
    reducedShippingCost = Math.max(reducedShippingCost, 0);

    if (discountType === 'PERCENT') {
        const maxShippingDeduction = maxDeduction || 0;
        return Math.min(reducedShippingCost, maxShippingDeduction);
    }

    return reducedShippingCost;
  };
  

  const calculateStoreDiscount = () => {
    if (!selectedTransactionVoucher) return 0;

    const discountValue = selectedTransactionVoucher.promotion.discountValue; 
    const originalTotalPrice = calculateTotalPrice(); 
    const maxDeduction = selectedTransactionVoucher.promotion.maxDeduction || 0; 

    let discount = 0; 
    if (selectedTransactionVoucher.promotion.discountType === 'PERCENT') {
        discount = (originalTotalPrice * discountValue) / 100;
        discount = Math.min(Math.max(discount, 0), maxDeduction);
    } else if (selectedTransactionVoucher.promotion.discountType === 'FLAT') {
        discount = discountValue;
    }

    return Math.max(discount, 0);
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
          {IDR.format(shipping?.amount || 0)}
        </span>
      </div>
      
      {selectedDeliveryVoucher && (
        <div className="flex flex-row justify-between mt-1">
          <span>Total Ongkos Kirim Setelah Diskon</span>
          <span>
            {IDR.format(calculateReducedShippingCost() || 0)}
          </span>
        </div>
      )}
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
              disabled={isSubmitting || isCheckoutDisabled()}
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
