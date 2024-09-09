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
      <Collapsible>
        <CollapsibleTrigger className="font-medium">
          Kategori
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="h-60 lg:h-44 py-2">
            <RadioGroup
              defaultChecked={true}
              defaultValue={categoryId !== '' ? categoryId : '0'}
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
                className="flex py-0.5 text-gray-600 items-center space-x-2"
              >
                <RadioGroupItem value="0" id="0" />
                <Label htmlFor="0">
                  <span className="font-normal">Semua kategori</span>
                </Label>
              </div>
              {subcategories.map((category) => (
                <div
                  key={category.id}
                  className="flex py-0.5 text-gray-600 items-center space-x-2"
                >
                  <RadioGroupItem
                    value={category.id.toString()}
                    id={category.id.toString()}
                  />
                  <Label htmlFor={category.id.toString()}>
                    <span className="font-normal">{category.name}</span>
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
