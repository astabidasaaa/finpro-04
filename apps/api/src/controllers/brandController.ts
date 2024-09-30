import type { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';
import brandAction from '@/actions/brandAction';
import brandQuery from '@/queries/brandQuery';

export class BrandController {
  public async createBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const {
        name,
        description,
      }: { name: string; description: string | undefined } = req.body;

      const brand = await brandAction.createBrandAction({
        name,
        creatorId: id,
        description,
      });

      res.status(200).json({
        message: 'Brand berhasil dibuat',
        data: brand,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const allBrand = await brandAction.getAllBrandAction();

      res.status(200).json({
        message: 'Seluruh brand berhasil dimuat',
        data: allBrand,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllBrandDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const allBrand = await brandQuery.getAllBrandDetail();

      res.status(200).json({
        message: 'Seluruh brand berhasil dimuat',
        data: allBrand,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getSingleBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const brandId = parseInt(req.params.brandId);

      const brand = await brandAction.getSingleBrandAction(brandId);

      res.status(200).json({
        message: `Brand ${brand.name} berhasil dimuat`,
        data: brand,
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;

      const brandId = parseInt(req.params.brandId);
      const updatedBrandProps = req.body;

      const updatedBrand = await brandAction.updateBrandAction({
        ...updatedBrandProps,
        creatorId: id,
        brandId,
      });

      res.status(200).json({
        message: 'Brand berhasil diperbarui',
        data: updatedBrand,
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const brandId = parseInt(req.params.brandId);

      await brandAction.deleteBrandAction(brandId);

      res.status(200).json({
        message: 'Brand berhasil dihapus',
      });
    } catch (err) {
      next(err);
    }
  }
}
