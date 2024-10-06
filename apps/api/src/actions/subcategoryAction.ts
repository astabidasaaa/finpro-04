import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type { ProductSubcategory } from '@prisma/client';
import type { UpdateSubcategoryInput } from '@/types/subcategoryTypes';
import subcategoryQuery from '@/queries/subcategoryQuery';

class SubcategoryAction {
  public async createSubcategoryAction(
    creatorId: number,
    name: string,
    parentCategoryId: number,
  ): Promise<ProductSubcategory> {
    if (name.trim() === '') {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Nama subkategori tidak boleh kosong',
      );
    }

    if (Number.isNaN(parentCategoryId)) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Kategori harus dipilih');
    }

    await this.checkDuplicateSubcategoryName(name.trim());

    const subcategory = await subcategoryQuery.createSubcategory(
      creatorId,
      name.trim(),
      parentCategoryId,
    );

    return subcategory;
  }

  public async checkDuplicateSubcategoryName(name: string): Promise<void> {
    const duplicateSubcategory =
      await subcategoryQuery.getSubcategoryByCaseInsensitiveName(name);
    if (duplicateSubcategory !== null) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        `Nama subkategori ${name} sudah terdaftar, silakan gunakan nama lain`,
        'Duplicate Entry',
      );
    }
  }

  public async getAllSubcategoryAction(): Promise<ProductSubcategory[]> {
    const allSubcategory = await subcategoryQuery.getAllSubcategory();

    return allSubcategory;
  }

  public async getAllSubcategoryDetailAction(): Promise<ProductSubcategory[]> {
    const allSubcategory =
      await subcategoryQuery.getAllSubcategoryWithProductCount();

    return allSubcategory;
  }

  public async updateSubcategoryAction(
    props: UpdateSubcategoryInput,
  ): Promise<ProductSubcategory> {
    const { creatorId, subcategoryId, parentCategoryId, name } = props;

    const currentSubcategory =
      await subcategoryQuery.getSubcategoryById(subcategoryId);
    if (currentSubcategory == null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID subkategori tidak ditemukan',
      );
    }

    const updateData: any = {};

    if (name !== undefined) {
      if (name.trim() === '') {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Nama subkategori tidak boleh kosong. Subkategori tidak dapat diperbarui.',
        );
      }
      const checkNameWithCurrent = await subcategoryQuery.isSubcategoryNameSame(
        currentSubcategory.id,
        name.trim(),
      );
      if (!checkNameWithCurrent) {
        await this.checkDuplicateSubcategoryName(name.trim());
      }
      updateData.name = name.trim();
    }

    if (
      parentCategoryId !== undefined &&
      parentCategoryId !== currentSubcategory.productCategoryId
    ) {
      if (Number.isNaN(parentCategoryId)) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Kategori harus dipilih',
        );
      }
      updateData.parentCategoryId = parentCategoryId;
    }

    if (Object.keys(updateData).length > 0) {
      const updatedSubcategory =
        await subcategoryQuery.updateSubcategoryBySubcategoryId({
          ...updateData,
          creatorId,
          subcategoryId,
          parentCategoryId,
        });

      return updatedSubcategory;
    } else {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Perubahan tidak dapat disimpan karena tidak ada perubahan yang dilakukan pada subkategori ini',
      );
    }
  }

  public async deleteSubcategoryAction(subcategoryId: number): Promise<void> {
    const subcategory =
      await subcategoryQuery.getSubcategoryById(subcategoryId);

    if (subcategory == null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Tidak dapat menghapus subkategori ini karena subkategori tidak ditemukan',
      );
    }

    if (subcategory.products.length > 0) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak dapat menghapus subkategori ini karena masih terdapat produk yang terkait',
      );
    }

    await subcategoryQuery.deleteSubcategory(subcategoryId);
  }
}

export default new SubcategoryAction();
