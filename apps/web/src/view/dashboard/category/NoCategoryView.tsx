import { useAppSelector } from '@/lib/hooks';
import AddCategoryButton from './AddCategoryButton';
import { UserType } from '@/types/userType';

export default function NoCategoryView() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Anda tidak memiliki kategori
          </h3>
          {user.role === UserType.SUPERADMIN && (
            <>
              <p className="text-sm text-muted-foreground">
                Buat kategori Anda sekarang.
              </p>
              <AddCategoryButton />
            </>
          )}
        </div>
      </div>
    </>
  );
}
