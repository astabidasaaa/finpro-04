import { SHIPPING_API_URL, SHIPPING_CLIENT_KEY } from '@/config';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import {
  TItemFromUser,
  TItemToPost,
  TPricing,
  TShipping,
  TShippingPayload,
} from '@/types/courierType';
import storeQuery from '@/queries/storeQuery';
import addressQuery from '@/queries/addressQuery';

class CourierAction {
  public async calculateShippingPrice({
    userId,
    storeId,
    addressId,
    itemList,
  }: {
    userId: number;
    storeId: number;
    addressId: number;
    itemList: TItemFromUser[];
  }) {
    const storeLocation = await storeQuery.findStoreById(storeId);

    if (!storeLocation) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Gagal menemukan lokasi toko',
      );
    }

    const customerLocation = await addressQuery.getAddressById(
      userId,
      addressId,
    );

    if (!customerLocation) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Gagal menemukan alamat pengguna',
      );
    }

    let items: TItemToPost[] = [];

    itemList.forEach((item) => {
      items.push({
        name: item.name,
        weight: 1000,
        quantity: item.quantity,
        value: item.value,
      });
    });

    const res = await fetch(SHIPPING_API_URL, {
      method: 'POST',
      headers: {
        Authorization: SHIPPING_CLIENT_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        origin_latitude: storeLocation.latitude,
        origin_longitude: storeLocation.longitude,
        destination_latitude: customerLocation.latitude,
        destination_longitude: customerLocation.longitude,
        couriers: 'jne,gojek,grab,jet,sicepat',
        items,
      }),
    });

    const result: TShipping = await res.json();

    if (!result.success) {
      throw new HttpException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'Gagal mengkalkulasi ongkos kirim',
      );
    }

    let payload: TShippingPayload = {
      success: result.success,
      origin: {
        latitude: result.origin?.latitude,
        longitude: result.origin?.longitude,
      },
      destination: {
        latitude: result.destination?.latitude,
        longitude: result.destination?.longitude,
      },
      pricing: [],
    };

    if (result.pricing) {
      result.pricing.forEach((item: TPricing, index: number) => {
        payload.pricing.push({
          courier_name: item.courier_name,
          courier_service_name: item.courier_service_name,
          duration: item.duration,
          price: item.price,
        });
      });
    }

    return payload;
  }
}

export default new CourierAction();
