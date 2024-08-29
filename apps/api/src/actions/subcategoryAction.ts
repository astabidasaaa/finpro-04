import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { ProductSubcategory } from '@prisma/client';
import subcategoryQuery from '@/queries/subcategoryQuery';
import { UpdateSubcategoryInput } from '@/types/subcategoryTypes';
import { capitalizeString } from '@/utils/stringManipulation';

class SubcategoryAction {
  public async createSubcategoryAction(
    creatorId: number,
    name: string,
    parentCategoryId: number,
  ): Promise<ProductSubcategory> {
    const formattedName = capitalizeString(name);

    await this.checkDuplicateSubcategoryName(formattedName);

    const subcategory = await subcategoryQuery.createSubcategory(
      creatorId,
      formattedName,
      parentCategoryId,
    );

    return subcategory;
  }

  public async checkDuplicateSubcategoryName(name: string): Promise<void> {
    const duplicateSubcategory =
      await subcategoryQuery.getSubcategoryByName(name);
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

  public async updateSubcategoryAction(
    props: UpdateSubcategoryInput,
  ): Promise<ProductSubcategory> {
    const { creatorId, subcategoryId, parentCategoryId, name } = props;

    const currentSubcategory =
      await subcategoryQuery.getSubcategoryById(subcategoryId);
    if (currentSubcategory == null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID kategori tidak ditemukan',
      );
    }

    const updateData: any = {};

    if (name !== undefined) {
      const formattedName = capitalizeString(name);
      await this.checkDuplicateSubcategoryName(formattedName);
      updateData.name = formattedName;
    }

    if (
      parentCategoryId !== undefined &&
      parentCategoryId !== currentSubcategory.productCategoryId
    ) {
      updateData.parentCategoryId = parentCategoryId;
    }

    if (Object.keys(updateData).length > 0) {
      const updatedSubcategory =
        await subcategoryQuery.updateSubcategoryBySubcategoryId({
          ...updateData,
          creatorId,
          subcategoryId,
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
