import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { SortTime } from '@/types/inventoryType';
import { Dispatch, SetStateAction } from 'react';

export default function SelectOrderByDetail({
  setOrderBy,
}: {
  setOrderBy: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <Select
        defaultValue="timeDesc"
        onValueChange={(value) => {
          setOrderBy(value);
        }}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue defaultChecked={true} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="timeDesc" value="timeDesc">
            Urutkan Terbaru
          </SelectItem>
          <SelectItem key="timeAsc" value="timeAsc">
            Urutkan Terlama
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
