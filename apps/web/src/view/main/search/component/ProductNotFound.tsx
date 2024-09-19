import Image from 'next/image';

export default function ProductNotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 mx-auto text-sm md:text-lg font-semibold pt-10">
      <Image
        alt="not found"
        className="aspect-square object-cover"
        height={100}
        width={100}
        src="/not-found.png"
      />
      Produk tidak ditemukan
    </div>
  );
}
