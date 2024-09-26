'use client';
import { UserType } from '@/types/userType';
import { AddBrandButton } from './AddBrandButton';
import { useAppSelector } from '@/lib/hooks';

export default function NoBrandView() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Kamu tidak memiliki brand
          </h3>
          {user.role === UserType.SUPERADMIN && (
            <>
              <p className="text-sm text-muted-foreground">Tambah brand</p>
              <AddBrandButton />
            </>
          )}
        </div>
      </div>
    </>
  );
}
