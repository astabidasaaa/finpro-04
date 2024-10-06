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
import { CartItem } from '@/types/cartType';
import { getCookie } from 'cookies-next';

const CheckoutPageView = () => {
  const token = getCookie('access-token');
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

  const fetchProductDetailsFromCheckedCart = async () => {
    setIsLoading(true); 
    try {
      const storedCheckedItems = JSON.parse(localStorage.getItem('checkedCart') || '{}');
      const userCheckedItems = storedCheckedItems[userId]; 
  
      if (Array.isArray(userCheckedItems) && userCheckedItems.length > 0) {
        const productDetailsPromises = userCheckedItems.map(async (item: { productId: number; storeId: number; quantity: number }) => {
          const storeIdToUse = nearestStore ? nearestStore.storeId : item.storeId;

        const productResult = await axiosInstance().get(
          `${process.env.API_URL}/products/single-store?productId=${item.productId}&storeId=${storeIdToUse}`
        );
          const productData = productResult.data.data;
          if (productData) {
            let productPrice = productData.product.prices[0].price;
            let discountedPrice = productPrice;
            let buy = 0;
            let get = 0;
  
            const discountProduct = productData.productDiscountPerStores;
            const freeProduct = productData.freeProductPerStores;
  
            if (discountProduct && discountProduct.length > 0) {
              if (discountProduct[0].discountType === 'FLAT') {
                discountedPrice = productPrice - discountProduct[0].discountValue;
              } else if (discountProduct[0].discountType === 'PERCENT') {
                discountedPrice = (productPrice * (100 - discountProduct[0].discountValue)) / 100;
              }
            }
  
            if (freeProduct && freeProduct.length > 0) {
              buy = freeProduct[0].buy;
              get = freeProduct[0].get;
            }
  
            return {
              id: item.productId.toString(), 
              name: productData.product.name,
              quantity: item.quantity, 
              price: productPrice,
              image: productData.product.images[0]?.title || 'default.png',
              discountedPrice,
              buy,
              get,
              storeId: item.storeId.toString(), 
            };
          }
  
          return undefined;
        });
  
        const products = await Promise.all(productDetailsPromises);
        const validProducts = products.filter((product) => product !== undefined) as OrderItem[];
        setOrderItems(validProducts);
      } 
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch cart items',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false); 
    }
  };
  
  useEffect(() => {
    fetchProductDetailsFromCheckedCart();
  }, [nearestStore]);

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
      if (!selectedAddressId) {
        toast({
          variant: 'destructive',
          title: 'Checkout gagal',
          description: 'Anda harus memilih alamat pengiriman.',
        });
        setIsSubmitting(false);
        return;
      }

      const updatedCartItems = orderItems
      .filter((item) => item.quantity > 0) 
      .map((item) => ({
        productId: parseInt(item.id),
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
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      
      const orderId = response.data.data.orderId;
      const totalPrice = calculateTotalPriceWithShipping().toString();

      toast({
        variant: null,
        title: 'Checkout sukses!',
        description:
          'Pesanan Anda sudah diterima dan Anda akan diarahkan ke halaman pembayaran.',
      });

      const storedCheckedItems: { [key: string]: CartItem[] } = JSON.parse(
        localStorage.getItem('checkedCart') || '{}'
      );
  
      const userCheckedItems = storedCheckedItems[userId] || [];
  
      const userCart: { [key: string]: CartItem[] } = JSON.parse(
        localStorage.getItem('cart') || '{}'
      );
  
      const currentUserCart = userCart[userId] || [];
  
      const filteredCart = currentUserCart.filter(
        (cartItem: CartItem) =>
          !userCheckedItems.some(
            (checkedItem: CartItem) => checkedItem.productId === cartItem.productId
          )
      );
  
      userCart[userId] = filteredCart;
      localStorage.setItem('cart', JSON.stringify(userCart));

      delete storedCheckedItems[userId];
      localStorage.setItem('checkedCart', JSON.stringify(storedCheckedItems));

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
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
  
        const nearestStoreData = storeResponse.data.data;
        setNearestStore(nearestStoreData); 
      } catch (error) {
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

  useEffect(() => {
    let vouchers: string[] = [];
    if (selectedDeliveryVoucher) {
      if (
        calculateTotalPrice() < selectedDeliveryVoucher.promotion.minPurchase
      ) {
        setSelectedDeliveryVoucher(null);
        vouchers.push('ongkos kirim');
      }
    }

    if (selectedTransactionVoucher) {
      if (
        calculateTotalPrice() < selectedTransactionVoucher.promotion.minPurchase
      ) {
        setSelectedTransactionVoucher(null);
        vouchers.push('transaksi');
      }
    }

    if (vouchers.length > 0) {
      const removeVouchers = vouchers.join(' dan ');
      toast({
        variant: 'default',
        title: 'Kupon tidak dapat digunakan',
        description: `Kupon ${removeVouchers} tidak memenuhi syarat minimal belanja`,
      });
    }
  }, [calculateTotalPrice()]);

  const calculateTotalPriceWithShipping = () => {
    const originalTotalPrice = calculateTotalPrice();

    const storeDiscount = calculateStoreDiscount();

    const itemsTotalWithDiscount = Math.max(originalTotalPrice - storeDiscount, 0);
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

    if (discountType === 'PERCENT' && maxDeduction > 0) {
      const maxShippingDeduction = maxDeduction || 0;
      reducedShippingCost = Math.min(reducedShippingCost, originalShippingCost - maxShippingDeduction);
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
        if (maxDeduction > 0) {
          discount = Math.min(Math.max(discount, 0), maxDeduction);
        }
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
            {orderItems.map((item: OrderItem) => {
              return (
                <li
                  key={item.id}
                  className="flex flex-row justify-between items-center gap-4 border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={`${process.env.PRODUCT_API_URL}/${item.image}`}
                      alt={item.name}
                      width={240}
                      height={240}
                      className="object-cover object-center size-20 rounded-md"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-normal [overflow-wrap:anywhere]">
                        {item.name}
                      </p>
                      <p className="text-sm font-semibold">
                        {item.discountedPrice !== item.price ? (
                          <>
                            <span className="line-through text-muted-foreground/80">
                              {IDR.format(item.price)}
                            </span>
                            <p className="text-lg font-semibold text-main-dark">
                              {IDR.format(item.discountedPrice)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-semibold text-main-dark">
                            {IDR.format(item.price)}
                          </p>
                        )}
                      </p>
                      {item.buy !== undefined &&
                        item.get !== undefined &&
                        item.buy > 0 &&
                        item.get > 0 && (
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
                      onClick={() =>
                        updateItemQuantity(
                          item.id,
                          Math.max(item.quantity - 1, 0),
                        )
                      }
                    >
                      <Minus />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="!p-1 size-5 !rounded-full"
                      onClick={() =>
                        updateItemQuantity(item.id, item.quantity + 1)
                      }
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
          <h3 className="mb-2 font-semibold tracking-tight text-base md:text-lg">
            Toko Terdekat
          </h3>
          {nearestStore ? (
            <p className="ml-4 text-sm font-normal [overflow-wrap:anywhere]">
              {nearestStore.name}
            </p>
          ) : (
            <p className="ml-4 text-sm text-gray-500">Toko terdekat belum tersedia</p>
          )}
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
