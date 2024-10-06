import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type { ProductCategory } from '@prisma/client';
import type { CategoryWithSubcategories } from '@/types/categoryType';
import categoryQuery from '@/queries/categoryQuery';
import subcategoryAction from './subcategoryAction';

class CategoryAction {
  public async createCategoryAction(
    creatorId: number,
    name: string,
    subcategories: string[],
  ): Promise<ProductCategory> {
    if (name.trim() === '') {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Nama kategori tidak boleh kosong',
      );
    }

    await this.checkDuplicateCategoryName(name.trim());

    const checkSubcategories = await Promise.all(
      subcategories.map(async (subcategory) => {
        await subcategoryAction.checkDuplicateSubcategoryName(subcategory);
        return subcategory;
      }),
    );

    const category = await categoryQuery.createCategory(
      creatorId,
      name.trim(),
      checkSubcategories,
    );

    return category;
  }

  private async checkDuplicateCategoryName(name: string): Promise<void> {
    const duplicateCategory =
      await categoryQuery.getCategoryByCaseInsensitiveName(name);
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

    if (name == undefined || name.trim() === '') {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Nama kategori tidak boleh kosong. Kategori tidak dapat diperbarui.',
      );
    }

    const checkNameWithCurrent = await categoryQuery.isCategoryNameSame(
      currentCategory.id,
      name.trim(),
    );

    if (!checkNameWithCurrent) {
      await this.checkDuplicateCategoryName(name.trim());
    }

    const updatedCategory = await categoryQuery.updateCategoryByCategoryId(
      creatorId,
      categoryId,
      name.trim(),
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
