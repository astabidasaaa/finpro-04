'use client'
import React, { useState, useEffect } from 'react';
import { ListFilter } from "lucide-react";
import { useAppSelector } from '@/lib/hooks';
import axiosInstance from '@/lib/axiosInstance';
import { getCookie } from 'cookies-next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent  } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from '@/components/ui/use-toast';
import PaginationComponent from './PaginationComponent';
import OrderTable from './OrderTable';
type Store = {
  id: number;
  name: string;
}

const OrderManagementView = () => {
  const token = getCookie('access-token');
  const [orders, setOrders] = useState<any[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); 
  const itemsPerPage = 10;
  const user = useAppSelector((state) => state.auth.user);
  const userId = user.id.toString(); 
  const userRole = user.role.toString();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);


    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  const fetchUserStoreData = async () => {
    try {
      const response = await axiosInstance().get(`/orders/get-user-by-id`, {
        params: { userId }, headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      
    );
      const userData = response.data;

      if (userData.data && userData.data.store) {
        setSelectedStoreId(userData.data.store.id); 
      }
    } catch (error) {
      console.error('Error fetching user store data:', error);
    }
  };
  const fetchStores = async () => {
    try {
      const response = await axiosInstance().get('/get-order/get-all-stores',{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },);
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
        params: { storeId, page, limit: itemsPerPage, search: debouncedSearchTerm }, headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    

      setOrders(storeId ? response.data.data.orders : response.data.data);

      setTotalPages(storeId ? response.data.data.totalPages : response.data.totalPages);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Order tidak ditemukan',
        description: 'Tidak ada order yang memenuhi kriteria Anda',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataOnMount = async () => {
      await fetchUserStoreData();
      await fetchStores(); 
    };
    fetchDataOnMount();
  }, []);


  useEffect(() => {
    fetchAllOrders(currentPage, selectedStoreId);
  }, [selectedStoreId, currentPage, debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page); 
  };
  const handleStoreSelection = (storeId: number | null) => {
    setSelectedStoreId(storeId);
    setCurrentPage(1); 
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
              placeholder="Cari customer/status pesanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
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
                  <OrderTable orders={orders} />
                  <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
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
