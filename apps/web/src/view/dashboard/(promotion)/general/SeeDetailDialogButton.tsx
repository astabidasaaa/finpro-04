import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DiscountType, State } from '@/types/productTypes';
import {
  displayPromotionSourceMap,
  displayPromotionTypeMap,
  displayStateMap,
  NonProductPromotionProps,
  PromotionScope,
} from '@/types/promotionType';
import {
  CalendarIcon,
  Clock,
  DollarSign,
  Eye,
  Percent,
  ShoppingCart,
  Store,
  Tag,
  TicketPercent,
  Wallet,
} from 'lucide-react';
import moment from 'moment';

export default function SeeDetailDialogButton({
  promotion,
}: {
  promotion: NonProductPromotionProps;
}) {
  let IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{promotion.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            {promotion.banner !== null && (
              <div className="w-full h-full">
                <Image
                  src={`${process.env.PROMOTION_API_URL}/${promotion.banner}`}
                  alt={promotion.name}
                  width={600}
                  height={200}
                  className="object-cover object-center w-full h-full max-h-[100px] sm:max-h-[160px] md:max-h-[240px] lg:max-h-[280px]"
                />
              </div>
            )}
            <div>
              <Badge
                variant={
                  promotion.promotionState === State.PUBLISHED
                    ? 'default'
                    : 'secondary'
                }
                className={
                  promotion.promotionState === State.PUBLISHED
                    ? 'bg-green-400'
                    : promotion.promotionState === State.DRAFT
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                }
              >
                {displayStateMap.get(promotion.promotionState)}
              </Badge>
              {promotion.isFeatured && (
                <Badge variant="outline" className="ml-2">
                  Unggulan
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>
                {moment(promotion.startedAt).format('L')} -{' '}
                {moment(promotion.finishedAt).format('L')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Store className="w-4 h-4" />
              <span>
                <Badge>
                  {promotion.scope === PromotionScope.GENERAL
                    ? 'UMUM'
                    : `${promotion.storeId}`}
                </Badge>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>
                <Badge className="bg-main-dark">
                  {displayPromotionSourceMap.get(promotion.source)}
                </Badge>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TicketPercent className="w-4 h-4" />
              <span className="font-semibold">
                DISKON {displayPromotionTypeMap.get(promotion.promotionType)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Jumlah kupon:</span>
              <span>{promotion.quota}</span>
            </div>
            <div>
              <h4 className="font-semibold">Deskripsi</h4>
              <p>{promotion.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Percent className="w-4 h-4" />
              <span>
                Diskon: {promotion.discountValue}
                {promotion.discountType === DiscountType.PERCENT ? '%' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                Durasi: {Math.floor(promotion.discountDurationSecs / 86400)}{' '}
                hari
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>
                Minimal belanja:{' '}
                {promotion.minPurchase > 0
                  ? IDR.format(promotion.minPurchase)
                  : '-'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span>
                Maksimal pemotongan:{' '}
                {promotion.maxDeduction > 0
                  ? IDR.format(promotion.maxDeduction)
                  : '-'}
              </span>
            </div>
            {promotion.afterMinTransaction && (
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>
                  Didapatkan setelah: {promotion.afterMinTransaction} transaksi
                </span>
              </div>
            )}
            {promotion.afterMinPurchase && (
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>
                  Didapatkan setelah belanja:{' '}
                  {IDR.format(promotion.afterMinPurchase)}
                </span>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
