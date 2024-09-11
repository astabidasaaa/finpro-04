import { Button } from '@/components/ui/button';
import { AddBrandButton } from './AddBrandButton';

export default function NoBrandView() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no brands
          </h3>
          <p className="text-sm text-muted-foreground">
            Create your brand below.
          </p>
          <AddBrandButton />
        </div>
      </div>
    </>
  );
}
