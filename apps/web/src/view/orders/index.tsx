'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAppSelector } from '@/lib/hooks';
import { DatePickerWithRange } from './date-picker';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

// Debounce Hook
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

type Payment = {
  amount: number;
  paymentStatus: string;
  paymentGateway: string;
};

type Order = {
  id: string;
  orderCode: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  payment: Payment;
};

const OrderPageView: React.FC = () => {
  const customer = useAppSelector((state) => state.auth.user);
  const customerId = customer.id.toString();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5); // Items per page

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search input

  // Track which type of orders to view
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
        search: debouncedSearchTerm || undefined, // Only send if searchTerm is present
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
        endpoint = '/get-order/get-orders-by-user'; // All orders
      }

      const response = await axiosInstance().get(endpoint, { params });

      if (isFinishedOrders || isInProgressOrders) {
        setOrders(response.data.data.orders); // When fetching finished or in-progress orders
      } else {
        setOrders(response.data.data); // When fetching all orders
      }
      setTotalPages(response.data.pagination.totalPages); // Assuming API sends total pages
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
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleViewAllOrders = () => {
    setIsFinishedOrders(false);
    setIsInProgressOrders(false); // Reset in-progress state
    setCurrentPage(1); // Reset pagination
  };

  const handleViewFinishedOrders = () => {
    setIsFinishedOrders(true);
    setIsInProgressOrders(false); // Ensure only finished orders are viewed
    setCurrentPage(1); // Reset pagination
  };

  const handleViewInProgressOrders = () => {
    setIsFinishedOrders(false);
    setIsInProgressOrders(true); // Set to view in-progress orders
    setCurrentPage(1); // Reset pagination
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="container px-4 md:px-12 lg:px-24 max-w-screen-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="mb-4 flex gap-4">
        <Button onClick={handleViewAllOrders}>View All Orders</Button>
        <Button onClick={handleViewFinishedOrders} variant="outline">
          View Finished Orders
        </Button>
        <Button onClick={handleViewInProgressOrders} variant="outline">
          View In-Progress Orders
        </Button>
      </div>

      <div className="mb-4 flex gap-4">
        <Input
          type="text"
          placeholder="Search by Order Code"
          className="p-2 border rounded"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <DatePickerWithRange className="mb-4" onSelect={setDateRange} />

      {isLoading && <p className="text-center">Loading...</p>}

      {Array.isArray(orders) && orders.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                <Link href={`/order-list/${order.id}`}>
                  <div className="cursor-pointer">
                    <p className="text-lg font-medium text-blue-600">{order.orderCode}</p>
                    <hr className="my-2 border-gray-300" />
                    <p className="text-sm text-gray-600">Status: {order.orderStatus}</p>
                    <p className="text-sm text-gray-600">Total Amount: Rp{order.payment.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Ordered On: {formatDate(order.createdAt)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
