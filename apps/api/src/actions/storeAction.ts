import { HttpException } from '@/errors/httpException';
import authQuery from '@/queries/authQuery';
import { HttpStatus } from '@/types/error';
import { generateRandomToken } from '@/utils/randomToken';
import userAction from './userAction';
import userQuery from '@/queries/userQuery';
import storeQuery from '@/queries/storeQuery';
import { State } from '@prisma/client';
import type { ParsedQs } from 'qs';
import { convertQueryToEnum } from '@/utils/convertQueryToEnums';
import { validateSortOrder } from '@/utils/validateSortOrder';
import storeManagementQuery from '@/queries/storeManagementQuery';
import { TStoreAddress } from '@/types/storeTypes';

type TStoresQuery = {
  keyword: string | undefined;
  state: string | ParsedQs | string[] | ParsedQs[] | undefined;
  sortBy: string | undefined;
  sortOrder: string | undefined;
  page: string | undefined;
  pageSize: string | undefined;
};

class StoreAction {
  public async getStoresWithQuery({
    id,
    keyword = '',
    state,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page,
    pageSize,
  }: TStoresQuery & { id: number }) {
    const DEFAULT_PAGE = 1;
    const DEFAULT_PAGE_SIZE = 20;

    const user = await userQuery.findUserById({ id });

    if (!user) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Pengguna tidak ditemukan',
      );
    }

    const pageConverted = isNaN(Number(page)) ? DEFAULT_PAGE : Number(page);
    const pageSizeConverted = isNaN(Number(pageSize))
      ? DEFAULT_PAGE_SIZE
      : Number(pageSize);

    const storeState = convertQueryToEnum(state);

    const sortOrderValidated = validateSortOrder(sortOrder);

    const stores = await storeManagementQuery.searchStores({
      keyword,
      state: storeState,
      sortBy,
      sortOrder: sortOrderValidated,
      page: pageConverted,
      pageSize: pageSizeConverted,
    });

    return stores;
  }

  public async getStoreById({
    userId,
    storeId,
  }: {
    userId: number;
    storeId: number;
  }) {
    const user = await userQuery.findUserById({ id: userId });

    if (!user) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Pengguna tidak ditemukan',
      );
    }

    const store = await storeManagementQuery.getStoreById(storeId);

    if (!store) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Toko tidak ditemukan');
    }

    return store;
  }

  public async createStore({
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
    const user = await userQuery.findUserById({ id: userId });

    if (!user) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Pengguna tidak ditemukan',
      );
    }

    const existingStore = await storeManagementQuery.findStoreName(storeName);

    if (existingStore) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Nama toko sudah digunakan',
      );
    }

    if (Array.isArray(storeAdmins) && storeAdmins.length > 0) {
      const validAdmins =
        await storeManagementQuery.validateAdmins(storeAdmins);

      if (validAdmins.length !== storeAdmins.length) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Admin toko tidak ditemukan',
        );
      }
    }

    const storeCreated = await storeManagementQuery.createNewStore({
      userId,
      storeName,
      storeState,
      storeAddress,
      storeAdmins,
    });

    if (!storeCreated) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Gagal membuat toko');
    }

    return storeCreated;
  }

  public async updateStore({
    userId,
    storeId,
    storeName,
    storeState,
    storeAddress,
    storeAdmins,
  }: {
    userId: number;
    storeId: number;
    storeName?: string;
    storeState?: State;
    storeAddress?: TStoreAddress;
    storeAdmins?: number[];
  }) {
    const user = await userQuery.findUserById({ id: userId });

    if (!user) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Pengguna tidak ditemukan',
      );
    }

    const checkStore = await storeManagementQuery.getStoreById(storeId);

    if (!checkStore) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Toko tidak ditemukan');
    }

    if (storeName) {
      const existingStore = await storeManagementQuery.findStoreName(storeName);

      if (existingStore) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Nama toko sudah digunakan',
        );
      }
    }

    if (Array.isArray(storeAdmins) && storeAdmins.length > 0) {
      const areAllAdminIdsNumbers = storeAdmins.every(
        (id) => typeof id === 'number',
      );

      if (!areAllAdminIdsNumbers) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Admin toko tidak ditemukan',
        );
      }

      const validAdmins =
        await storeManagementQuery.validateAdmins(storeAdmins);

      if (validAdmins.length !== storeAdmins.length) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Admin toko tidak ditemukan',
        );
      }
    }

    if (storeAddress) {
      const { address, latitude, longitude } = storeAddress;

      if (!address || !latitude || !longitude) {
        throw new HttpException(HttpStatus.BAD_REQUEST, 'Alamat tidak lengkap');
      }
    }

    const storeUpdate = await storeManagementQuery.updateStoreById({
      storeId,
      storeName,
      storeState,
      storeAddress,
      storeAdmins,
    });

    if (!storeUpdate) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Toko tidak ditemukan');
    }

    return storeUpdate;
  }

  public async deleteStore({
    userId,
    storeId,
  }: {
    userId: number;
    storeId: number;
  }) {
    const user = await userQuery.findUserById({ id: userId });

    if (!user) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'Pengguna tidak ditemukan',
      );
    }

    const checkStore = await storeManagementQuery.getStoreById(storeId);

    if (!checkStore) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Toko tidak ditemukan');
    }

    const storeDelete = await storeManagementQuery.deleteStoreById(storeId);

    if (!storeDelete) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Toko tidak ditemukan');
    }

    return storeDelete;
  }
}

export default new StoreAction();
