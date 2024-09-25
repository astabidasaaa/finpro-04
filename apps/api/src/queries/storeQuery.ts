import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { $Enums, State, Store } from '@prisma/client';

class StoreQuery {
  public async findSingleStore(storeId: number): Promise<Store | null> {
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
    });

    return store;
  }

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
                    store: {
                      storeState: 'PUBLISHED',
                    },
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
                    freeProductPerStores: {
                      where: {
                        freeProductState: 'PUBLISHED',
                        startedAt: { lte: new Date() },
                        finishedAt: { gt: new Date() },
                      },
                      select: {
                        buy: true,
                        get: true,
                      },
                    },
                    productDiscountPerStores: {
                      where: {
                        productDiscountState: 'PUBLISHED',
                        startedAt: { lte: new Date() },
                        finishedAt: { gt: new Date() },
                      },
                      select: {
                        discountType: true,
                        discountValue: true,
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
      where: {
        storeState: 'PUBLISHED',
      },
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
        storeState: 'PUBLISHED',
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

  public async getAllStore() {
    const stores = await prisma.store.findMany({
      where: {
        storeState: 'PUBLISHED',
      },
      select: {
        id: true,
        name: true,
      },
    });

    return stores;
  }

  public async isStoreExist(storeId: number) {
    const isStore = await prisma.store.findFirst({
      where: { id: storeId },
    });

    if (isStore === null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak terdapat toko dengan ID ini',
      );
    } else if (
      isStore !== null &&
      isStore.storeState === $Enums.State.ARCHIVED
    ) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Tidak dapat memperbarui toko yang sudah diarsip',
      );
    }
  }

  public async getDraftAndPublishStore() {
    const stores = await prisma.store.findMany({
      where: {
        OR: [
          { storeState: $Enums.State.DRAFT },
          { storeState: $Enums.State.PUBLISHED },
        ],
      },
      select: {
        id: true,
        name: true,
      },
    });

    return stores;
  }

  public async getAllAdminByStoreId(storeId: number): Promise<number[]> {
    const adminstore = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
      select: {
        admins: {
          select: {
            id: true,
          },
        },
      },
    });

    if (adminstore == null) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Toko tidak ditemukan',
      );
    }

    const adminIds = adminstore.admins.map((admin) => admin.id);

    return adminIds;
  }

  public async getAdminStore(
    adminId: number,
  ): Promise<{ id: number; name: string } | null> {
    const adminstore = await prisma.user.findFirst({
      where: {
        id: adminId,
      },
      select: {
        storeId: true,
        store: {
          select: {
            name: true,
          },
        },
      },
    });

    if (adminstore == null) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Admin toko tidak ditemukan',
      );
    }

    if (adminstore.storeId !== null && adminstore.store !== null) {
      return {
        id: adminstore.storeId,
        name: adminstore.store.name,
      };
    }
    return null;
  }
}

export default new StoreQuery();
