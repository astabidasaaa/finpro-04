import prisma from '@/prisma';
import type { SearchAllStoreProductPerMonth } from '@/types/reportTypes';
import { $Enums, type InventoryUpdate } from '@prisma/client';
import type {
  ProductInventoryChange,
  ProductStockChange,
} from '@/types/inventoryTypes';
import { paginate } from '@/utils/paginate';

class InventoryReportQuery {
  public async getStoresProductStockPerMonth(
    props: SearchAllStoreProductPerMonth,
  ): Promise<{
    products: ProductStockChange[];
    totalCount: number;
  }> {
    let { month, year, storeId, page, pageSize, keyword, orderBy } = props;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    if (storeId !== undefined && isNaN(storeId)) {
      storeId = undefined;
    }

    if (keyword === '') {
      keyword = undefined;
    }

    const productInventory = await prisma.inventory.findMany({
      where: {
        storeId,
        product: {
          name:
            keyword !== undefined ? { contains: keyword as string } : undefined,
        },
        updates: {
          some: {
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          },
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        updates: {
          select: {
            type: true,
            stockChange: true,
          },
        },
      },
    });

    const productSummary = productInventory.reduce<
      Record<number, ProductStockChange>
    >((acc, inventory) => {
      const { id } = inventory;
      const { name } = inventory.product;
      const updates = inventory.updates;

      if (!acc[id]) {
        acc[id] = {
          inventoryId: id,
          name,
          totalAdd: 0,
          totalRemove: 0,
          lastStock: inventory.stock,
        };
      }

      updates.forEach((update) => {
        if (update.type === $Enums.InventoryUpdateType.ADD) {
          acc[id].totalAdd += update.stockChange;
        } else if (update.type === $Enums.InventoryUpdateType.REMOVE) {
          acc[id].totalRemove += update.stockChange;
        }
      });

      return acc;
    }, {});

    const productSummaryArray = Object.values(productSummary);
    const productSummarySorted = this.orderArray(productSummaryArray, orderBy);
    const paginatedSummary: ProductStockChange[] = paginate(
      productSummarySorted,
      page,
      pageSize,
    );

    return {
      products: paginatedSummary,
      totalCount: productSummaryArray.length,
    };
  }

  public async productChangeDetailByInventoryId(
    props: ProductInventoryChange,
  ): Promise<InventoryUpdate[]> {
    const { inventoryId, month, year, orderBy } = props;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const productChange = await prisma.inventoryUpdate.findMany({
      where: {
        inventoryId,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        createdAt: orderBy === 'timeDesc' ? 'desc' : 'asc',
      },
    });

    return productChange;
  }

  private orderArray(
    arr: ProductStockChange[],
    orderBy: string,
  ): ProductStockChange[] {
    const resultSorted: ProductStockChange[] = [];

    if (orderBy === 'nameAsc') {
      resultSorted.push(
        ...[...arr].sort((a, b) => a.name.localeCompare(b.name)),
      );
    } else if (orderBy === 'nameDesc') {
      resultSorted.push(
        ...[...arr].sort((a, b) => b.name.localeCompare(a.name)),
      );
    } else if (orderBy === 'qtyDesc') {
      resultSorted.push(...[...arr].sort((a, b) => b.lastStock - a.lastStock));
    } else if (orderBy === 'qtyAsc') {
      resultSorted.push(...[...arr].sort((a, b) => a.lastStock - b.lastStock));
    }

    return resultSorted;
  }
}

export default new InventoryReportQuery();
