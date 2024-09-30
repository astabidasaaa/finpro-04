import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';
import productAction from '@/actions/productAction';
import productQuery from '@/queries/productQuery';

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

  public async getProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const productId = Number(req.params.productId);

      const product = await productQuery.getProductDetailById(productId);
      if (product === null) {
        throw new HttpException(
          HttpStatus.NOT_FOUND,
          'Tidak terdapat produk dengan ID ini',
        );
      }

      res.status(200).json({
        message: 'Mengambil informasi produk berhasil',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProductList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let { page = 1, pageSize = 20, keyword = '', productState } = req.query;

      const productList = await productAction.getProductsListAction({
        productState: String(productState),
        keyword: String(keyword),
        page: Number(page),
        pageSize: Number(pageSize),
      });

      res.status(200).json({
        message: 'Mengambil daftar produk berhasil',
        data: productList,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getAllProductBrief(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const products = await productQuery.getAllProductBrief();

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
      const { id } = req.user as User;

      const { name, brandId, subcategoryId, description, productState, price } =
        req.body;

      const images: string[] = [];
      if (Array.isArray(files)) {
        for (const file of files) {
          images.push(file.filename);
        }
      }

      const product = await productAction.createProductAction({
        name,
        brandId: parseInt(brandId),
        subcategoryId: parseInt(subcategoryId),
        description,
        productState,
        price: parseFloat(price),
        images,
        creatorId: Number(id),
      });

      res.status(200).json({
        message: 'Produk berhasil dibuat',
        data: product,
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
      const { files } = req;
      const updatedProductProps = req.body;

      const images: string[] = [];
      if (Array.isArray(files)) {
        for (const file of files) {
          images.push(file.filename);
        }
      }

      const updatedProduct = await productAction.updateProductAction({
        ...updatedProductProps,
        imagesToDelete: JSON.parse(updatedProductProps.imagesToDelete),
        images,
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
      const { id } = req.user as User;
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
