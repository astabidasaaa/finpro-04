import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import { CreateBrandInput, UpdateBrandInput } from '@/types/brandTypes';
import { Brand } from '@prisma/client';

class BrandQuery {
  public async createBrand(props: CreateBrandInput): Promise<Brand> {
    const { creatorId, name, description } = props;
    try {
      const brand = await prisma.brand.create({
        data: {
          creatorId,
          name,
          description,
        },
      });

      return brand;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat brand',
      );
    }
  }

  public async getAllBrand(): Promise<Brand[]> {
    try {
      const allBrand = await prisma.brand.findMany();
      return allBrand;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memuat seluruh brand',
      );
    }
  }

  public async getBrandByName(name: string): Promise<Brand | null> {
    const brand = await prisma.brand.findFirst({
      where: {
        name,
      },
    });

    return brand;
  }

  public async getBrandById(brandId: number): Promise<
    | (Brand & {
        products: {
          id: number;
        }[];
      })
    | null
  > {
    const brand = await prisma.brand.findUnique({
      where: {
        id: brandId,
      },
      include: {
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    return brand;
  }

  public async updateBrandByBrandId(props: UpdateBrandInput): Promise<Brand> {
    const { creatorId, brandId, name, description } = props;
    try {
      const updatedBrand = await prisma.brand.update({
        where: {
          id: brandId,
        },
        data: {
          creatorId,
          name,
          description,
          updatedAt: new Date(),
        },
      });

      return updatedBrand;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menyimpan perubahan brand',
      );
    }
  }

  public async deleteBrand(brandId: number): Promise<void> {
    try {
      await prisma.brand.delete({
        where: {
          id: brandId,
        },
      });
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menghapus brand',
      );
    }
  }
}

export default new BrandQuery();
