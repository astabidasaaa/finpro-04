import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type { ProductCategory } from '@prisma/client';
import categoryQuery from '@/queries/categoryQuery';
import subcategoryAction from './subcategoryAction';
import { capitalizeString } from '@/utils/stringManipulation';
import { CategoryWithSubcategories } from '@/types/categoryType';

class CategoryAction {
  public async createCategoryAction(
    creatorId: number,
    name: string,
    subcategories: string[],
  ): Promise<ProductCategory> {
    const formattedName = capitalizeString(name);

    await this.checkDuplicateCategoryName(formattedName);

    const formattedSubcategories = await Promise.all(
      subcategories.map(async (subcategory) => {
        const formattedSubcategory = capitalizeString(subcategory);
        await subcategoryAction.checkDuplicateSubcategoryName(subcategory);
        return formattedSubcategory;
      }),
    );

    const category = await categoryQuery.createCategory(
      creatorId,
      formattedName,
      formattedSubcategories,
    );

    return category;
  }

  private async checkDuplicateCategoryName(name: string): Promise<void> {
    const duplicateCategory = await categoryQuery.getCategoryByName(name);
    if (duplicateCategory !== null) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        `Nama kategori ${name} sudah terdaftar, silakan gunakan nama lain`,
        'Duplicate Entry',
      );
    }
  }

  public async getAllCategoryAction(): Promise<CategoryWithSubcategories[]> {
    const allCategory = await categoryQuery.getAllCategory();

    return allCategory;
  }

  public async getSingleCategoryAction(categoryId: number): Promise<
    ProductCategory & {
      subcategories: {
        id: number;
        name: string;
      }[];
    }
  > {
    const category = await categoryQuery.getCategoryById(categoryId);
    if (category == null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID kategori tidak ditemukan',
      );
    }

    return category;
  }

  public async updateCategoryAction(
    creatorId: number,
    categoryId: number,
    name: string,
  ): Promise<ProductCategory> {
    const currentCategory = await categoryQuery.getCategoryById(categoryId);
    if (currentCategory == null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID kategori tidak ditemukan',
      );
    }

    if (name == undefined) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Kategori tidak dapat diperbarui',
      );
    }

    const formattedName = capitalizeString(name);
    await this.checkDuplicateCategoryName(formattedName);
    const updatedCategory = await categoryQuery.updateCategoryByCategoryId(
      creatorId,
      categoryId,
      formattedName,
    );

    return updatedCategory;
  }

  public async deleteCategoryAction(categoryId: number): Promise<void> {
    const category = await categoryQuery.getCategoryById(categoryId);

    if (category == null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Tidak dapat menghapus kategori ini karena kategori tidak ditemukan',
      );
    }

    if (category.subcategories.length > 0) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak dapat menghapus kategori ini karena masih terdapat subkategori yang terkait',
      );
    }

    await categoryQuery.deleteCategory(categoryId);
  }
}

export default new CategoryAction();
