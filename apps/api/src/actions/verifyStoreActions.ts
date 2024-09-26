

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findNearestStore = async (
    deliveryLatitude: string,
    deliveryLongitude: string
  ) => {
    const stores = await prisma.store.findMany({
      include: {
        addresses: {
          where: { deleted: false },
        },
      },
    });
  
    if (stores.length === 0) {
      throw new Error('No stores found');
    }
  
    const storeDistances = stores.map(store => {
      const distances = store.addresses.map(address => ({
        storeId: store.id,
        storeAddressId: address.id,
        distance: calculateDistance(
          deliveryLatitude,
          deliveryLongitude,
          address.latitude,
          address.longitude
        ),
      }));
  
      return distances;
    }).flat();
  
    return storeDistances;
  };

const calculateDistance = (
  lat1: string,
  lon1: string,
  lat2: string,
  lon2: string
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; 

  const dLat = toRad(parseFloat(lat2) - parseFloat(lat1));
  const dLon = toRad(parseFloat(lon2) - parseFloat(lon1));
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(parseFloat(lat1))) *
      Math.cos(toRad(parseFloat(lat2))) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

