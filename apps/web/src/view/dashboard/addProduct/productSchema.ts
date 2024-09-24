import { array, number, z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama produk wajib diisi')
    .max(64, 'Nama produk memiliki 64 karakter atau kurang'),
  brandId: z.string().min(1, 'Brand wajib dipilih'),
  subcategoryId: z.string().min(1, 'Subkategori wajib dipilih'),
  description: z.string().min(1, 'Deskripsi produk wajib diisi').trim(),
  productState: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  price: z.coerce.number().positive('Harga harus lebih besar dari 0'),
  product: z
    .array(z.instanceof(File))
    .min(1, 'Produk harus memiliki setidaknya satu gambar'),
});

export const editProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama produk wajib diisi')
    .max(64, 'Nama produk memiliki 64 karakter atau kurang'),
  brandId: z.string().min(1, 'Brand wajib dipilih'),
  subcategoryId: z.string().min(1, 'Subkategori wajib dipilih'),
  description: z.string().min(1, 'Deskripsi produk wajib diisi').trim(),
  productState: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  price: z.coerce.number().positive('Harga harus lebih besar dari 0'),
  product: z.array(z.instanceof(File)),
  imagesToDelete: z.number().array(),
});
