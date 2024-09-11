import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';

class StoreQuery {
  public async findStoreByIdBasedOnCategory(id: number) {
    const storeProduct = await prisma.productCategory.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        subcategories: {
          select: {
            id: true,
            name: true,
            products: {
              take: 2,
              where: {
                productState: {
                  equals: 'PUBLISHED',
                },
                inventories: {
                  some: {
                    storeId: id,
                    stock: {
                      gt: 0,
                    },
                  },
                },
              },
              select: {
                id: true,
                name: true,
                description: true,
                prices: {
                  where: {
                    active: true,
                  },
                  select: {
                    price: true,
                  },
                },
                images: {
                  take: 1,
                  select: {
                    title: true,
                  },
                },
                inventories: {
                  where: {
                    storeId: id,
                  },
                  select: {
                    storeId: true,
                    stock: true,
                    store: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return storeProduct;
  }

  public async findAllStoreAndReturnLatAndLong() {
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        addresses: {
          where: { deleted: false },
          select: {
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    return stores;
  }

  public async findStoreById(id: number) {
    const store = await prisma.store.findUnique({
      where: {
        id,
      },
      select: {
        addresses: {
          where: {
            deleted: false,
          },
          select: {
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    return store?.addresses[0];
  }
}

export default new StoreQuery();
