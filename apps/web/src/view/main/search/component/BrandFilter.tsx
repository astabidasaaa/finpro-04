import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BrandProps } from '@/types/brandTypes';
import { Dispatch, SetStateAction } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function BrandFilter({
  brands,
  setBrandId,
}: {
  brands: BrandProps[];
  setBrandId: Dispatch<SetStateAction<number | undefined>>;
}) {
  return (
    <>
      <div>
        <Label className="font-bold">Brand</Label>
        <div>
          <ScrollArea className="h-60 lg:h-56 py-2">
            <RadioGroup
              defaultChecked={true}
              defaultValue="0"
              onValueChange={(value) => {
                let number: number | undefined = Number(value);
                if (number === 0) {
                  number = undefined;
                }
                setBrandId(number);
              }}
            >
              <div
                key="semua"
                className="flex justify-start items-center py-0.5 text-muted-foreground gap-2"
              >
                <RadioGroupItem
                  value="0"
                  id="0"
                  className="!min-w-3 w-3 !h-3"
                />
                <Label htmlFor="0">
                  <span className="font-normal text-[13px] line-clamp-2">
                    Semua brand
                  </span>
                </Label>
              </div>
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex justify-start items-center py-0.5 text-muted-foreground gap-2"
                >
                  <RadioGroupItem
                    value={brand.id.toString()}
                    id={brand.id.toString()}
                    className="!min-w-3 w-3 !h-3"
                  />
                  <Label htmlFor={brand.id.toString()}>
                    <span className="font-normal text-[13px] line-clamp-2">
                      {brand.name}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
