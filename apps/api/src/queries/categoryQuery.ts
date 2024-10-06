import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type { CategoryWithSubcategories } from '@/types/categoryType';
import type { ProductCategory } from '@prisma/client';

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

  public async getAllCategory(): Promise<CategoryWithSubcategories[]> {
    try {
      const allCategory = await prisma.productCategory.findMany({
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          name: true,
          subcategories: {
            orderBy: {
              name: 'asc',
            },
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return allCategory;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memuat seluruh kategori',
      );
    }
  }

  public async isCategoryNameSame(id: number, name: string): Promise<boolean> {
    const category = await this.getCategoryByCaseInsensitiveName(name);
    if (category === null) {
      return false;
    }
    if (category.id !== id) {
      return false;
    }
    return true;
  }

  public async getCategoryByCaseInsensitiveName(
    name: string,
  ): Promise<ProductCategory | null> {
    const categories: ProductCategory[] = await prisma.$queryRaw`
    SELECT * FROM product_categories
    WHERE LOWER(name) LIKE LOWER(${name})
  `;
    if (categories.length === 0) {
      return null;
    }
    return categories[0];
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
