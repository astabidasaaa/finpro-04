
import prisma from '@/prisma';



export const findNearestStore = async (
  deliveryLatitude: string,
  deliveryLongitude: string
) => {
  // Fetch all stores with non-deleted addresses
  const stores = await prisma.store.findMany({
    where: {
      storeState: 'PUBLISHED', 
    },
    include: {
      addresses: {
        where: { deleted: false },
      },
    },
  });

  if (stores.length === 0) {
    throw new Error('No stores found');
  }

  let nearestStore = null;
  let minDistance = Infinity;

  for (const store of stores) {
    for (const storeAddress of store.addresses) {
      const distance = calculateDistance(
        deliveryLatitude,
        deliveryLongitude,
        storeAddress.latitude,
        storeAddress.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestStore = { storeId: store.id, storeAddressId: storeAddress.id, distance };
      }
    }
  }

  if (!nearestStore) {
    throw new Error('No suitable store found');
  }

  return nearestStore;
};

const calculateDistance = (
  lat1: string,
  lon1: string,
  lat2: string,
  lon2: string
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRad(parseFloat(lat2) - parseFloat(lat1));
  const dLon = toRad(parseFloat(lon2) - parseFloat(lon1));
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(parseFloat(lat1))) *
      Math.cos(toRad(parseFloat(lat2))) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};