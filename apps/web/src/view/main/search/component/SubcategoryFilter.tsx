import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dispatch, SetStateAction } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SubcategoryProps } from '@/types/subcategoryTypes';

export default function SubcategoryFilter({
  categoryId,
  categories: subcategories,
  setCategoryId,
}: {
  categoryId: string;
  categories: SubcategoryProps[];
  setCategoryId: Dispatch<SetStateAction<number | undefined>>;
}) {
  return (
    <>
      <div>
        <Label className="font-bold">Kategori</Label>
        <div>
          <ScrollArea className="h-60 lg:h-56 py-2">
            <RadioGroup
              defaultChecked={true}
              defaultValue={categoryId ? categoryId : '0'}
              onValueChange={(value) => {
                let number: number | undefined = Number(value);
                if (number === 0) {
                  number = undefined;
                }
                setCategoryId(number);
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
                    Semua kategori
                  </span>
                </Label>
              </div>
              {subcategories.map((category) => (
                <div
                  key={category.id}
                  className="flex justify-start items-center py-0.5 text-muted-foreground gap-2"
                >
                  <RadioGroupItem
                    value={category.id.toString()}
                    id={category.id.toString()}
                    className="!min-w-3 w-3 !h-3"
                  />
                  <Label htmlFor={category.id.toString()}>
                    <span className="font-normal text-[13px] line-clamp-2">
                      {category.name}
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
