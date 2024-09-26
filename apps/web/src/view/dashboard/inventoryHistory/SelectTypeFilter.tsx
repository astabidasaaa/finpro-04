import { Dispatch, SetStateAction } from 'react';
import {
  InventoryUpdateType,
  SortTime,
  UpdateType,
} from '@/types/inventoryType';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SelectFilterType({
  setFilterType,
}: {
  setFilterType: Dispatch<SetStateAction<InventoryUpdateType | undefined>>;
}) {
  const enumFilterType = [];
  for (const key in InventoryUpdateType) {
    enumFilterType.push({
      key,
      orderBy: InventoryUpdateType[key as keyof typeof InventoryUpdateType],
    });
  }
  const filterTypeMap = new Map<string, InventoryUpdateType>(
    Object.entries(InventoryUpdateType),
  );

  return (
    <>
      <Select
        defaultValue="all"
        onValueChange={(value) => {
          const filter = filterTypeMap.get(value) ?? undefined;
          setFilterType(filter);
        }}
      >
        <SelectTrigger className="max-w-[220px]">
          <SelectValue defaultChecked={true} placeholder={SortTime.TIMEDESC} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="default" value="all">
            Semua Tipe
          </SelectItem>
          {enumFilterType.map((oB, index) => (
            <SelectItem key={index} value={oB.key}>
              {oB.orderBy === InventoryUpdateType.ADD
                ? 'Tipe Tambah'
                : 'Tipe Kurang'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
