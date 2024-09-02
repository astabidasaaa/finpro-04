import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import { Product } from '@prisma/client';
import {
  CreateProductInput,
  ProductProps,
  UpdateProductInput,
} from '@/types/productTypes';
import { deletePhoto } from '@/utils/deletePhoto';

class ProductQuery {
  public async createProduct(props: CreateProductInput): Promise<Product> {
    const { price, images, ...inputWithoutPriceAndImages } = props;
    try {
      const product = await prisma.product.create({
        data: {
          ...inputWithoutPriceAndImages,
          prices: {
            create: {
              price,
              startDate: new Date(),
            },
          },
          images: {
            create: images.map((image) => ({
              title: image,
            })),
          },
        },
      });

      return product;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat produk',
      );
    }
  }

  public async getProductByName(name: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        name,
      },
    });

    return product;
  }

  public async getProductById(productId: number): Promise<ProductProps | null> {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: {
          select: {
            title: true,
            id: true,
            alt: true,
          },
        },
        prices: {
          where: {
            active: true,
          },
          select: {
            price: true,
            startDate: true,
            active: true,
          },
        },
      },
    });

    return product;
  }

  public async updateProductByProductId(
    props: UpdateProductInput,
  ): Promise<ProductProps | null> {
    const { productId, images, imagesToDelete, price, ...otherProps } = props;
    try {
      await prisma.$transaction(async (prisma) => {
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: { ...otherProps, updatedAt: new Date() },
        });

        if (price !== undefined) {
          await prisma.productPriceHistory.updateMany({
            where: { AND: [{ active: true }, { productId }] },
            data: {
              active: false,
              updatedAt: new Date(),
            },
          });

          await prisma.productPriceHistory.create({
            data: {
              productId,
              price,
              startDate: new Date(),
            },
          });
        }

        if (imagesToDelete !== undefined && imagesToDelete.length >= 1) {
          await Promise.all(
            imagesToDelete.map(async (imageId) => {
              const deletedImage = await prisma.productImage.delete({
                where: { id: Number(imageId) },
              });
              deletePhoto(deletedImage.title, 'product');
            }),
          );
        }

        if (images !== undefined) {
          await Promise.all(
            images.map(async (image) => {
              await prisma.productImage.create({
                data: { productId, title: image },
              });
            }),
          );
        }
      });

      return await this.getProductById(productId);
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menyimpan perubahan produk',
      );
    }
  }

  public async archiveProduct(
    creatorId: number,
    productId: number,
  ): Promise<Product> {
    try {
      const archivedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          productState: 'ARCHIVED',
          updatedAt: new Date(),
        },
      });

      return archivedProduct;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menghapus brand',
      );
    }
  }
}

export default new ProductQuery();
