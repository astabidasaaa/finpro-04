import productAction from '@/actions/productAction';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { User } from '@/types/express';
import { Sort } from '@/types/productTypes';
import { Request, Response, NextFunction } from 'express';

export class ProductController {
  public async getProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        keyword = '',
        storeId = 1,
        subcategoryId,
        brandId,
        startPrice,
        endPrice,
        sortCol = 'nameAsc',
        page = 1,
        pageSize = 20,
      } = req.query;

      const products = await productAction.getProductsAction({
        keyword: String(keyword),
        storeId: Number(storeId),
        subcategoryId: Number(subcategoryId),
        brandId: Number(brandId),
        startPrice: Number(startPrice),
        endPrice: Number(endPrice),
        sortCol: String(sortCol),
        page: Number(page),
        pageSize: Number(pageSize),
      });

      res.status(200).json({
        message: 'Produk berhasil ditampilkan',
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getSingleProductDetail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { productId, storeId } = req.query;

      const product = await productAction.getSingleProductAction(
        Number(productId),
        Number(storeId),
      );

      res.status(200).json({
        message: 'Produk berhasil ditampilkan',
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  public async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { files } = req;
      // const { id } = req.user as User;
      const id = 3;
      const { name, brandId, subcategoryId, description, productState, price } =
        req.body;

      const images: string[] = [];
      if (Array.isArray(files)) {
        for (const file of files) {
          images.push(file.filename);
        }
      }

      const products = await productAction.createProductAction({
        name,
        brandId: parseInt(brandId),
        subcategoryId: parseInt(subcategoryId),
        description,
        productState,
        price: parseFloat(price),
        images,
        creatorId: id,
      });

      res.status(200).json({
        message: 'Produk berhasil dibuat',
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const productId = parseInt(req.params.productId);
      const updatedProductProps = req.body;

      const updatedProduct = await productAction.updateProductAction({
        ...updatedProductProps,
        productId,
        creatorId: id,
      });

      res.status(200).json({
        message: 'Produk berhasil diperbarui',
        data: updatedProduct,
      });
    } catch (err) {
      next(err);
    }
  }

  public async archiveProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const { id } = req.user as User;
      const id = 3;
      const productId = parseInt(req.params.productId);

      const archivedProduct = await productAction.archiveProductAction(
        id,
        productId,
      );

      res.status(200).json({
        message: 'Produk berhasil diarsip',
        data: archivedProduct,
      });
    } catch (err) {
      next(err);
    }
  }
}
