import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type { CreateBrandInput, UpdateBrandInput } from '@/types/brandTypes';
import type { Brand } from '@prisma/client';
import brandQuery from '@/queries/brandQuery';

class BrandAction {
  public async createBrandAction(props: CreateBrandInput): Promise<Brand> {
    const { name } = props;

    if (name.trim() === '') {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Nama brand tidak boleh kosong',
      );
    }

    await this.checkDuplicateBrandName(name.trim());

    const brand = await brandQuery.createBrand({
      ...props,
      name: name.trim(),
    });

    return brand;
  }

  private async checkDuplicateBrandName(name: string): Promise<void> {
    const duplicateBrand = await brandQuery.getBrandByCaseInsensitiveName(name);
    if (duplicateBrand !== null) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Nama brand ini sudah terdaftar, silakan gunakan nama lain',
        'Duplicate Entry',
      );
    }
  }

  public async getAllBrandAction(): Promise<Brand[]> {
    const allBrand = await brandQuery.getAllBrand();

    return allBrand;
  }

  public async getSingleBrandAction(brandId: number): Promise<Brand> {
    const brand = await brandQuery.getBrandById(brandId);
    if (brand == null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID brand tidak ditemukan',
      );
    }

    return brand;
  }

  public async updateBrandAction(props: UpdateBrandInput): Promise<Brand> {
    const { name, description, creatorId, brandId } = props;
    let updateData: any = {};

    const currentBrand = await brandQuery.getBrandById(brandId);
    if (currentBrand == null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID brand tidak ditemukan',
      );
    }

    if (name !== undefined) {
      if (name.trim() === '') {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Nama brand tidak boleh kosong. Brand tidak dapat diperbarui.',
        );
      }
      const checkNameWithCurrent = await brandQuery.isBrandNameSame(
        currentBrand.id,
        name.trim(),
      );
      if (!checkNameWithCurrent) {
        await this.checkDuplicateBrandName(name.trim());
      }
      updateData.name = name.trim();
    }

    if (
      description !== undefined &&
      description.trim() !== currentBrand.description?.trim()
    ) {
      updateData.description = description.trim();
    }

    if (Object.keys(updateData).length > 0) {
      const updatedBrand = await brandQuery.updateBrandByBrandId({
        brandId,
        creatorId,
        ...updateData,
      });

      return updatedBrand;
    } else {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Perubahan tidak dapat disimpan karena tidak ada perubahan yang dilakukan pada brand ini',
      );
    }
  }

  public async deleteBrandAction(brandId: number): Promise<void> {
    const brand = await brandQuery.getBrandById(brandId);

    if (brand == null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Tidak dapat menghapus brand ini karena brand tidak ditemukan',
      );
    }

    if (brand.products.length > 0) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak dapat menghapus brand ini karena masih terdapat produk yang terkait',
      );
    }

    await brandQuery.deleteBrand(brandId);
  }
}

export default new BrandAction();
