import { InventoryUpdateType, InventoryUpdateDetail } from '@prisma/client';
import prisma from '@/prisma';



export const findNearestStore = async (
  deliveryLatitude: string,
  deliveryLongitude: string
) => {
  // Fetch all stores with non-deleted addresses
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
        nearestStore = { storeId: store.id, storeAddressId: storeAddress.id };
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

export async function checkInventoryAvailability(
  storeId: number,
  productId: number,
  qtyRequired: number
): Promise<boolean> {
  try {
    console.log(`Checking inventory: Store ID: ${storeId}, Product ID: ${productId}, Required Quantity: ${qtyRequired}`);

    const inventory = await prisma.inventory.findFirst({
      where: {
        storeId,
        productId,
      },
    });

    console.log(`Inventory found: ${JSON.stringify(inventory)}`);

    if (!inventory || inventory.stock < qtyRequired) {
      console.log(`Insufficient stock: ${inventory ? inventory.stock : 'No inventory found'}`);
      return false;
    }

    return true;
  } catch (error) {
    
    throw new Error('Failed to check inventory');
  }
}


export async function updateInventoryStock(
  storeId: number,
  productId: number,
  qtyChange: number,
  orderId: number,
  customerId: number
) {
  const inventory = await prisma.inventory.findFirst({
    where: {
      storeId,
      productId,
    },
  });

  if (!inventory) {
    return null;
  }

  if (inventory.stock + qtyChange < 0) {
    // Insufficient stock
    return null;
  }

  const updatedInventory = await prisma.inventory.update({
    where: { id: inventory.id },
    data: {
      stock: inventory.stock + qtyChange,
    },
  });

  await prisma.inventoryUpdate.create({
    data: {
      creatorId: customerId,
      inventoryId: updatedInventory.id,
      type: qtyChange > 0 ? InventoryUpdateType.ADD : InventoryUpdateType.REMOVE,
      detail: qtyChange > 0 ? InventoryUpdateDetail.CANCELLED_ORDER : InventoryUpdateDetail.STOCK_OUT,
      description: `Order #${orderId} - Stock ${qtyChange > 0 ? 'restored' : 'deducted'}`,
      stockChange: qtyChange,
    },
  });

  return updatedInventory;
}