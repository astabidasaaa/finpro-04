import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type { UpdateSubcategoryInput } from '@/types/subcategoryTypes';
import type { ProductSubcategory } from '@prisma/client';

class SubcategoryQuery {
  public async createSubcategory(
    creatorId: number,
    name: string,
    parentCategoryId: number,
  ): Promise<ProductSubcategory> {
    try {
      const subcategory = await prisma.productSubcategory.create({
        data: {
          creatorId,
          name,
          productCategoryId: parentCategoryId,
        },
      });

      return subcategory;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat subkategori',
      );
    }
  }

  public async getAllSubcategory(): Promise<ProductSubcategory[]> {
    try {
      const allSubcategory = await prisma.productSubcategory.findMany();
      return allSubcategory;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memuat seluruh subkategori',
      );
    }
  }

  public async getAllSubcategoryWithProductCount(): Promise<
    ProductSubcategory[]
  > {
    try {
      const allSubcategory = await prisma.productSubcategory.findMany({
        orderBy: {
          name: 'asc',
        },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      return allSubcategory;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memuat seluruh subkategori',
      );
    }
  }

  public async getSubcategoryByName(
    name: string,
  ): Promise<ProductSubcategory | null> {
    const subcategory = await prisma.productSubcategory.findUnique({
      where: {
        name,
      },
    });

    return subcategory;
  }

  public async isSubcategoryNameSame(
    id: number,
    name: string,
  ): Promise<boolean> {
    const subcategory = await this.getSubcategoryByCaseInsensitiveName(name);
    if (subcategory === null) {
      return false;
    }
    if (subcategory.id !== id) {
      return false;
    }
    return true;
  }

  public async getSubcategoryByCaseInsensitiveName(
    name: string,
  ): Promise<ProductSubcategory | null> {
    const subcategories: ProductSubcategory[] = await prisma.$queryRaw`
    SELECT * FROM product_subcategories
    WHERE LOWER(name) LIKE LOWER(${name})
  `;
    if (subcategories.length === 0) {
      return null;
    }
    return subcategories[0];
  }

  public async getSubcategoryById(subcategoryId: number): Promise<
    | (ProductSubcategory & {
        products: {
          id: number;
        }[];
      })
    | null
  > {
    const subcategory = await prisma.productSubcategory.findUnique({
      where: {
        id: subcategoryId,
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    return subcategory;
  }

  public async updateSubcategoryBySubcategoryId(
    props: UpdateSubcategoryInput,
  ): Promise<ProductSubcategory> {
    const { subcategoryId, creatorId, name, parentCategoryId } = props;
    try {
      const updatedSubcategory = await prisma.productSubcategory.update({
        where: {
          id: subcategoryId,
        },
        data: {
          name,
          creatorId,
          productCategoryId: Number(parentCategoryId),
          updatedAt: new Date(),
        },
      });

      return updatedSubcategory;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menyimpan perubahan subkategori',
      );
    }
  }

  public async deleteSubcategory(subcategoryId: number): Promise<void> {
    try {
      await prisma.productSubcategory.delete({
        where: {
          id: subcategoryId,
        },
      });
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menghapus subkategori',
      );
    }
  }
}

export default new SubcategoryQuery();
