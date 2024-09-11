'use client';

import Link from "next/link";
import {
  File, ListFilter
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Store {
  id: number;
  name: string;
}

const OrderManagementView = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const itemsPerPage = 10; // Items per page

  const fetchStores = async () => {
    try {
      const response = await axiosInstance().get('/get-order/get-all-stores');
      setStores(response.data.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchAllOrders = async (page = 1, storeId?: number | null) => {
    setIsLoading(true);
    try {
      const endpoint = storeId 
        ? '/get-order/get-orders-by-store' 
        : '/get-order/get-all-order';
        
      const response = await axiosInstance().get(endpoint, {
        params: { storeId, page, limit: itemsPerPage }
      });
      
      // Set orders based on the response
      setOrders(storeId ? response.data.data.orders : response.data.data);
      
      // Ensure totalPages is set correctly
      setTotalPages(storeId ? response.data.data.totalPages : response.data.totalPages);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  // Trigger fetching stores and orders when the component mounts or selectedStoreId/currentPage changes
  useEffect(() => {
    fetchStores();
    fetchAllOrders(currentPage, selectedStoreId); // Fetch orders based on selected store or all stores
  }, [selectedStoreId, currentPage]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update the current page when pagination changes
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Store</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Store</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setSelectedStoreId(null);
                  fetchAllOrders(1); // Fetch all orders when "All Stores" is selected
                }}>
                  All Stores
                </DropdownMenuItem>
                {stores.map((store) => (
                  <DropdownMenuItem
                    key={store.id}
                    onClick={() => setSelectedStoreId(store.id)}
                  >
                    {store.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div>

        <TabsContent value="week">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Orders</CardTitle>
              <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Store</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
  {Array.isArray(orders) && orders.length > 0 ? (
    orders.map((order: any) => (
      <TableRow key={order.id}>
        <TableCell>
          <div className="font-medium">{order.customer?.profile?.name || 'Unknown Customer'}</div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <Badge className="text-xs">{order.orderStatus}</Badge>
        </TableCell>
        <TableCell>{order.store?.name || 'Unknown Store'}</TableCell>
        <TableCell>Rp{order.finalPrice.toFixed(2)}</TableCell>
        <TableCell>{formatDate(order.createdAt)}</TableCell>
        <TableCell>
          <Link href={`/dashboard/order-management/${order.id}`} passHref>
            <Button variant="outline" size="sm" className="ml-auto">
              Details
            </Button>
          </Link>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5}>No orders found</TableCell>
    </TableRow>
  )}
</TableBody>
                  </Table>

                  {/* Pagination Component */}
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        />
                      </PaginationItem>
                      {[...Array(totalPages).keys()].map((page) => (
                        <PaginationItem key={page + 1}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page + 1}
                            onClick={() => handlePageChange(page + 1)}
                          >
                            {page + 1}
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderManagementView;
