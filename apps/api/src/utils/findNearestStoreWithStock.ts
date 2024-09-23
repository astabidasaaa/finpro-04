import { calculateDistance } from './calculateDistance'; // Import your calculateDistance function
import prisma from '@/prisma';
export async function findAnotherStoreWithStock(
  latitude: number,
  longitude: number,
  productId: number,
  qty: number
) {
  // Fetch stores that have stock for the given product and quantity
  const storesWithStock = await prisma.store.findMany({
    where: {
      storeState: 'PUBLISHED',
      inventories: {
        some: {
          productId,
          stock: { gte: qty }, // Ensure the store has stock >= the required quantity
        },
      },
    },
    include: {
      addresses: {
        where: { deleted: false }, // Ensure the address is active
        select: {
          latitude: true,
          longitude: true,
        },
      },
    },
  });

  // Check if any stores are found
  if (storesWithStock.length === 0) {
    return null; // No stores found with sufficient stock
  }

  // Sort the stores by distance from the provided latitude/longitude
  const sortedStores = storesWithStock.sort((a, b) => {
    const addressA = a.addresses[0]; // Assuming you are using the latest address
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
    return distanceA - distanceB; // Sort stores by ascending distance
  });

  // Return the nearest store with sufficient stock
  return sortedStores.length > 0 ? sortedStores[0] : null;
}
