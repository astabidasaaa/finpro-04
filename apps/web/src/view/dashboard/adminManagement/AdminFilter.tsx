import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { UserType } from '@/types/userType';
import { Dispatch, SetStateAction } from 'react';

export default function AdminFilter({
  role,
  setRole,
  setStoreId,
}: {
  role: UserType;
  setRole: Dispatch<SetStateAction<UserType>>;
  setStoreId: Dispatch<SetStateAction<number | undefined>>;
}) {
  const adminRoles = [UserType.STOREADMIN, UserType.SUPERADMIN];

  return (
    <>
      <Select
        defaultValue={role}
        onValueChange={(value: UserType) => {
          setRole(value);
          if (value === UserType.SUPERADMIN) {
            setStoreId(undefined);
          }
        }}
      >
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
