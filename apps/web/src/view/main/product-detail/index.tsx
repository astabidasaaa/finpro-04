'use client';

import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/lib/hooks';
import { AxiosError } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import {
  FreeProductProps,
  ProductDetailProps,
  ProductDiscountProps,
} from '@/types/productTypes';
import { Badge } from '@/components/ui/badge';

export default function ProductDetailView({
  productId,
}: {
  productId: string;
}) {
  const nearestStore = useAppSelector((state) => state.storeId);
  const { storeId } = nearestStore;
  const [quantity, setQuantity] = useState(1);
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

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  async function fetchData() {
    try {
      const productResult = await axiosInstance().get(
        `${process.env.API_URL}/products/single?productId=${productId}&storeId=${storeId}`,
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4 md:col-span-1">
            <img
              src={
                `${process.env.PRODUCT_API_URL}/${images[selectedImage].title}` ||
                '/avatar-placeholder.png'
              }
              alt={
                images[selectedImage].alt == null
                  ? undefined
                  : images[selectedImage].alt
              }
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="grid grid-cols-4 gap-2 pt-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={
                    `${process.env.PRODUCT_API_URL}/${img.title}` ||
                    '/avatar-placeholder.png'
                  }
                  alt={img.alt !== null ? img.alt : undefined}
                  className={`w-full h-auto rounded-md shadow cursor-pointer transition-all duration-300 ${
                    i === selectedImage
                      ? 'ring-2 ring-main-dark'
                      : 'hover:ring-2 hover:ring-main-dark/30'
                  }`}
                  onClick={() => handleThumbnailClick(i)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-6 md:col-span-2">
            <div className="text-lg md:text-xl font-bold">
              {product.product.name}
            </div>
            <div className="space-y-3">
              {product.productDiscountPerStores.length > 0 ? (
                <div>
                  <div className="flex flex-row align-middle">
                    <div className="text-sm md:text-md font-normal text-gray-500 line-through">
                      {IDR.format(productPrice)}
                    </div>
                    <Badge className="text-xs ml-2 bg-orange-500/70 font-normal text-black">
                      {product.productDiscountPerStores[0].discountType ===
                      'PERCENT' ? (
                        <>
                          -{product.productDiscountPerStores[0].discountValue}%
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
                  <div className="text-lg md:text-xl font-semibold text-main-dark mt-1">
                    {IDR.format(discountedPrice)}
                  </div>
                </div>
              ) : (
                <div className="text-lg md:text-xl font-semibold text-main-dark ">
                  {IDR.format(productPrice)}
                </div>
              )}
              {buy != 0 && get != 0 && (
                <Badge className="text-sm font-medium py-2 px-4 shadow-md bg-orange-500/70 text-black">
                  Beli {buy} gratis {get}
                </Badge>
              )}
            </div>
            <div className="flex flex-row justify-between md:gap-10 md:justify-end">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-48">
                <Plus className="size-4 mr-2" />
                Keranjang
              </Button>
            </div>
            <div className="text-gray-600 text-xs md:text-sm">
              {product?.product.description}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
}
