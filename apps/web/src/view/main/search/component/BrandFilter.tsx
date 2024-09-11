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
      <Collapsible>
        <CollapsibleTrigger className="font-medium">Brand</CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="h-60 lg:h-44 py-2">
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
                className="flex py-0.5 text-gray-600 items-center space-x-2"
              >
                <RadioGroupItem value="0" id="0" />
                <Label htmlFor="0">
                  <span className="font-normal">Semua brand</span>
                </Label>
              </div>
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex py-0.5 text-gray-600 items-center space-x-2"
                >
                  <RadioGroupItem
                    value={brand.id.toString()}
                    id={brand.id.toString()}
                  />
                  <Label htmlFor={brand.id.toString()}>
                    <span className="font-normal">{brand.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
