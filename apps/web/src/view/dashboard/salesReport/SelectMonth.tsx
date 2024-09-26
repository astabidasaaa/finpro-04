import { Dispatch, SetStateAction } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { MONTHS } from '@/types/salesType';

export default function SelectMonth({
  setSelectedMonth,
}: {
  setSelectedMonth: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <Select
        defaultValue={(new Date().getMonth() + 1).toString()}
        onValueChange={(value) => {
          setSelectedMonth(Number(value));
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue defaultChecked={true} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(MONTHS)
            .filter(([key]) => isNaN(Number(key))) // Filter out numeric keys
            .map(([key, value]) => (
              <SelectItem key={value} value={value.toString()}>
                {key}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </>
  );
}
