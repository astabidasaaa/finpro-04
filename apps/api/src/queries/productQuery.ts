import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import { $Enums, Product } from '@prisma/client';
import {
  CreateProductInput,
  ProductListInput,
  ProductProps,
  UpdateProductInput,
} from '@/types/productTypes';
import { deletePhoto } from '@/utils/deletePhoto';

class ProductQuery {
  public async getAllProductBrief(): Promise<
    {
      id: number;
      name: string;
    }[]
  > {
    const products = await prisma.product.findMany({
      where: {
        productState: $Enums.State.PUBLISHED,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });

    return products;
  }

  public async createProduct(props: CreateProductInput): Promise<Product> {
    const { price, images, ...inputWithoutPriceAndImages } = props;
    try {
      const products = await prisma.$transaction(async (prisma) => {
        const stores = await prisma.store.findMany({
          select: {
            id: true,
          },
        });

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
            inventories: {
              create: stores.map((store) => ({
                storeId: store.id,
              })),
            },
          },
        });

        return product;
      });
      return products;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat produk',
      );
    }
  }

  public async isProductNameSame(id: number, name: string): Promise<boolean> {
    const product = await this.getProductByCaseInsensitiveName(name);
    if (product === null) {
      return false;
    }
    if (product.id !== id) {
      return false;
    }
    return true;
  }

  public async getProductByCaseInsensitiveName(
    name: string,
  ): Promise<Product | null> {
    const product: Product[] = await prisma.$queryRaw`
    SELECT * FROM products
    WHERE LOWER(name) LIKE LOWER(${`%${name}%`})
  `;
    if (product.length === 0) {
      return null;
    }
    return product[0];
  }

  public async getProductDetailById(
    productId: number,
  ): Promise<ProductProps | null> {
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
        subcategory: {
          select: {
            name: true,
            productCategory: { select: { id: true, name: true } },
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

  public async getProductsByState(
    props: ProductListInput,
  ): Promise<{ products: Product[]; totalCount: number }> {
    try {
      let filters: any = {
        productState: props.productState,
      };

      if (props.keyword !== '') {
        filters = { ...filters, name: { contains: props.keyword as string } };
      }

      const totalProducts = await prisma.product.count({ where: filters });
      const products = await prisma.product.findMany({
        where: filters,
        orderBy: {
          updatedAt: 'desc',
        },
        take: props.pageSize,
        skip: (props.page - 1) * props.pageSize,
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
          prices: {
            where: { active: true },
            select: { price: true },
            orderBy: { updatedAt: 'desc' },
            take: 1,
          },
        },
      });

      return { products, totalCount: totalProducts };
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat mengambil data daftar produk',
      );
    }
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
