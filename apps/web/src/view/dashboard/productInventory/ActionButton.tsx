'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axiosInstance from '@/lib/axiosInstance';
import { InventoryProps } from '@/types/inventoryType';
import {
  ProductDetailProps,
  FreeProductProps,
  ProductDiscountProps,
} from '@/types/productTypes';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { LucideStore, ChevronRightCircle, ChevronRight } from 'lucide-react';

export function DialogShowProductDetail({ data }: { data: InventoryProps }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [images, setImages] = useState<
    { id: number; title: string; alt: string | null }[]
  >([]);
  const [product, setProduct] = useState<ProductDetailProps | undefined>();
  const [freeProduct, setFreeProduct] = useState<
    FreeProductProps[] | undefined
  >([]);
  const [discountProduct, setDiscountProduct] = useState<
    ProductDiscountProps[] | undefined
  >([]);
  const [isMounted, setIsMounted] = useState(false);

  async function fetchData() {
    try {
      const productResult = await axiosInstance().get(
        `/products/single-store?productId=${data.productId}&storeId=${data.storeId}`,
      );

      setProduct(productResult.data.data);
      setImages(productResult.data.data.product.images);
      setDiscountProduct(productResult.data.data.productDiscountPerStores);
      setFreeProduct(productResult.data.data.freeProductPerStores);
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

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  if (product !== undefined) {
    let productPrice = product.product.prices[0].price;
    let discountedPrice = productPrice;
    let buy = 0;
    let get = 0;
    if (discountProduct !== undefined && discountProduct.length > 0) {
      if (
        discountProduct.length > 0 &&
        discountProduct[0].discountType === 'FLAT'
      ) {
        discountedPrice = productPrice - discountProduct[0].discountValue;
      } else if (discountProduct[0].discountType === 'PERCENT') {
        discountedPrice =
          (productPrice * (100 - discountProduct[0].discountValue)) / 100;
      }
    }
    if (freeProduct !== undefined && freeProduct.length > 0) {
      buy = freeProduct[0].buy;
      get = freeProduct[0].get;
    }

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="w-full text-left">
            <span className="text-sm w-full">Detail produk</span>
          </button>
        </DialogTrigger>
        <DialogContent aria-describedby="produk-detail">
          <DialogHeader>
            <DialogTitle>Detail Produk</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4 col-span-1">
              <div className="w-full">
                <Image
                  src={
                    `${process.env.PRODUCT_API_URL}/${images[selectedImage].title}` ||
                    '/avatar-placeholder.png'
                  }
                  alt={images[selectedImage].alt || 'Product image'}
                  className="aspect-square w-full object-cover object-center rounded-lg shadow-lg"
                  height={400}
                  width={400}
                  quality={100}
                />
              </div>
              <div className="grid grid-cols-4 gap-2 pt-4">
                {images.map((img, i) => (
                  <Image
                    key={i}
                    src={
                      `${process.env.PRODUCT_API_URL}/${img.title}` ||
                      '/avatar-placeholder.png'
                    }
                    alt={img.alt || 'Product image'}
                    className={`w-full h-auto rounded-md shadow cursor-pointer transition-all duration-300 ${
                      i === selectedImage
                        ? 'ring-2 ring-main-dark'
                        : 'hover:ring-2 hover:ring-main-dark/30'
                    }`}
                    onClick={() => handleThumbnailClick(i)}
                    height={200}
                    width={200}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3 md:space-y-4 col-span-1">
              <div className="flex flex-row text-xs md:text-sm font-normal">
                {product.product.subcategory.productCategory.name}{' '}
                <ChevronRight className="size-4 mx-1.5" />
                {product.product.subcategory.name}
              </div>
              <div className="text-sm md:text-xl font-bold">
                {product.product.name}
              </div>
              <Badge variant="outline" className="text-xs md:text-sm">
                <LucideStore className="size-3 mr-2" />
                {data.store.name}
              </Badge>
              <div className="text-xs md:text-sm">Stok: {data.stock}</div>
              <div className="space-y-1 md:space-y-3">
                {product.productDiscountPerStores.length > 0 ? (
                  <div>
                    <div className="flex flex-row align-middle">
                      <div className="text-xs md:text-md font-normal text-gray-500 line-through">
                        {IDR.format(productPrice)}
                      </div>
                      <Badge className="text-[9px] ml-1 md:ml-2 bg-orange-500/70 font-normal text-black">
                        {product.productDiscountPerStores[0].discountType ===
                        'PERCENT' ? (
                          <>
                            -{product.productDiscountPerStores[0].discountValue}
                            %
                          </>
                        ) : (
                          <>
                            -{' '}
                            {IDR.format(
                              product.productDiscountPerStores[0].discountValue,
                            )}
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="text-sm md:text-xl font-semibold text-main-dark mt-1">
                      {IDR.format(discountedPrice)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm md:text-xl font-semibold text-main-dark ">
                    {IDR.format(productPrice)}
                  </div>
                )}
                {buy != 0 && get != 0 && (
                  <Badge className="text-sm font-medium py-2 px-4 shadow-md bg-orange-500/70 text-black">
                    Beli {buy} gratis {get}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
