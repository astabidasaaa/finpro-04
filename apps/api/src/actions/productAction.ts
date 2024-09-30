import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import type {
  UpdateProductInput,
  CreateProductInput,
  ProductProps,
  SearchProductInput,
  SearchedProduct,
  ProductDetailProps,
  ProductListInput,
} from '@/types/productTypes';
import type { Product } from '@prisma/client';
import productQuery from '@/queries/productQuery';
import productSearchQuery from '@/queries/productSearchQuery';
import productDetailQuery from '@/queries/productDetailQuery';

class ProductAction {
  public async createProductAction(
    props: CreateProductInput,
  ): Promise<Product> {
    const { name, images } = props;

    if (images.length == 0) {
      new HttpException(
        HttpStatus.BAD_REQUEST,
        'Produk harus memiliki setidaknya 1 gambar',
      );
    }

    await this.checkDuplicateProductName(name);

    const product = await productQuery.createProduct({
      ...props,
      name: name,
    });

    return product;
  }

  private async checkDuplicateProductName(name: string): Promise<void> {
    const duplicateProduct =
      await productQuery.getProductByCaseInsensitiveName(name);
    if (duplicateProduct !== null) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Nama produk ini sudah terdaftar, silakan gunakan nama lain',
        'Duplicate Entry',
      );
    }
  }

  public async getProductsAction(
    props: SearchProductInput,
  ): Promise<{ products: SearchedProduct[]; totalCount: number }> {
    const allProduct = await productSearchQuery.getProducts(props);

    return allProduct;
  }

  public async getProductsListAction(
    props: ProductListInput,
  ): Promise<{ products: Product[]; totalCount: number }> {
    const productList = await productQuery.getProductsByState(props);

    return productList;
  }

  public async getSingleProductAction(
    productId: number,
    storeId: number,
  ): Promise<ProductDetailProps> {
    const product = await productDetailQuery.getProductByIdAndStoreId(
      productId,
      storeId,
    );
    if (product == null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID produk tidak ditemukan',
      );
    }

    return product;
  }

  public async updateProductAction(
    props: UpdateProductInput,
  ): Promise<ProductProps | null> {
    const {
      productId,
      name,
      creatorId,
      brandId,
      subcategoryId,
      description,
      productState,
      price,
      images,
      imagesToDelete,
    } = props;
    let updateData: any = {};

    const currentProduct = await productQuery.getProductById(productId);
    if (currentProduct == null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID produk tidak ditemukan',
      );
    }

    if (name !== undefined) {
      const checkNameWithCurrent = await productQuery.isProductNameSame(
        currentProduct.id,
        name,
      );
      if (!checkNameWithCurrent) {
        await this.checkDuplicateProductName(name);
      }
      updateData.name = name;
    }

    if (
      description !== undefined &&
      description.trim() !== currentProduct.description.trim()
    ) {
      updateData.description = description.trim();
    }

    (
      [
        Number(brandId),
        Number(subcategoryId),
        productState,
        description,
      ] as const
    ).forEach((prop, index) => {
      const key = ['brandId', 'subcategoryId', 'productState', 'description'][
        index
      ] as keyof ProductProps;

      if (prop !== undefined && prop !== currentProduct[key]) {
        updateData[key] = prop;
      }
    });

    if (
      price !== undefined &&
      Number(price) !== currentProduct.prices[0].price
    ) {
      updateData.price = Number(price);
    }

    if (Object.keys(updateData).length > 0) {
      const updatedProduct = await productQuery.updateProductByProductId({
        productId,
        creatorId,
        images,
        imagesToDelete,
        ...updateData,
      });

      return updatedProduct;
    } else {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Perubahan tidak dapat disimpan karena tidak ada perubahan yang dilakukan pada produk ini',
      );
    }
  }

  public async archiveProductAction(
    creatorId: number,
    productId: number,
  ): Promise<Product> {
    const archivedProduct = await productQuery.getProductById(productId);

    if (archivedProduct == null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Tidak dapat menghapus produk ini karena produk tidak ditemukan',
      );
    }

    const product = await productQuery.archiveProduct(creatorId, productId);
    return product;
  }
}

export default new ProductAction();
