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
import { truncateText } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function ProductCard({
  product,
  storeName,
}: {
  product: ProductProps;
  storeName: string | undefined;
}) {
  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  let discountedPrice = 0;
  let buy = 0;
  let get = 0;
  const productDiscount = product.inventories[0].productDiscountPerStores;
  const freeProduct = product.inventories[0].freeProductPerStores;
  if (productDiscount.length > 0) {
    if (productDiscount[0].discountType === 'PERCENT') {
      discountedPrice =
        (product.prices[0].price * (100 - productDiscount[0].discountValue)) /
        100;
    } else {
      discountedPrice =
        product.prices[0].price - productDiscount[0].discountValue;
    }
  }
  if (freeProduct.length > 0) {
    buy = freeProduct[0].buy;
    get = freeProduct[0].get;
  }

  return (
    <Link
      className="col-span-3 md:col-span-2 lg:col-span-1"
      href={`/product/${product.id}`}
    >
      <Card>
        <CardHeader>
          <Image
            alt={product.name}
            className="aspect-square w-56 object-cover"
            height={400}
            width={400}
            src={
              `${process.env.PRODUCT_API_URL}/${product.images[0].title}` ||
              '/avatar-placeholder.png'
            }
          />
          <div className="flex justify-start items-center h-8 md:h-10">
            <CardTitle className="text-xs md:text-sm lg:text-xs font-semibold">
              {truncateText(product.name, 35)}
            </CardTitle>
          </div>
          <CardDescription className="flex flex-col justify-start pt-1 md:text-sm h-10">
            {productDiscount.length > 0 ? (
              <div>
                <div className="text-xs font-normal text-gray-500 line-through">
                  {IDR.format(product.prices[0].price)}
                </div>
                <div className="md:text-sm font-semibold text-main-dark mt-1">
                  {IDR.format(discountedPrice)}
                </div>
              </div>
            ) : (
              <div className="md:text-sm font-semibold text-main-dark">
                {IDR.format(product.prices[0].price)}
              </div>
            )}
            {buy != 0 && get != 0 && (
              <div className="text-[10px] max-w-20 text-center font-medium rounded-lg mt-1 bg-orange-500/70 text-black">
                Beli {buy} gratis {get}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="-my-2">
          <Badge variant="outline" className="text-xs">
            <LucideStore className="size-3 mr-2" />
            {storeName}
          </Badge>
        </CardContent>
        <CardFooter>
          {product.inventories[0].stock > 0 ? (
            <Button
              variant="outline"
              className="w-full max-w-[360px] h-8 lg:h-9 text-xs text-main-dark border-main-dark -p-3"
            >
              <Plus className="h-3 w-3 mr-1 text-main-dark" />
              <span className="text-xs">Keranjang</span>
            </Button>
          ) : (
            <Button className="w-full max-w-[360px] h-8 lg:h-9 text-xs bg-gray-600 font-normal border-main-dark -p-3">
              <span className="text-xs">Stok kosong</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
