'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import axiosInstance from '@/lib/axiosInstance';
import { ProductStockChange } from '@/types/salesType';
import { useContext, useEffect, useState } from 'react';
import { StockReportContext } from '.';
import { getCookie } from 'cookies-next';
import { InventoryUpdateProps } from '@/types/inventoryType';
import ProductStockReportTable from './ProductStockReportTable';
import SelectOrderByDetail from './SelectOrderByDetail';

export default function DetailStockDialog({
  product,
}: {
  product: ProductStockChange;
}) {
  const token = getCookie('access-token');
  const [inventoryUpdates, setInventoryUpdates] = useState<
    InventoryUpdateProps[]
  >([]);
  const [orderBy, setOrderBy] = useState<string>('timeDesc');
  const { selectedMonth, selectedYear } = useContext(StockReportContext);

  async function fetchData() {
    const inventoryProductResult = await axiosInstance().get(
      `${process.env.API_URL}/inventories/detail/change?month=${selectedMonth}&year=${selectedYear}&inventoryId=${product.inventoryId}&orderBy=${orderBy}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setInventoryUpdates(inventoryProductResult.data.data);
  }

  useEffect(() => {
    fetchData();
  }, [orderBy, product]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="h-7 font-medium">
          Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-md md:text-lg">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5 p-1 pb-4">
          <SelectOrderByDetail setOrderBy={setOrderBy} />
          <ProductStockReportTable data={inventoryUpdates} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
