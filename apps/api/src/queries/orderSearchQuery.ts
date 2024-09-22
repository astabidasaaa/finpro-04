

import { Prisma } from '@prisma/client';

export const buildOrderSearchQuery = (search?: string): Prisma.OrderWhereInput => {
  if (!search) return {};

  return {
    OR: [
      {
        orderCode: {
          contains: search,
          
        },
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
      {
        store: {
          name: {
            contains: search,
            
          },
        },
      }, 
    ],
  };
};
