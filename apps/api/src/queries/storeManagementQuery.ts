import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { State, Store } from '@prisma/client';
import { TStoreAddress } from '@/types/storeTypes';

class StoreManagementQuery {
  public async findStoreName(name: string) {
    const existingStore = await prisma.store.findUnique({
      where: { name },
    });

    return existingStore;
  }

  public async validateAdmins(adminIds: number[]) {
    const validAdmins = await prisma.user.findMany({
      where: {
        id: { in: adminIds },
        role: {
          name: 'store admin',
        },
      },
    });

    return validAdmins;
  }

  public async searchStores({
    keyword,
    state,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }: {
    keyword: string;
    state: State | null;
    sortBy: string;
    sortOrder: string;
    page: number;
    pageSize: number;
  }) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const storeCount = await prisma.store.count({
      where: {
        storeState: {
          not: 'ARCHIVED',
        },
        AND: [
          {
            OR: [
              {
                name: {
                  contains: keyword,
                },
              },
              {
                addresses: {
                  some: {
                    address: {
                      contains: keyword,
                    },
                    deleted: false,
                  },
                },
              },
              {
                creator: {
                  OR: [
                    {
                      email: {
                        contains: keyword,
                      },
                    },
                    {
                      profile: {
                        name: {
                          contains: keyword,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
          state ? { storeState: state } : {},
        ],
      },
    });

    const stores = await prisma.store.findMany({
      where: {
        storeState: {
          not: 'ARCHIVED',
        },
        AND: [
          {
            OR: [
              {
                name: {
                  contains: keyword,
                },
              },
              {
                addresses: {
                  some: {
                    address: {
                      contains: keyword,
                    },
                    deleted: false,
                  },
                },
              },
              {
                creator: {
                  OR: [
                    {
                      email: {
                        contains: keyword,
                      },
                    },
                    {
                      profile: {
                        name: {
                          contains: keyword,
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },

          state ? { storeState: state } : {},
        ],
      },
      orderBy:
        sortBy === 'admins'
          ? {
              admins: {
                _count: sortOrder as any,
              },
            }
          : {
              createdAt: sortOrder as any,
            },
      skip,
      take,
      select: {
        id: true,
        name: true,
        storeState: true,
        createdAt: true,
        _count: {
          select: {
            admins: true,
          },
        },
        creator: {
          select: {
            email: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
        addresses: {
          where: {
            deleted: false,
          },
          select: {
            id: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        admins: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      stores,
      totalStores: storeCount,
      currentPage: page,
      totalPages: Math.ceil(storeCount / pageSize),
    };
  }

  public async createNewStore({
    userId,
    storeName,
    storeState,
    storeAddress,
    storeAdmins,
  }: {
    userId: number;
    storeName: string;
    storeState: State;
    storeAddress: TStoreAddress;
    storeAdmins: number[];
  }) {
    const newStore = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        select: {
          id: true,
        },
      });

      const store = await tx.store.create({
        data: {
          name: storeName,
          creatorId: userId,
          storeState: storeState,
          addresses: {
            create: {
              address: storeAddress.address,
              latitude: storeAddress.latitude,
              longitude: storeAddress.longitude,
              deleted: false,
            },
          },
          admins: {
            connect:
              storeAdmins.map((adminId: number) => ({ id: adminId })) || [],
          },
          inventories: {
            create: products.map((product) => ({
              productId: product.id,
            })),
          },
        },
      });

      return store;
    });

    return newStore;
  }

  public async getStoreById(storeId: number) {
    const store = prisma.store.findUnique({
      where: {
        id: storeId,
        storeState: {
          not: 'ARCHIVED',
        },
      },
      select: {
        id: true,
        name: true,
        storeState: true,
        createdAt: true,
        _count: {
          select: {
            admins: true,
          },
        },
        creator: {
          select: {
            email: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
        addresses: {
          where: {
            deleted: false,
          },
          select: {
            id: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        admins: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return store;
  }

  public async updateStoreById({
    storeId,
    storeName,
    storeState,
    storeAddress,
    storeAdmins,
  }: {
    storeId: number;
    storeName?: string;
    storeState?: State;
    storeAddress?: TStoreAddress;
    storeAdmins?: number[];
  }) {
    const updatedStore = await prisma.$transaction(async (tx) => {
      const updateData: any = {};

      if (storeName) {
        updateData.name = storeName;
      }

      if (storeState) {
        updateData.storeState = storeState;
      }

      if (Array.isArray(storeAdmins) && storeAdmins.length > 0) {
        updateData.admins = {
          set: storeAdmins.map((adminId: number) => ({ id: adminId })),
        };
      }

      if (storeAddress) {
        await tx.storeAddressHistory.updateMany({
          where: {
            storeId,
          },
          data: {
            deleted: true,
          },
        });

        await tx.storeAddressHistory.create({
          data: {
            storeId: Number(storeId),
            address: storeAddress.address,
            latitude: storeAddress.latitude,
            longitude: storeAddress.longitude,
            deleted: false,
          },
        });
      }

      const store = await tx.store.update({
        where: { id: Number(storeId) },
        data: { ...updateData, updatedAt: new Date() },
      });

      return store;
    });

    return updatedStore;
  }

  public async deleteStoreById(storeId: number) {
    const store = await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        storeState: 'ARCHIVED',
      },
      select: {
        id: true,
      },
    });

    return store;
  }
}

export default new StoreManagementQuery();
