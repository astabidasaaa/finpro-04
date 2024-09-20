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
import DialogUseVoucher from './DialogUseVoucher';
import { VoucherDetail } from '@/types/voucherType';

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

  const [isCheckingInventory, setIsCheckingInventory] =
    useState<boolean>(false);
  const [inventoryIssues, setInventoryIssues] = useState<Map<string, string>>(
    new Map(),
  );

  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user.id.toString();

  useEffect(() => {
    const fetchOrderDetailsFromLocalStorage = async () => {
      setIsLoading(true); // Ensure loading state is true when starting the fetch
      try {
        const savedItems = JSON.parse(
          localStorage.getItem('selectedProducts') || '[]',
        );

        if (savedItems.length > 0) {
          const productDetails = await Promise.all(
            savedItems.map((cartItem: { id: string; quantity: number }) =>
              axiosInstance().get(`/orders/get-product/${cartItem.id}`),
            ),
          );

          const mappedItems: OrderItem[] = productDetails.map(
            (response, index) => {
              const product = response.data.data;
              return {
                id: product.id,
                name: product.name,
                quantity: savedItems[index].quantity,
                price: product.price,
                image: product.images[0].title,
              };
            },
          );

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

  // useEffect(() => {
  //   if (userId) {
  //     fetchAddresses(userId);
  //   }
  // }, [userId]);

  // const fetchAddresses = async (userId: string) => {
  //   try {
  //     const response = await axiosInstance().get('/orders/get-addresses', {
  //       params: { userId },
  //     });

  //     setAddresses(response.data.data);
  //   } catch (error) {
  //     console.error('Error fetching addresses:', error);
  //     toast({
  //       variant: 'destructive',
  //       title: 'Failed to fetch addresses',
  //       description: 'Please try again later.',
  //     });
  //   }
  // };

  const checkInventory = async (nearestStoreData: NearestStore) => {
    setIsCheckingInventory(true); // Set loading state to true
    try {
      const response = await axiosInstance().post('/orders/check-inventory', {
        storeId: nearestStoreData.storeId,
        items: orderItems.map((item) => ({
          productId: item.id,
          qtyRequired: item.quantity,
        })),
      });

      const issues = new Map<string, string>();
      response.data.data.forEach(
        (item: { productId: number; isAvailable: boolean }) => {
          if (!item.isAvailable) {
            issues.set(
              item.productId.toString(),
              `Insufficient stock for product ID: ${item.productId}`,
            );
          }
        },
      );

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
        cartItems: orderItems.map((item) => ({
          productId: item.id,
          qty: item.quantity,
        })),
      });

      const orderId = response.data.data.orderId;
      const totalPrice = calculateTotalPrice().toString();

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

  useEffect(() => {
    if (selectedAddressId) {
      handleAddressChange(selectedAddressId);
    }
  }, [selectedAddressId]);

  const handleAddressChange = async (addressId: string) => {
    // setSelectedAddressId(addressId);
    let selectedAddress = null;

    if (addresses) {
      selectedAddress = addresses.find(
        (addr) => addr.id === parseInt(addressId),
      );
    }

    if (selectedAddress) {
      try {
        const storeResponse = await axiosInstance().post(
          '/orders/find-nearest-store',
          {
            deliveryLatitude: selectedAddress.latitude,
            deliveryLongitude: selectedAddress.longitude,
          },
        );

        const nearestStoreData = storeResponse.data.data;
        setNearestStore(nearestStoreData);

        // Perform inventory check after ensuring nearestStore is set
        const hasInventoryIssues = !(await checkInventory(nearestStoreData));

        if (hasInventoryIssues) {
          toast({
            variant: 'destructive',
            title: 'Inventory Issues Detected',
            description:
              'Some items are out of stock or insufficiently stocked.',
          });
        } else {
          toast({
            variant: 'default',
            title: 'Inventory Check Passed',
            description: 'All items are available for purchase.',
          });
        }
      } catch (error) {
        console.error(
          'Error fetching nearest store or checking inventory:',
          error,
        );
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'There was an issue with fetching the nearest store or checking inventory.',
        });
      }
    }
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
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
        <p className="text-base font-light text-muted-foreground max-w-md">
          Ini halaman terakhir dari proses belanja Anda. Pastikan semua
          informasi sudah benar.
        </p>
        <div className="mb-6">
          {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Delivery Address
        </h2> */}
          {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-auto text-left px-20 py-2">
              {addresses.find((addr) => addr.id === selectedAddressId)
                ?.address || 'Select Address'}
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
        </DropdownMenu> */}
          {nearestStore && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Nearest Store:
              </h3>
              <p>Store ID: {nearestStore.storeId}</p>
              <p>Store Address ID: {nearestStore.storeAddressId}</p>
            </div>
          )}
        </div>
        <div className="mb-6">
          <h3 className="mb-2 font-semibold tracking-tight text-base md:text-lg">
            Barang yang dibeli
          </h3>
          <ul className="space-y-4 md:px-4">
            {orderItems.map((item) => {
              return (
                <li
                  key={item.id}
                  className="flex flex-row justify-start items-center gap-4"
                >
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
                      {IDR.format(item.price)}
                    </p>
                    <div className="flex flex-row justify-center items-center gap-2 border rounded-lg px-2 py-2 text-sm w-max">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="!p-1 size-5 !rounded-full"
                      >
                        <Minus />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="!p-1 size-5 !rounded-full"
                      >
                        <Plus />
                      </Button>
                    </div>
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
                  <span>{IDR.format(calculateTotalPrice())}</span>
                </div>
                <div className="flex flex-row justify-between w-full text-sm text-muted-foreground">
                  <span>Total Ongkos Kirim</span>
                  <span>{IDR.format(shipping?.amount || 0)}</span>
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
                  {IDR.format(calculateTotalPrice() + (shipping?.amount || 0))}
                </span>
              </h3>
            </div>
            <Separator />
            <Button
              onClick={handleCheckout}
              disabled={
                isSubmitting || isCheckingInventory || inventoryIssues.size > 0
              }
              className="bg-main-dark hover:bg-main-dark/80"
            >
              {isSubmitting ? 'Diproses...' : 'Pesan Sekarang'}
            </Button>
            {isCheckingInventory && (
              <div className="text-center text-lg font-medium mt-4">
                Checking inventory...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageView;
