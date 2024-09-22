import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import { ProductDetailProps } from '@/types/productTypes';

class ProductDetailQuery {
  public async getProductByIdAndStoreId(
    productId: number,
    storeId: number,
  ): Promise<ProductDetailProps | null> {
    try {
      const inventoryProduct = await prisma.inventory.findFirst({
        where: {
          productId,
          storeId,
        },
        include: {
          product: {
            include: {
              images: {
                select: {
                  title: true,
                  id: true,
                  alt: true,
                },
              },
              prices: {
                where: { active: true },
                select: { price: true, startDate: true, active: true },
                orderBy: { updatedAt: 'desc' },
                take: 1,
              },
              subcategory: {
                select: {
                  name: true,
                  productCategory: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          freeProductPerStores: {
            where: {
              freeProductState: 'PUBLISHED',
              startedAt: { lte: new Date() },
              finishedAt: { gt: new Date() },
            },
            select: {
              id: true,
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
              id: true,
              discountType: true,
              discountValue: true,
              
            },
          },
        },
      });

      return inventoryProduct;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengambil data produk',
      );
    }
  }
}

export default new ProductDetailQuery();
