import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/hooks';
import { UserType } from '@/types/userType';
import { Edit } from 'lucide-react';
import Link from 'next/link';

export default function EditProductButton({
  productId,
}: {
  productId: number;
}) {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      {user.role === UserType.SUPERADMIN && (
        <Link href={`/dashboard/product/edit/${productId}`}>
          <Button variant="outline" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </>
  );
}
