import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import {
  SearchedProduct,
  SearchProductInput,
  Sort,
} from '@/types/productTypes';
import { $Enums } from '@prisma/client';

class ProductSearchQuery {
  public async getProducts(
    props: SearchProductInput,
  ): Promise<{ products: SearchedProduct[]; totalCount: number }> {
    try {
      const filters: any = {
        AND: [
          {
            inventories: {
              some: {
                storeId: Number(props.storeId),
              },
            },
          },
          // { productState: $Enums.State.PUBLISHED },
        ],
      };

      if (props.keyword !== undefined || props.keyword !== '') {
        filters.AND.push({
          OR: [
            {
              name: { contains: props.keyword as string },
            },
            {
              description: {
                contains: props.keyword as string,
              },
            },
          ],
        });
      }

      if (props.subcategoryId !== undefined && !isNaN(props.subcategoryId)) {
        filters.AND.push({
          subcategoryId: props.subcategoryId,
        });
      }

      if (props.brandId !== undefined && !isNaN(props.brandId)) {
        filters.AND.push({
          brandId: props.brandId,
        });
      }

      if (
        (props.startPrice !== undefined && !isNaN(props.startPrice)) ||
        (props.endPrice !== undefined && !isNaN(props.endPrice))
      ) {
        const priceFilter = { price: {} };

        if (props.startPrice !== undefined && !isNaN(props.startPrice)) {
          priceFilter.price = { ...priceFilter.price, gte: props.startPrice };
        }

        if (props.endPrice !== undefined && !isNaN(props.endPrice)) {
          priceFilter.price = { ...priceFilter.price, lte: props.endPrice };
        }

        filters.AND.push({
          prices: {
            some: {
              active: true,
              ...priceFilter,
            },
          },
        });
      }

      const orderBy: any = {};
      if (props.sortCol === Sort.nameAsc) {
        orderBy.name = 'asc';
      } else if (props.sortCol === Sort.nameDesc) {
        orderBy.name = 'desc';
      }

      const unsortedProducts = await prisma.product.findMany({
        where: filters,
        orderBy,
        include: {
          images: {
            select: {
              title: true,
              alt: true,
            },
          },
          subcategory: {
            select: { name: true, productCategory: { select: { name: true } } },
          },
          brand: { select: { name: true, id: true } },
          inventories: {
            where: { storeId: props.storeId },
            select: {
              stock: true,
              freeProductPerStores: {
                where: {
                  freeProductState: 'PUBLISHED',
                  startedAt: { lte: new Date() },
                  finishedAt: { gt: new Date() },
                },
                select: {
                  buy: true,
                  get: true,
                },
              },
              productDiscountPerStores: {
                where: {
                  productDiscountState: 'PUBLISHED',
                  startedAt: { lte: new Date() },
                  finishedAt: { gt: new Date() },
                },
                select: {
                  discountType: true,
                  discountValue: true,
                },
              },
            },
          },
          prices: {
            where: { active: true },
            select: { price: true },
            orderBy: { updatedAt: 'desc' },
            take: 1,
          },
        },
      });

      let sortedProducts: SearchedProduct[];
      if (props.sortCol == Sort.priceDesc) {
        sortedProducts = unsortedProducts.sort(
          (a, b) => a.prices[0].price - b.prices[0].price,
        );
      } else if (props.sortCol == Sort.priceAsc) {
        sortedProducts = unsortedProducts.sort(
          (a, b) => b.prices[0].price - a.prices[0].price,
        );
      } else {
        sortedProducts = unsortedProducts;
      }

      const startIndex = (props.page - 1) * props.pageSize;
      const paginatedProducts = sortedProducts.slice(
        startIndex,
        startIndex + props.pageSize,
      );

      return {
        products: paginatedProducts,
        totalCount: unsortedProducts.length,
      };
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memuat seluruh product',
      );
    }
  }
}

export default new ProductSearchQuery();
