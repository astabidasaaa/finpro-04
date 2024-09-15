'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axiosInstance from '@/lib/axiosInstance';
import {
  InventoryProps,
  InventoryUpdateProps,
  UpdateDetail,
  UpdateType,
} from '@/types/inventoryType';
import {
  ProductDetailProps,
  FreeProductProps,
  ProductDiscountProps,
} from '@/types/productTypes';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { LucideStore, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DialogShowInventoryUpdateDetail({
  data,
}: {
  data: InventoryUpdateProps;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductDetailProps | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  async function fetchData() {
    try {
      const productResult = await axiosInstance().get(
        `/products/single-store?productId=${data.inventory.product.id}&storeId=${data.inventory.store.id}`,
      );

      setProduct(productResult.data.data);
      setIsMounted(true);
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('Data is not fetched');
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!isMounted) {
    return null;
  }

  if (product !== undefined) {
    const updateDetailMap = new Map<string, string>(
      Object.entries(UpdateDetail),
    );
    const updateTypeMap = new Map<string, string>(Object.entries(UpdateType));
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="w-full text-left">
            <span className="text-sm w-full">Detail perubahan</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Perubahan Inventaris</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Produk
                </h4>
                <p className="mt-1 text-sm">{product.product.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Subkategori
                </h4>
                <p className="mt-1 text-sm">
                  {product.product.subcategory.name}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <div className="col-span-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Nama Toko
                    </h4>
                    <p className="mt-1 text-sm">{data.inventory.store.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Perubahan Stok
                    </h4>
                    <p className="mt-1 text-sm">{data.stockChange}</p>
                  </div>
                </div>
                <div className="col-span-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Tipe Perubahan
                    </h4>
                    <p className="mt-1 text-sm">
                      {updateTypeMap.get(data.type)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Detail Perubahan
                    </h4>
                    <p className="mt-1 text-sm">
                      {updateDetailMap.get(data.detail)}
                    </p>
                  </div>
                </div>
              </div>

              {data.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Deskripsi
                  </h4>
                  <p className="mt-1 text-sm">{data.description}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }
}
