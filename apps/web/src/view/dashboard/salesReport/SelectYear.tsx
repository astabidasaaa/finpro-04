import { Dispatch, SetStateAction } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';

export default function SelectYear({
  years,
  setSelectedYear,
}: {
  years: number[];
  setSelectedYear: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <Select
        defaultValue={years[0].toString()}
        onValueChange={(value) => {
          setSelectedYear(Number(value));
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue defaultChecked={true} />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
