import { SHIPPING_CLIENT_KEY } from '@/config';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import {
  TItemFromUser,
  TItemToPost,
  TPricing,
  TShipping,
  TShippingPayload,
} from '@/types/courierType';

class CourierAction {
  public async calculateShippingPrice({
    origin_latitude,
    origin_longitude,
    destination_latitude,
    destination_longitude,
    itemList,
  }: {
    origin_latitude: string;
    origin_longitude: string;
    destination_latitude: string;
    destination_longitude: string;
    itemList: TItemFromUser[];
  }) {
    let items: TItemToPost[] = [];

    itemList.forEach((item, index) => {
      items.push({
        name: item.name,
        weight: 1000,
        quantity: item.quantity,
        value: item.value,
      });
    });

    const res = await fetch('https://api.biteship.com/v1/rates/couriers', {
      method: 'POST',
      headers: {
        Authorization: SHIPPING_CLIENT_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
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

    result.pricing?.forEach((item: TPricing, index: number) => {
      payload.pricing.push({
        courier_name: item.courier_name,
        courier_service_name: item.courier_service_name,
        duration: item.duration,
        price: item.price,
      });
    });

    return payload;
  }
}

export default new CourierAction();
