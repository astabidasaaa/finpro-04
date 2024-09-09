import AddSubcategoryButton from './AddSubcategoryButton';

export default function NoSubcategoryView() {
  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Anda tidak memiliki subkategori
          </h3>
          <p className="text-sm text-muted-foreground">
            Buat subkategori Anda sekarang.
          </p>
          <AddSubcategoryButton />
        </div>
      </div>
    </>
  );
}
