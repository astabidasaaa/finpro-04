import prisma from '@/prisma';
import {
  AllStoreCategoryPerMonth,
  AllStoreOverallPerMonth,
  OverallProps,
  ProductResult,
  SearchAllStoreProductPerMonth,
} from '@/types/reportTypes';
import { paginate } from '@/utils/paginate';
import { $Enums } from '@prisma/client';

class SalesQuery {
  public async getStoresOverallByMonth(
    props: AllStoreOverallPerMonth,
  ): Promise<OverallProps> {
    let { year, month, storeId } = props;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    if (storeId !== undefined && isNaN(storeId)) {
      storeId = undefined;
    }

    const filterOrder = {
      orderStatus: $Enums.OrderStatus.DIKONFIRMASI,
      updatedAt: {
        gte: startDate,
        lt: endDate,
      },
      storeId,
    };

    const totalPriceAndTransactionCount = await prisma.order.aggregate({
      _sum: {
        price: true,
        finalPrice: true,
      },
      _count: {
        price: true,
      },
      where: filterOrder,
    });

    const totalDeliveryPrice = await prisma.order.findMany({
      where: { ...filterOrder, shippingId: { not: null } },
      select: {
        shipping: {
          select: {
            amount: true,
          },
        },
      },
    });

    const totalOrderItem = await prisma.orderItem.aggregate({
      _sum: {
        qty: true,
      },
      where: {
        order: filterOrder,
      },
    });

    return {
      cleanRevenue: totalPriceAndTransactionCount._sum.finalPrice,
      productRevenue: totalPriceAndTransactionCount._sum.price,
      deliveryRevenue: totalDeliveryPrice.reduce((acc, delivery) => {
        return acc + (delivery.shipping?.amount || 0);
      }, 0),
      transactionCount: totalPriceAndTransactionCount._count.price,
      itemCount: totalOrderItem._sum.qty,
    };
  }

  public async getStoresProductSalesPerMonth(
    props: SearchAllStoreProductPerMonth,
  ): Promise<{ products: ProductResult[]; totalCount: number }> {
    let { month, year, storeId, page, pageSize, keyword, orderBy } = props;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    if (storeId !== undefined && isNaN(storeId)) {
      storeId = undefined;
    }

    const filterOrder = {
      orderStatus: $Enums.OrderStatus.DIKONFIRMASI,
      updatedAt: {
        gte: startDate,
        lt: endDate,
      },
      storeId,
    };

    if (keyword === '') {
      keyword = undefined;
    }

    const products = await prisma.orderItem.findMany({
      where: {
        order: filterOrder,
        product: {
          name:
            keyword !== undefined ? { contains: keyword as string } : undefined,
        },
      },
      select: {
        product: {
          select: {
            name: true,
          },
        },
        qty: true,
        productId: true,
        finalPrice: true,
      },
    });

    const productMap = new Map<number, ProductResult>();

    products.forEach(({ qty, finalPrice, productId, product }) => {
      if (productMap.has(productId)) {
        const existingProduct = productMap.get(productId)!;
        existingProduct.totalQty += qty;
        existingProduct.totalPrice += finalPrice * qty;
      } else {
        productMap.set(productId, {
          name: product.name,
          totalQty: qty,
          totalPrice: finalPrice * qty,
        });
      }
    });

    const distinctProducts = Array.from(productMap.values());
    const resultSortedProducts = this.orderArray(distinctProducts, orderBy);

    const paginatedProducts: ProductResult[] = paginate(
      resultSortedProducts,
      page,
      pageSize,
    );

    return {
      products: paginatedProducts,
      totalCount: distinctProducts.length,
    };
  }

  public async getStoresCategorySalesPerMonth(
    props: AllStoreCategoryPerMonth,
  ): Promise<ProductResult[]> {
    let { month, year, storeId, orderBy } = props;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    if (storeId !== undefined && isNaN(storeId)) {
      storeId = undefined;
    }

    const filterOrder = {
      orderStatus: $Enums.OrderStatus.DIKONFIRMASI,
      updatedAt: {
        gte: startDate,
        lt: endDate,
      },
      storeId,
    };

    const categories = await prisma.orderItem.findMany({
      where: {
        order: filterOrder,
      },
      select: {
        product: {
          select: {
            name: true,
            subcategory: {
              select: {
                productCategory: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        qty: true,
        finalPrice: true,
      },
    });

    const categoryMap = new Map<number, ProductResult>();

    categories.forEach(({ qty, finalPrice, product }) => {
      const categoryId = product.subcategory.productCategory.id;
      if (categoryMap.has(categoryId)) {
        const existingCategory = categoryMap.get(categoryId)!;
        existingCategory.totalQty += qty;
        existingCategory.totalPrice += finalPrice * qty;
      } else {
        categoryMap.set(categoryId, {
          name: product.subcategory.productCategory.name,
          totalQty: qty,
          totalPrice: finalPrice * qty,
        });
      }
    });

    const distinctCategories = Array.from(categoryMap.values());
    const resultSortedCategories = this.orderArray(distinctCategories, orderBy);

    return resultSortedCategories;
  }

  private orderArray(arr: ProductResult[], orderBy: string): ProductResult[] {
    const resultSorted: ProductResult[] = [];

    if (orderBy === 'nameAsc') {
      resultSorted.push(
        ...[...arr].sort((a, b) => a.name.localeCompare(b.name)),
      );
    } else if (orderBy === 'nameDesc') {
      resultSorted.push(
        ...[...arr].sort((a, b) => b.name.localeCompare(a.name)),
      );
    } else if (orderBy === 'qtyDesc') {
      resultSorted.push(...[...arr].sort((a, b) => b.totalQty - a.totalQty));
    } else if (orderBy === 'qtyAsc') {
      resultSorted.push(...[...arr].sort((a, b) => a.totalQty - b.totalQty));
    }

    return resultSorted;
  }
}

export default new SalesQuery();
