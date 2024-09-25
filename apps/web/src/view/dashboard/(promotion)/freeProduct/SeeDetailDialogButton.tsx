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
import { State } from '@/types/productTypes';
import {
  displayStateMap,
  FreeProductPromotionProps,
} from '@/types/promotionType';
import { CalendarIcon, Eye, Store, TicketPercent } from 'lucide-react';
import moment from 'moment';

export default function SeeDetailDialogButton({
  promotion,
}: {
  promotion: FreeProductPromotionProps;
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
          <DialogTitle>{promotion.inventory.product.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <div>
              <Badge
                variant={
                  promotion.freeProductState === State.PUBLISHED
                    ? 'default'
                    : 'secondary'
                }
                className={
                  promotion.freeProductState === State.PUBLISHED
                    ? 'bg-green-400'
                    : promotion.freeProductState === State.DRAFT
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                }
              >
                {displayStateMap.get(promotion.freeProductState)}
              </Badge>
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
                <Badge>{promotion.inventory.store.name}</Badge>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TicketPercent className="w-4 h-4" />
              <span className="font-semibold">
                Beli {promotion.buy} Gratis {promotion.get}
              </span>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
