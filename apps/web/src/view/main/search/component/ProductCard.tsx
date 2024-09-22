import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Plus, LucideStore } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductProps } from '@/types/productTypes';
import { IDR } from '@/lib/utils';

export default function ProductCard({
  product,
  storeName,
}: {
  product: ProductProps;
  storeName: string | undefined;
}) {
  const productDiscount = product.inventories[0]?.productDiscountPerStores?.[0];
  const freeProduct = product.inventories[0]?.freeProductPerStores?.[0];

  const discountedPrice = productDiscount
    ? productDiscount.discountType === 'PERCENT'
      ? (product.prices[0].price * (100 - productDiscount.discountValue)) / 100
      : product.prices[0].price - productDiscount.discountValue
    : 0;

  const buy = freeProduct?.buy ?? 0;
  const get = freeProduct?.get ?? 0;

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="flex flex-col border-0 sm:border shadow-none sm:shadow-sm h-full">
        <CardHeader className="p-0 sm:p-4 sm:pb-0 md:p-6 md:pb-0">
          <Image
            alt={product.name}
            className="aspect-square object-cover"
            height={400}
            width={400}
            src={
              `${process.env.PRODUCT_API_URL}/${product?.images[0]?.title}` ||
              '/avatar-placeholder.png'
            }
          />
          <CardTitle className="sr-only">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-1.5 h-full p-0 sm:p-4 sm:pt-0 sm:pb-2.5 md:p-6 md:pt-0 md:pb-2.5 mt-1">
          <div className="flex justify-start items-center">
            <div className="text-xs font-semibold line-clamp-2">
              {product.name}
            </div>
          </div>
          <div className="flex flex-col justify-start gap-1 md:text-sm">
            {discountedPrice ? (
              <div className="flex flex-col justify-start items-start w-full">
                <CardDescription className="text-xs md:text-sm font-bold text-main-dark">
                  {IDR.format(discountedPrice)}
                </CardDescription>
                <div className="text-[10px] text-muted-foreground/80 font-medium line-through">
                  {IDR.format(product.prices[0].price)}
                </div>
              </div>
            ) : (
              <CardDescription className="text-xs md:text-sm font-semibold text-main-dark">
                {IDR.format(product.prices[0].price)}
              </CardDescription>
            )}
            {buy != 0 && get != 0 && (
              <div className="text-[10px] w-max text-center font-semibold rounded-full bg-destructive/10 text-destructive px-2.5">
                Beli {buy} gratis {get}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 p-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0 mt-1">
          <div className="flex flex-row items-center text-muted-foreground text-[10px]">
            <span className="p-1 rounded-full bg-muted mr-1.5">
              <LucideStore className="size-3" />
            </span>
            {storeName}
          </div>
          <Button
            variant="outline"
            className={`w-full max-w-[360px] h-8 lg:h-9 text-xs text-main-dark border-main-dark -p-3 hover:text-main-dark/80 ${product.inventories[0].stock <= 0 && 'border-border text-muted-foreground bg-muted'}`}
            onClick={(e) => {
              e.preventDefault();
              console.log('first');
            }}
            disabled={product.inventories[0].stock <= 0}
          >
            {product.inventories[0].stock > 0 ? (
              <>
                <Plus className="h-3 w-3 mr-1" />
                <span className="text-xs">Keranjang</span>
              </>
            ) : (
              <span className="text-xs">Stok kosong</span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
