'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NoProductView() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Anda tidak memiliki produk
          </h3>
          <p className="text-sm text-muted-foreground">
            Buat produk Anda sekarang.
          </p>
          <Button onClick={() => router.push('/dashboard/product/add-product')}>
            <Plus className="h-4 w-4 mr-2" />
            Produk
          </Button>
        </div>
      </div>
    </>
  );
}
