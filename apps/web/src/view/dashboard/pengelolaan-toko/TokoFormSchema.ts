import { z } from 'zod';

export const formSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(1, { message: 'Nama toko wajib diisi' })
    .max(32, { message: 'Nama toko maksimal berisi 32 karakter' }),
  storeState: z
    .string()
    .trim()
    .refine((val) => ['ARCHIVED', 'DRAFT', 'PUBLISHED'].includes(val), {
      message: 'Status toko tidak sesuai',
    }),
  storeAddress: z
    .object({
      address: z
        .string()
        .trim()
        .min(1, { message: 'Alamat wajib diisi' })
        .max(100, { message: 'Alamat maksimal 100 karakter' }),
      latitude: z
        .string()
        .min(1, { message: 'Pinpoint alamat wajib diisi' })
        .max(32, { message: 'Latitude maksimal 32 karakter' }),
      longitude: z
        .string()
        .min(1, { message: 'Pinpoint alamat wajib diisi' })
        .max(32, { message: 'Longitude maksimal 32 karakter' }),
    })
    .refine(
      (storeAddress) => {
        if (
          typeof storeAddress.address !== 'string' ||
          typeof storeAddress.latitude !== 'string' ||
          typeof storeAddress.longitude !== 'string'
        ) {
          return false;
        }
        return true;
      },
      { message: 'Alamat toko tidak valid' },
    ),
  storeAdmins: z
    .array(z.number())
    .optional()
    .refine((adminIds) => adminIds?.every((id) => typeof id === 'number'), {
      message: 'Admin tidak valid',
    }),
});
