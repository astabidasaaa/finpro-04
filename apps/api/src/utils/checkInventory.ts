
import prisma from '@/prisma';


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