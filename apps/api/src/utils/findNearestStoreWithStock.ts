import { calculateDistance } from './calculateDistance'; 
import prisma from '@/prisma';
export async function findAnotherStoreWithStock(
  latitude: number,
  longitude: number,
  productId: number,
  qty: number
) {
  const storesWithStock = await prisma.store.findMany({
    where: {
      storeState: 'PUBLISHED',
      inventories: {
        some: {
          productId,
          stock: { gte: qty }, 
        },
      },
    },
    include: {
      addresses: {
        where: { deleted: false }, 
        select: {
          latitude: true,
          longitude: true,
        },
      },
    },
  });

  if (storesWithStock.length === 0) {
    return null; 
  }


  const sortedStores = storesWithStock.sort((a, b) => {
    const addressA = a.addresses[0]; 
    const addressB = b.addresses[0];

    const distanceA = calculateDistance(
      latitude,
      longitude,
      parseFloat(addressA.latitude),
      parseFloat(addressA.longitude)
    );
    const distanceB = calculateDistance(
      latitude,
      longitude,
      parseFloat(addressB.latitude),
      parseFloat(addressB.longitude)
    );
    return distanceA - distanceB;
  });

  return sortedStores.length > 0 ? sortedStores[0] : null;
}
