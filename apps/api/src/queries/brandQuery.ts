import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type { CreateBrandInput, UpdateBrandInput } from '@/types/brandTypes';
import type { Brand } from '@prisma/client';

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
      const allBrand = await prisma.brand.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      return allBrand;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memuat seluruh brand',
      );
    }
  }

  public async getAllBrandDetail(): Promise<Brand[]> {
    try {
      const allBrand = await prisma.brand.findMany({
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
      return allBrand;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat memuat seluruh brand',
      );
    }
  }

  public async isBrandNameSame(id: number, name: string): Promise<boolean> {
    const brand = await this.getBrandByCaseInsensitiveName(name);
    if (brand === null) {
      return false;
    }
    if (brand.id !== id) {
      return false;
    }
    return true;
  }

  public async getBrandByCaseInsensitiveName(
    name: string,
  ): Promise<Brand | null> {
    const brands: Brand[] = await prisma.$queryRaw`
    SELECT * FROM brands
    WHERE LOWER(name) LIKE LOWER(${`%${name}%`})
  `;
    if (brands.length === 0) {
      return null;
    }
    return brands[0];
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
