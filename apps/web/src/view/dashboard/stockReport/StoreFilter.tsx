import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { StoreProps } from '@/types/storeTypes';
import { Dispatch, SetStateAction } from 'react';

export default function StoreFilterStock({
  stores,
  setStoreId,
  nearestStore,
}: {
  stores: StoreProps[];
  setStoreId: Dispatch<SetStateAction<number>>;
  nearestStore: number;
}) {
  return (
    <>
      <Select
        defaultValue={nearestStore.toString()}
        onValueChange={(value) => {
          setStoreId(parseInt(value));
        }}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id.toString()}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
