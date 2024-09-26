import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { SortTime } from '@/types/inventoryType';
import { Dispatch, SetStateAction } from 'react';

export default function SelectOrderBy({
  setOrderBy,
}: {
  setOrderBy: Dispatch<SetStateAction<SortTime>>;
}) {
  const enumOrderBy = [];
  for (const key in SortTime) {
    enumOrderBy.push({ key, orderBy: SortTime[key as keyof typeof SortTime] });
  }
  const sortTimeMap = new Map<string, SortTime>(Object.entries(SortTime));

  return (
    <>
      <Select
        defaultValue="TIMEDESC"
        onValueChange={(value) => {
          const sort = sortTimeMap.get(value) ?? SortTime.TIMEDESC;
          setOrderBy(sort);
        }}
      >
        <SelectTrigger className="max-w-[220px]">
          <SelectValue defaultChecked={true} placeholder={SortTime.TIMEDESC} />
        </SelectTrigger>
        <SelectContent>
          {enumOrderBy.map((oB, index) => (
            <SelectItem key={index} value={oB.key}>
              {oB.orderBy === SortTime.TIMEDESC
                ? 'Urutkan Terbaru'
                : 'Urutkan Terlama'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
