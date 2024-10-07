

import { Prisma } from '@prisma/client';

export enum OrderStatus {
  MENUNGGU_PEMBAYARAN = 'MENUNGGU_PEMBAYARAN',
  MENUNGGU_KONFIRMASI_PEMBAYARAN = 'MENUNGGU_KONFIRMASI_PEMBAYARAN',
  DIPROSES = 'DIPROSES',
  DIKIRIM = 'DIKIRIM',
  DIKONFIRMASI = 'DIKONFIRMASI',
  DIBATALKAN = 'DIBATALKAN',
}

export const buildOrderSearchQuery = (search?: string): Prisma.OrderWhereInput => {
  if (!search) return {};
  const searchUpperCase = search.toUpperCase();
  const matchingStatuses = Object.values(OrderStatus).filter((status) =>
    status.includes(searchUpperCase)
  );
  
  return {
    OR: [
      {
        orderCode: {
          contains: search,
          
        },
      },
      {
        customer: {
          email: {
            contains: search
          }
        }
      },
      {
        orderStatus: matchingStatuses.length > 0 ? { in: matchingStatuses } : undefined,
      },
      {
        customer: {
          profile: {
            name: {
              contains: search,
              
            },
          },
        },
      },
      
    ],
  };
};
