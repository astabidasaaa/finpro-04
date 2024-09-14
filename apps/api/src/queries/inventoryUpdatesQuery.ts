import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import {
  SearchAllInventoryUpdatesInput,
  InventoryUpdateProps,
  SearchStoreInventoryUpdatesInput,
} from '@/types/inventoryTypes';

class InventoryUpdatesQuery {
  public async getAllInventoryUpdates(
    props: SearchAllInventoryUpdatesInput,
  ): Promise<{ inventoryUpdates: InventoryUpdateProps[]; totalCount: number }> {
    try {
      const filters: any = { AND: [] };

      if (props.storeId !== undefined && !isNaN(props.storeId)) {
        filters.AND.push({
          inventory: {
            storeId: Number(props.storeId),
          },
        });
      }

      if (props.filterType !== undefined && props.filterType !== '') {
        filters.AND.push({
          type: props.filterType,
        });
      }

      if (props.keyword !== undefined || props.keyword !== '') {
        filters.AND.push({
          OR: [
            {
              inventory: {
                product: { name: { contains: props.keyword as string } },
              },
            },
            {
              inventory: {
                store: { name: { contains: props.keyword as string } },
              },
            },
          ],
        });
      }

      const orderBy: any = {};
      if (props.sortCol === 'timeAsc') {
        orderBy.createdAt = 'asc';
      } else if (props.sortCol === 'timeDesc') {
        orderBy.createdAt = 'desc';
      }

      const totalInventoryUpdates = await prisma.inventoryUpdate.count({
        where: filters,
      });
      const inventoryUpdates = await prisma.inventoryUpdate.findMany({
        where: filters,
        orderBy,
        take: props.pageSize,
        skip: (props.page - 1) * props.pageSize,
        include: {
          inventory: {
            select: {
              product: {
                select: {
                  name: true,
                  id: true,
                },
              },
              store: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return {
        inventoryUpdates,
        totalCount: totalInventoryUpdates,
      };
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menampilkan inventaris',
      );
    }
  }

  public async getStoreInventoryUpdates(
    props: SearchStoreInventoryUpdatesInput,
  ): Promise<{ inventoryUpdates: InventoryUpdateProps[]; totalCount: number }> {
    try {
      const filters: any = {
        AND: [
          {
            inventory: {
              storeId: Number(props.storeId),
            },
          },
        ],
      };

      if (props.filterType !== undefined && props.filterType !== '') {
        filters.AND.push({
          type: props.filterType,
        });
      }

      if (props.keyword !== undefined || props.keyword !== '') {
        filters.AND.push({
          OR: [
            {
              inventory: {
                product: { name: { contains: props.keyword as string } },
              },
            },
            {
              inventory: {
                store: { name: { contains: props.keyword as string } },
              },
            },
          ],
        });
      }

      const orderBy: any = {};
      if (props.sortCol === 'timeAsc') {
        orderBy.createdAt = 'asc';
      } else if (props.sortCol === 'timeDesc') {
        orderBy.createdAt = 'desc';
      }

      const totalInventoryUpdates = await prisma.inventoryUpdate.count({
        where: filters,
      });
      const inventoryUpdates = await prisma.inventoryUpdate.findMany({
        where: filters,
        orderBy,
        take: props.pageSize,
        skip: (props.page - 1) * props.pageSize,
        include: {
          inventory: {
            select: {
              product: {
                select: {
                  name: true,
                  id: true,
                },
              },
              store: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return {
        inventoryUpdates,
        totalCount: totalInventoryUpdates,
      };
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menampilkan inventaris',
      );
    }
  }

  public async getProductInventoryUpdatesByInventoryId(
    inventoryId: number,
  ): Promise<InventoryUpdateProps[]> {
    try {
      const storeInventories: InventoryUpdateProps[] =
        await prisma.inventoryUpdate.findMany({
          where: {
            id: inventoryId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            inventory: {
              select: {
                product: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
                store: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        });

      return storeInventories;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menampilkan riwayat pembaruan inventaris pada produk ini',
      );
    }
  }
}

export default new InventoryUpdatesQuery();
