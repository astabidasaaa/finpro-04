import { Input } from '@/components/ui/input';
import { Dispatch, SetStateAction } from 'react';

export function LowPriceFilter({
  lowPrice,
  setLowPrice,
}: {
  lowPrice: number | undefined;
  setLowPrice: Dispatch<SetStateAction<number | undefined>>;
}) {
  return (
    <Input
      className="text-xs"
      placeholder="Minimal"
      type="number"
      value={lowPrice !== undefined ? lowPrice : ''}
      onChange={(e) =>
        setLowPrice(e.target.value ? Number(e.target.value) : undefined)
      }
    />
  );
}

export function HighPriceFilter({
  highPrice,
  setHighPrice,
}: {
  highPrice: number | undefined;
  setHighPrice: Dispatch<SetStateAction<number | undefined>>;
}) {
  return (
    <Input
      className="text-xs"
      placeholder="Maksimal"
      type="number"
      value={highPrice !== undefined ? highPrice : ''}
      onChange={(e) =>
        setHighPrice(e.target.value ? Number(e.target.value) : undefined)
      }
    />
  );
}
