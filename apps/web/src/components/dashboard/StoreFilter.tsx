import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { StoreProps } from '@/types/storeTypes';
import { Dispatch, SetStateAction } from 'react';

export default function StoreFilter({
  stores,
  setStoreId,
}: {
  stores: StoreProps[];
  setStoreId: Dispatch<SetStateAction<number | undefined>>;
}) {
  return (
    <>
      <Select
        defaultValue="0"
        onValueChange={(value) => {
          let number: number | undefined = Number(value);
          if (number === 0) {
            number = undefined;
          }
          setStoreId(number);
        }}
      >
        <SelectTrigger className="max-w-[300px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="0" value="0">
            Semua Toko
          </SelectItem>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id.toLocaleString()}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
