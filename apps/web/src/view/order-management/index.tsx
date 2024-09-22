'use client'
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { File, ListFilter } from "lucide-react";
import { useAppSelector } from '@/lib/hooks';
import { Badge } from "@/components/ui/badge";
import axiosInstance from '@/lib/axiosInstance';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

type Store = {
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
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounced search term state
  const itemsPerPage = 10; // Items per page
  const user = useAppSelector((state) => state.auth.user);
  const userId = user.id.toString(); // Get the logged-in user's ID
  const userRole = user.role.toString(); // Get the user's role

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    // Cleanup the timeout if the user continues typing
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch user and storeId on mount
  const fetchUserStoreData = async () => {
    try {
      const response = await axiosInstance().get(`/orders/get-user-by-id`, {
        params: { userId }
      });

      const userData = response.data;
      console.log(userData); // For debugging to verify the structure

      // Check if the user has a store and set the selectedStoreId
      if (userData.data && userData.data.store) {
        setSelectedStoreId(userData.data.store.id); // Set the storeId from the nested store object
      }
    } catch (error) {
      console.error('Error fetching user store data:', error);
    }
  };

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
        params: { storeId, page, limit: itemsPerPage, search: debouncedSearchTerm } // Use the debounced search term
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

  useEffect(() => {
    // Fetch user store data only once when the component mounts
    const fetchDataOnMount = async () => {
      await fetchUserStoreData(); // This will set the selectedStoreId if the user has a store
      await fetchStores(); // Fetch all stores
    };

    fetchDataOnMount();
  }, []);

  // Trigger fetching stores and orders when the component mounts or selectedStoreId/currentPage/debouncedSearchTerm changes
  useEffect(() => {
    // Fetch orders whenever selectedStoreId, currentPage, or debouncedSearchTerm changes
    fetchAllOrders(currentPage, selectedStoreId);
  }, [selectedStoreId, currentPage, debouncedSearchTerm]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Update the current page when pagination changes
  };

  const handleStoreSelection = (storeId: number | null) => {
    setSelectedStoreId(storeId);
    setCurrentPage(1); // Reset the page to 1 when a new store is selected
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
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <div className="flex-grow">
            <Input
              type="search"
              placeholder="Cari pesanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
              className="w-full max-w-md"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {userRole === 'super admin' && (
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
                  <DropdownMenuItem onClick={() => handleStoreSelection(null)}>
                    All Stores
                  </DropdownMenuItem>
                  {stores.map((store) => (
                    <DropdownMenuItem
                      key={store.id}
                      onClick={() => handleStoreSelection(store.id)}
                    >
                      {store.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <TabsContent value="week">
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Pesanan</CardTitle>
              <CardDescription>Pesanan terbaru dari toko Anda.</CardDescription>
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
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                        <TableHead></TableHead>
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
                            <Badge
            className={`text-xs px-3 font-semibold ${
              order.orderStatus === 'DIKONFIRMASI'
                ? 'bg-green-400'
                : order.orderStatus === 'DIBATALKAN'
                ? 'bg-red-900'
                : 'bg-main-dark hover:bg-main-dark/80'
            }`}
          >{formatOrderStatus(order.orderStatus)}</Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{order.store?.name || 'Unknown Store'}</TableCell>
                            <TableCell>{IDR.format(order.finalPrice)}</TableCell>
                            <TableCell className="hidden sm:table-cell">{formatDate(order.createdAt)}</TableCell>
                            <TableCell>
                              <Link href={`/dashboard/order-management/${order.id}`} passHref>
                                <Button variant="outline" size="sm" className="ml-auto">
                                  <File className="mr-2 h-4 w-4" />
                                  Details
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No orders available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
      <Pagination className="mt-5 flex justify-center">
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
        >
          Previous
        </PaginationPrevious>
        <PaginationContent>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
        >
          Next
        </PaginationNext>
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
