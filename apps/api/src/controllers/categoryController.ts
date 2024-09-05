import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';

export class CategoryController {
  public async getAllCategoriesAndSubCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const categories = await prisma.productCategory.findMany({
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

      res.status(200).json({
        message: 'Mengambil kategori berhasil',
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }
}
