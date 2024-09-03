import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';
import { State } from '@prisma/client';
import categoryAction from '@/actions/categoryAction';

export class CategoryController {
  public async createCategoryAndSubcategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const { id } = req.user as User;
      const id = 4;

      const { name, subcategories }: { name: string; subcategories: string[] } =
        req.body;

      const category = await categoryAction.createCategoryAction(
        id,
        name,
        subcategories,
      );

      res.status(200).json({
        message: 'Kategori berhasil dibuat',
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const allCategory = await categoryAction.getAllCategoryAction();

      res.status(200).json({
        message: 'Seluruh kategori berhasil dimuat',
        data: allCategory,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getSingleCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);

      const category = await categoryAction.getSingleCategoryAction(categoryId);

      res.status(200).json({
        message: `Kategori ${category.name} berhasil dimuat`,
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const { id } = req.user as User;
      const id = 4;
      const categoryId = parseInt(req.params.categoryId);
      const { name } = req.body;

      const updatedCategory = await categoryAction.updateCategoryAction(
        id,
        categoryId,
        name,
      );

      res.status(200).json({
        message: 'Kategori berhasil diperbarui',
        data: updatedCategory,
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId);

      await categoryAction.deleteCategoryAction(categoryId);

      res.status(200).json({
        message: 'Kategori berhasil dihapus',
      });
    } catch (err) {
      next(err);
    }
  }
}
