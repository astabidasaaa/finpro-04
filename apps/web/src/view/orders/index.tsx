'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAppSelector } from '@/lib/hooks';
import { DatePickerWithRange } from './date-picker';
import { DateRange } from 'react-day-picker';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import PaginationComponent from './PaginationComponent';
import { Order } from '@/types/paymentTypes';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const OrderPageView: React.FC = () => {
  const customer = useAppSelector((state) => state.auth.user);
  const customerId = customer.id.toString();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5); 
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); 
  const [isFinishedOrders, setIsFinishedOrders] = useState<boolean>(false);
  const [isInProgressOrders, setIsInProgressOrders] = useState<boolean>(false);

  useEffect(() => {
    if (customerId) {
      fetchOrders();
    }
  }, [customerId, dateRange, currentPage, debouncedSearchTerm, isFinishedOrders, isInProgressOrders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        customerId: parseInt(customerId, 10),
        page: currentPage,
        pageSize: limit,
        search: debouncedSearchTerm || undefined, 
      };

      if (dateRange?.from && dateRange.to) {
        params.from = dateRange.from.toISOString();
        params.to = dateRange.to.toISOString();
      }
      let endpoint = '';
      if (isFinishedOrders) {
        endpoint = '/get-order/get-finished-orders-by-user';
      } else if (isInProgressOrders) {
        endpoint = '/get-order/get-unfinished-orders-by-user';
      } else {
        endpoint = '/get-order/get-orders-by-user'; 
      }
      const response = await axiosInstance().get(endpoint, { params });
      if (isFinishedOrders || isInProgressOrders) {
        setOrders(response.data.data.orders); 
      } else {
        setOrders(response.data.data); 
      }
      const fetchedOrders = response.data.data.orders || response.data.data; 

      setTotalPages(response.data.pagination.totalPages); 
      if (!fetchedOrders.length) {
        toast({
          variant: 'destructive', 
          title: 'No Orders Found',
          description: 'There are no orders matching your criteria.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch orders',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleViewAllOrders = () => {
    setIsFinishedOrders(false);
    setIsInProgressOrders(false); 
    setCurrentPage(1); 
  };

  const handleViewFinishedOrders = () => {
    setIsFinishedOrders(true);
    setIsInProgressOrders(false); 
    setCurrentPage(1); 
  };
  const handleViewInProgressOrders = () => {
    setIsFinishedOrders(false);
    setIsInProgressOrders(true); 
    setCurrentPage(1); 
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };
  const handlePaymentRedirect = (totalPrice: number, orderId: string) => {
    const paymentPageUrl = `/pembayaran?totalPrice=${totalPrice}&orderId=${orderId}&userId=${customerId}`;
    router.push(paymentPageUrl);
  };
  const formatOrderStatus = (status: string) => {
    return status.replace(/_/g, ' ');
  };
  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });
  return (
    <div className="container px-4 md:px-12 lg:px-24 max-w-screen-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Riwayat Pesanan</h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <Button onClick={handleViewAllOrders} variant="outline">Semua Pesanan</Button>
        <Button onClick={handleViewFinishedOrders} variant="outline">
          Pesanan Selesai
        </Button>
        <Button onClick={handleViewInProgressOrders} variant="outline">
          Pesanan Dalam Progress
        </Button>
      </div>
      <div className="mb-4 flex gap-4">
        <Input
          type="text"
          placeholder="Cari Kode Pesanan"
          className="p-2 border rounded w-[300px]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <DatePickerWithRange className="mb-4" onSelect={setDateRange} />
      {isLoading && <p className="text-center">Loading...</p>}
      {Array.isArray(orders) && orders.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pesanan Anda</h2>
          <ul className="space-y-4 mb-4">
            {orders.map((order) => (
              <li key={order.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                <Link href={`/order-list/${order.id}`}>
                  <div className="cursor-pointer">
                    <p className="text-lg font-medium">{order.orderCode}</p>
                    
                    <hr className="my-2 border-gray-300" />
                    <Badge
            className={`text-xs px-3 font-semibold mb-1 ${
              order.orderStatus === 'DIKONFIRMASI'
                ? 'bg-green-400'
                : order.orderStatus === 'DIBATALKAN'
                ? 'bg-red-900'
                : 'bg-main-dark hover:bg-main-dark/80'
            }`}
          >{formatOrderStatus(order.orderStatus)}</Badge>
                    <p className="mt-2 text-xs md:text-lg">Total Pembayaran: {IDR.format(order.payment.amount)}</p>
                    <p className="mt-2 text-xs md:text-lg">Tanggal Pemesanan: {formatDate(order.createdAt)}</p>
                    
                  </div>
                </Link>
                {order.orderStatus === 'MENUNGGU_PEMBAYARAN' && (
                  <Button
                    className="mt-4"
                    onClick={() => handlePaymentRedirect(order.payment.amount, order.id)}
                  >
                    Bayar
                  </Button>
                )}
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-500">No orders found for this customer.</p>
        </div>
      )}
    </div>
  );
};

export default OrderPageView;
