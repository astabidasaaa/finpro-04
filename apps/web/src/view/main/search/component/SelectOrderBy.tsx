import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { OrderBy } from '@/types/productTypes';
import { Dispatch, SetStateAction } from 'react';

export default function SelectOrderBy({
  orderBy,
  setOrderBy,
}: {
  orderBy: string;
  setOrderBy: Dispatch<SetStateAction<string>>;
}) {
  const enumOrderBy = [];
  for (const key in OrderBy) {
    enumOrderBy.push({ key, orderBy: OrderBy[key as keyof typeof OrderBy] });
  }

  return (
    <>
      <Select onValueChange={(value) => setOrderBy(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={OrderBy.nameAsc} />
        </SelectTrigger>
        <SelectContent>
          {enumOrderBy.map((oB, index) => (
            <SelectItem key={index} value={oB.key}>
              {oB.orderBy}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
