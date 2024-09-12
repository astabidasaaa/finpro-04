import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';
import subcategoryAction from '@/actions/subcategoryAction';

export class SubcategoryController {
  public async createSubcategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const {
        name,
        parentCategoryId,
      }: { name: string; parentCategoryId: string } = req.body;

      const subcategory = await subcategoryAction.createSubcategoryAction(
        id,
        name,
        parseInt(parentCategoryId),
      );

      res.status(200).json({
        message: 'Subkategori berhasil dibuat',
        data: subcategory,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllSubcategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const allSubcategory = await subcategoryAction.getAllSubcategoryAction();

      res.status(200).json({
        message: 'Seluruh subkategori berhasil dimuat',
        data: allSubcategory,
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateSubcategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const subcategoryId = parseInt(req.params.subcategoryId);
      const updatedProps = req.body;

      const updatedSubcategory =
        await subcategoryAction.updateSubcategoryAction({
          ...updatedProps,
          creatorId: id,
          subcategoryId,
        });

      res.status(200).json({
        message: 'Subkategori berhasil diperbarui',
        data: updatedSubcategory,
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteSubcategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const subcategoryId = parseInt(req.params.subcategoryId);

      await subcategoryAction.deleteSubcategoryAction(subcategoryId);

      res.status(200).json({
        message: 'Subkategori berhasil dihapus',
      });
    } catch (err) {
      next(err);
    }
  }
}
