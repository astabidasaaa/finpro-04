import { SelectContent, SelectItem } from '@/components/ui/select';

export default function SelectDuration() {
  return (
    <SelectContent>
      <SelectItem key="0" value={String(1 * 60 * 60 * 24)}>
        1 hari
      </SelectItem>
      <SelectItem key="1" value={String(3 * 60 * 60 * 24)}>
        3 hari
      </SelectItem>
      <SelectItem key="2" value={String(7 * 60 * 60 * 24)}>
        1 minggu
      </SelectItem>
      <SelectItem key="3" value={String(30 * 60 * 60 * 24)}>
        1 bulan
      </SelectItem>
      <SelectItem key="4" value={String(90 * 60 * 60 * 24)}>
        3 bulan
      </SelectItem>
      <SelectItem key="5" value={String(180 * 60 * 60 * 24)}>
        6 bulan
      </SelectItem>
    </SelectContent>
  );
}
