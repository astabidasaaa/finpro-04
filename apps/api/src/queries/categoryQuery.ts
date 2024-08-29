import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import { ProductCategory } from '@prisma/client';

class CategoryQuery {
  public async createCategory(
    creatorId: number,
    name: string,
    subcategories: string[],
  ): Promise<ProductCategory> {
    try {
      const category = await prisma.productCategory.create({
        data: {
          creatorId,
          name,
          subcategories: {
            create: subcategories.map((subcategory) => ({
              name: subcategory,
              creatorId,
            })),
          },
        },
        include: {
          subcategories: true,
        },
      });

      return category;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat kategori',
      );
    }
  }

  public async getAllCategory(): Promise<ProductCategory[]> {
    try {
      const allCategory = await prisma.productCategory.findMany();
      return allCategory;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memuat seluruh kategori',
      );
    }
  }

  public async getCategoryByName(
    name: string,
  ): Promise<ProductCategory | null> {
    const category = await prisma.productCategory.findFirst({
      where: {
        name,
      },
    });

    return category;
  }

  public async getCategoryById(categoryId: number): Promise<
    | (ProductCategory & {
        subcategories: {
          id: number;
          name: string;
        }[];
      })
    | null
  > {
    const category = await prisma.productCategory.findFirst({
      where: {
        id: categoryId,
      },
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return category;
  }

  public async updateCategoryByCategoryId(
    creatorId: number,
    categoryId: number,
    name: string,
  ): Promise<ProductCategory> {
    try {
      const updatedCategory = await prisma.productCategory.update({
        where: {
          id: categoryId,
        },
        data: {
          creatorId,
          name,
          updatedAt: new Date(),
        },
      });

      return updatedCategory;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menyimpan perubahan kategori',
      );
    }
  }

  public async deleteCategory(categoryId: number): Promise<void> {
    try {
      await prisma.productCategory.delete({
        where: {
          id: categoryId,
        },
      });
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menghapus kategori',
      );
    }
  }
}

export default new CategoryQuery();
