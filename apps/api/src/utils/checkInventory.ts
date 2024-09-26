import prisma from '@/prisma';

// Define the type for the result
type InventoryCheckResult = {
  availableStock: number;
  isSufficient: boolean;
};

export async function checkInventoryAvailability(
  storeId: number,
  productId: number,
  qtyRequired: number
): Promise<InventoryCheckResult> {
  try {

    const inventory = await prisma.inventory.findFirst({
      where: {
        storeId,
        productId,
      },
    });


    if (!inventory || inventory.stock < qtyRequired) {
      console.log(
        `Insufficient stock: ${inventory ? inventory.stock : 'No inventory found'}`
      );
      return {
        availableStock: inventory ? inventory.stock : 0,
        isSufficient: false,
      };
    }

    return { availableStock: inventory.stock, isSufficient: true };
  } catch (error) {
    console.error('Failed to check inventory:', error);
    throw new Error('Failed to check inventory');
  }
}
