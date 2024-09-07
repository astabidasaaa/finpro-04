import { InventoryUpdateType, InventoryUpdateDetail } from '@prisma/client';
import prisma from '@/prisma';





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