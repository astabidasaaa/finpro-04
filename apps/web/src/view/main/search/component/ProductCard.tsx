import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductProps } from '@/types/productTypes';

export default function ProductCard({ product }: { product: ProductProps }) {
  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  return (
    <Link href={`/product/${product.id}`}>
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
            <CardTitle className="text-xs md:text-sm font-bold">
              {product.name}
            </CardTitle>
          </div>
          <CardDescription className="text-xs md:text-sm">
            {IDR.format(product.prices[0].price)}
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full max-w-[360px] h-8 lg:h-10 text-xs text-main-dark border-main-dark"
          >
            <Plus className="size-4 mr-2" />
            Keranjang
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
