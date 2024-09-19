import { PrismaClient } from '@prisma/client';
import { HttpException } from '@/errors/httpException'; // Replace with your HttpException import
import { checkInventoryAvailability } from './checkInventory'; // Adjust the import path
import { findAnotherStoreWithStock } from './findNearestStoreWithStock';
import { updateInventoryStock } from './updateInventoryStock';

const prisma = new PrismaClient();

export async function handleStockAndMutations(
    cartItems: { productId: number; qty: number }[],
    deliveryAddress: { latitude: string; longitude: string },
    nearestStoreId: number,
    orderId: number,
    customerId: number
  ): Promise<void> {
    try {
      const latitude = parseFloat(deliveryAddress.latitude);
      const longitude = parseFloat(deliveryAddress.longitude);
  
      for (const item of cartItems) {
        const { productId, qty } = item;
        const inventory = await checkInventoryAvailability(nearestStoreId, productId, qty);
  
        if (!inventory.isSufficient) {
          // If inventory is insufficient, handle partial fulfillment or mutation
          if (inventory.availableStock > 0) {
            console.log(`Partially fulfilling with available stock: ${inventory.availableStock}`);
  
            await updateInventoryStock(
              nearestStoreId,
              productId,
              -inventory.availableStock,
              orderId,
              customerId
            );
  
            const remainingQty = qty - inventory.availableStock;
  
            const alternateStore = await findAnotherStoreWithStock(
              latitude,
              longitude,
              productId,
              remainingQty
            );
  
            if (alternateStore) {
              console.log(`Alternate Store found with stock:`, alternateStore);
  
              const mutation = await prisma.mutation.create({
                data: {
                  fromStoreId: alternateStore.id,
                  toStoreId: nearestStoreId,
                  // productId,
                  // quantity: remainingQty,
                  mutationStatus: 'REQUESTED',
                },
              });
  
              // Create a MutationStatusUpdate after the mutation
              await prisma.mutationStatusUpdate.create({
                data: {
                  creatorId: customerId,
                  mutationId: mutation.id,
                  mutationStatus: 'REQUESTED',
                  description: `Initial request for mutation from store ${alternateStore.id} to ${nearestStoreId}`,
                },
              });
  
              
            } else {
              throw new HttpException(
                400,
                `Insufficient stock or product not available in any nearby store for product ID: ${productId}`
              );
            }
          } else {
            // No stock available in the nearest store, find another store
            const alternateStore = await findAnotherStoreWithStock(
              latitude,
              longitude,
              productId,
              qty
            );
  
            if (alternateStore) {
              console.log(`Alternate Store found with stock:`, alternateStore);
  
              const mutation = await prisma.mutation.create({
                data: {
                  fromStoreId: alternateStore.id,
                  toStoreId: nearestStoreId,
                  // productId,
                  // quantity: remainingQty,
                  mutationStatus: 'REQUESTED',
                },
              });
  
              // Create a MutationStatusUpdate after the mutation
              await prisma.mutationStatusUpdate.create({
                data: {
                  creatorId: customerId,
                  mutationId: mutation.id,
                  mutationStatus: 'REQUESTED',
                  description: `Initial request for mutation from store ${alternateStore.id} to ${nearestStoreId}`,
                },
              });
  
              
            } else {
              throw new HttpException(
                400,
                `No store found with sufficient stock for product ID: ${productId}`
              );
            }
          }
        } else {
          // Full stock available, update inventory directly
          await updateInventoryStock(
            nearestStoreId,
            productId,
            -qty,
            orderId,
            customerId
          );
        }
      }
    } catch (error) {
      console.error('Failed to handle stock and mutations:', error);
      throw new Error('Failed to handle stock and mutations');
    }
  }