'use client';

import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/lib/hooks';
import { addToCart } from '@/utils/cartUtils';
import { AxiosError } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import {
  FreeProductProps,
  ProductDetailProps,
  ProductDiscountProps,
} from '@/types/productTypes';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { IDR } from '@/lib/utils';

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

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id?.toString();
  async function fetchData() {
    try {
      const productResult = await axiosInstance().get(
        `${process.env.API_URL}/products/single-store?productId=${productId}&storeId=${storeId}`,
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

    const handleAddToCart = () => {
      if (!product || !userId) {
        alert('User not logged in or product not available.');
        return;
      }

      const finalDiscountedPrice = discountedPrice === productPrice ? null : discountedPrice;

  
      const cartItem = {
        productId: product.product.id,
        name: product.product.name,
        price: productPrice,        
        discountedPrice: finalDiscountedPrice,          
        quantity,
        userId,
        image: images[0]?.title,
        buy,                        
        get,                      
      };
      addToCart(cartItem);
      alert('Product added to cart!'); 
    };

    return (
      <div className="flex flex-col justify-start items-center px-4 md:px-12 lg:px-24 w-full">
        <div className="flex flex-col md:flex-row max-w-screen-lg gap-8">
          <div className="flex flex-col justify-start items-start gap-8">
            <div className="w-full max-w-[480px]">
              <Image
                src={
                  `${process.env.PRODUCT_API_URL}/${images[selectedImage].title}` ||
                  '/avatar-placeholder.png'
                }
                alt={images[selectedImage].alt || 'Product image'}
                className="aspect-square w-full object-cover object-center rounded-lg shadow-lg"
                height={480}
                width={480}
                quality={100}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <Image
                  key={i}
                  src={
                    `${process.env.PRODUCT_API_URL}/${img.title}` ||
                    '/avatar-placeholder.png'
                  }
                  alt={img.alt || 'Product image'}
                  className={`w-28 md:w-40 h-auto rounded-md shadow cursor-pointer transition-all duration-300 ${
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
          <div className="flex flex-col justify-start gap-8 w-full">
            <div className="flex flex-col justify-start gap-4 w-full">
              <div className="flex flex-col justify-start gap-2 w-full">
                <h1 className='className="text-lg md:text-xl font-bold'>
                  {product.product.name}
                </h1>
                <p className="text-muted-foreground/80">
                  <span>
                    {product.product.subcategory.productCategory.name}
                  </span>{' '}
                  - <span>{product.product.subcategory.name}</span>
                </p>
              </div>
              <div className="flex flex-col justify-start w-full gap-4">
                {product.productDiscountPerStores.length > 0 ? (
                  <div className="flex flex-col justify-start w-full gap-4">
                    <div className="text-2xl md:text-[28px] font-semibold text-main-dark mt-1">
                      {IDR.format(discountedPrice)}
                    </div>
                    <div className="flex flex-row align-middle">
                      <div className="text-base md:text-lg font-normal text-muted-foreground/80 line-through">
                        {IDR.format(productPrice)}
                      </div>
                      <Badge className="text-xs ml-2 bg-destructive/10 text-destructive">
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
                  </div>
                ) : (
                  <div className="text-lg md:text-xl font-semibold text-main-dark ">
                    {IDR.format(productPrice)}
                  </div>
                )}
                {buy != 0 && get != 0 && (
                  <div className="text-sm w-max text-center font-semibold rounded-full bg-destructive/10 text-destructive py-1 px-3">
                    Beli {buy} gratis {get}
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex flex-col justify-start gap-4 w-full md:w-max">
              <span className="font-semibold">Atur Jumlah</span>
              <div className="flex items-center justify-center md:justify-start w-max gap-2 p-3 border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQuantity}
                  className="h-max w-max p-1"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-12 h-max p-0 text-center border-none"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={increaseQuantity}
                  className="h-max w-max p-1"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-row justify-between md:gap-16">
                <span className="text-muted-foreground/80">Subtotal</span>
                <span className="w-48 font-bold text-lg text-end">
                  {IDR.format(quantity * discountedPrice)}
                </span>
              </div>
              <Button className="w-full bg-main-dark hover:bg-main-dark/80" onClick={handleAddToCart}>
                <Plus className="size-4 mr-2" />
                Keranjang
              </Button>
            </div>
            <Separator />
            <div className="flex flex-col justify-start w-full gap-4">
              <span className="font-semibold">Deskripsi Produk</span>
              <div className="text-primary text-sm">
                {product?.product.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
}
