import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import {
  CreateInventoryChangeInput,
  InventoryProps,
  SearchAllInventoryInput,
  SearchStoreInventoryInput,
} from '@/types/inventoryTypes';
import { $Enums, Inventory, InventoryUpdate } from '@prisma/client';

class InventoryQuery {
  public async getInventoryByInventoryId(
    inventoryId: number,
  ): Promise<Inventory | null> {
    const inventory = await prisma.inventory.findFirst({
      where: {
        id: inventoryId,
      },
    });

    return inventory;
  }

  public async getAllInventories(
    props: SearchAllInventoryInput,
  ): Promise<{ inventories: InventoryProps[]; totalCount: number }> {
    try {
      const filters: any = {
        AND: [
          {
            product: {
              productState: $Enums.State.PUBLISHED,
            },
          },
        ],
      };

      if (props.storeId !== undefined && !isNaN(props.storeId)) {
        filters.AND.push({ storeId: props.storeId });
      }

      if (props.keyword !== undefined || props.keyword !== '') {
        filters.AND.push({
          OR: [
            {
              product: { name: { contains: props.keyword as string } },
            },
            {
              store: { name: { contains: props.keyword as string } },
            },
          ],
        });
      }

      const totalInventories = await prisma.inventory.count({ where: filters });
      const inventories = await prisma.inventory.findMany({
        where: filters,
        orderBy: {
          product: {
            name: 'asc',
          },
        },
        take: props.pageSize,
        skip: (props.page - 1) * props.pageSize,
        include: {
          store: {
            select: {
              name: true,
            },
          },
          product: {
            select: {
              name: true,
              subcategory: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        inventories,
        totalCount: totalInventories,
      };
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menampilkan inventaris',
      );
    }
  }

  public async getStoreInventoriesByStoreId(
    props: SearchStoreInventoryInput,
  ): Promise<{ inventories: InventoryProps[]; totalCount: number }> {
    try {
      const filters: any = {
        AND: [
          { storeId: props.storeId },
          {
            product: {
              productState: $Enums.State.PUBLISHED,
            },
          },
        ],
      };

      if (props.keyword !== undefined || props.keyword !== '') {
        filters.AND.push({
          OR: [
            {
              product: { name: { contains: props.keyword as string } },
            },
            {
              store: { name: { contains: props.keyword as string } },
            },
          ],
        });
      }

      const totalInventories = await prisma.inventory.count({
        where: filters,
      });
      const inventories = await prisma.inventory.findMany({
        where: filters,
        orderBy: {
          product: {
            name: 'asc',
          },
        },
        take: props.pageSize,
        skip: (props.page - 1) * props.pageSize,
        include: {
          store: {
            select: {
              name: true,
            },
          },
          product: {
            select: {
              name: true,
              subcategory: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        inventories,
        totalCount: totalInventories,
      };
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menampilkan inventaris toko',
      );
    }
  }

  public async getInventoryBuyProductIdAndStoreId(
    productId: number,
    storeId: number,
  ): Promise<Inventory> {
    const inventory = await prisma.inventory.findFirst({
      where: {
        productId: productId,
        storeId: storeId,
      },
    });
    if (inventory === null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Inventaris tidak ditemukan',
      );
    }
    return inventory;
  }

  public async addInventoryChange(
    props: CreateInventoryChangeInput,
  ): Promise<InventoryUpdate> {
    const inventory = await this.getInventoryBuyProductIdAndStoreId(
      props.productId,
      props.storeId,
    );

    const changeStock: number =
      props.updateType === $Enums.InventoryUpdateType.ADD
        ? props.stockChange
        : -1 * props.stockChange;

    const newStock: number = inventory.stock + changeStock;
    if (newStock < 0) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'TIdak dapat melakukan perubahan inventaris karena stok tidak cukup',
      );
    }

    try {
      const inventoryUpdate = await prisma.$transaction(async (prisma) => {
        const inventoryChange = await prisma.inventoryUpdate.create({
          data: {
            creatorId: props.id,
            type: props.updateType,
            detail: props.updateDetail,
            description: props.description,
            stockChange: props.stockChange,
            inventoryId: inventory.id,
          },
        });

        await prisma.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            stock: newStock,
          },
        });

        return inventoryChange;
      });
      return inventoryUpdate;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat merubah inventaris',
      );
    }
  }
}

export default new InventoryQuery();
