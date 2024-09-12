import { HttpException } from '@/errors/httpException';
import { calculateDistance } from '@/utils/calculateDistance';
import storeQuery from '@/queries/storeQuery';
import { HttpStatus } from '@/types/error';

class DisplayStoreAction {
  public async getAllStore(): Promise<
    {
      id: number;
      name: string;
    }[]
  > {
    const stores = await storeQuery.getAllStore();

    return stores;
  }

  public async getStorebyStoreId(storeId: number) {
    const store = await storeQuery.findSingleStore(storeId);
    if (store === null) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Toko tidak ditemukan');
    }

    return store;
  }

  public async getNearestStoreId(latitude: number, longitude: number) {
    if (latitude && longitude) {
      const stores = await storeQuery.findAllStoreAndReturnLatAndLong();

      let nearestStoreId = null;
      let shortestDistance = Infinity;

      stores.forEach((store) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          parseFloat(store.addresses[0].latitude),
          parseFloat(store.addresses[0].longitude),
        );

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestStoreId = store.id;
        }
      });

      if (nearestStoreId) {
        return nearestStoreId;
      } else {
        throw new HttpException(HttpStatus.NOT_FOUND, 'Toko tidak ditemukan');
      }
    }
  }

  public async getNearestStoreProductBasedOnCategory(id: number) {
    const nearestStoreProduct =
      await storeQuery.findStoreByIdBasedOnCategory(id);

    if (!nearestStoreProduct) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Toko tidak ditemukan');
    }

    return nearestStoreProduct;
  }
}

export default new DisplayStoreAction();
