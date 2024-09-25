import { array, number, z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 1;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

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
    .min(1, 'Produk harus memiliki setidaknya satu gambar')
    .max(8, 'Produk hanya boleh memiliki maksimal 8 gambar')
    .refine((files) =>
      files.every((file) => !file || file.size <= MAX_UPLOAD_SIZE, {
        message: 'Ukuran maksimal avatar 1MB',
      }),
    )
    .refine((files) =>
      files.every((file) => ACCEPTED_FILE_TYPES.includes(file?.type || ''), {
        message: 'Ekstensi file hanya bisa .png, .jpg, atau .jpeg',
      }),
    ),
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
  product: z
    .array(z.instanceof(File))
    .refine((files) =>
      files.every((file) => !file || file.size <= MAX_UPLOAD_SIZE, {
        message: 'Ukuran maksimal avatar 1MB',
      }),
    )
    .refine((files) =>
      files.every((file) => ACCEPTED_FILE_TYPES.includes(file?.type || ''), {
        message: 'Ekstensi file hanya bisa .png, .jpg, atau .jpeg',
      }),
    ),
  imagesToDelete: z.number().array(),
});
