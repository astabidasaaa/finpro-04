import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProductProps, State } from '@/types/productTypes';
import { ChevronRight, Eye } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { displayStateMap } from '@/types/promotionType';

export default function SeeDetailDialogButton({
  product,
}: {
  product: ProductProps;
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="sr-only" />
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4 col-span-1">
            <div className="w-full">
              <Image
                src={
                  `${process.env.PRODUCT_API_URL}/${product.images[selectedImage].title}` ||
                  '/avatar-placeholder.png'
                }
                alt={product.images[selectedImage].alt || 'Product image'}
                className="aspect-square w-full object-cover object-center rounded-lg shadow-lg"
                height={400}
                width={400}
                quality={100}
              />
            </div>
            <div className="grid grid-cols-4 gap-2 pt-4">
              {product.images.map((img, i) => (
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
              {product.subcategory.productCategory.name}{' '}
              <ChevronRight className="size-4 mx-1.5" />
              {product.subcategory.name}
            </div>
            <div className="text-md md:text-xl font-bold">{product.name}</div>
            <div className="text-sm md:text-base font-semibold">
              {product.brand ? product.brand.name : '-'}
            </div>
            <div className="text-sm md:text-xl font-semibold text-main-dark">
              {IDR.format(product.prices[0].price)}
            </div>
            <Badge
              variant={
                product.productState === State.PUBLISHED
                  ? 'default'
                  : 'secondary'
              }
              className={
                product.productState === State.PUBLISHED
                  ? 'bg-green-400'
                  : product.productState === State.DRAFT
                    ? 'bg-amber-400'
                    : 'bg-red-400'
              }
            >
              {displayStateMap.get(product.productState)}
            </Badge>
            <div className="text-xs font-normal text-black/60">
              Terakhir diperbarui {moment(product.updatedAt).format('ll')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
