import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';

export default function AdminFilter({
  role,
  setRole,
}: {
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
}) {
  const adminRoles = ['store admin', 'super admin'];

  return (
    <>
      <Select defaultValue={role} onValueChange={(value) => setRole(value)}>
        <SelectTrigger className="w-[300px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {adminRoles.map((role, index) => (
            <SelectItem key={index} value={role}>
              {role.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
