import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { displayOrderByMap, OrderByReport } from '@/types/salesType';
import { Dispatch, SetStateAction } from 'react';

export default function SelectOrderBy({
  setOrderBy,
}: {
  setOrderBy: Dispatch<SetStateAction<string>>;
}) {
  const enumOrderBy = [];
  for (const key in OrderByReport) {
    enumOrderBy.push({
      key,
      orderBy: OrderByReport[key as keyof typeof OrderByReport],
    });
  }
  const sortTimeMap = new Map<string, OrderByReport>(
    Object.entries(OrderByReport),
  );

  return (
    <>
      <Select
        defaultValue="nameAsc"
        onValueChange={(value) => {
          const sort = sortTimeMap.get(value) ?? OrderByReport.nameAsc;
          setOrderBy(sort);
        }}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue
            defaultChecked={true}
            placeholder={OrderByReport.nameAsc}
          />
        </SelectTrigger>
        <SelectContent>
          {enumOrderBy.map((oB, index) => (
            <SelectItem key={index} value={oB.key}>
              {displayOrderByMap.get(oB.orderBy)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
