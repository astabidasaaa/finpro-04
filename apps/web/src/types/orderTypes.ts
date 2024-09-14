export type NearestStore = {
  storeId: number;
  storeAddressId: number;
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

export type TShipping = {
  amount: number;
  courier: string;
};

export type TCourierPrice = {
  courier_name: string;
  courier_service_name: string;
  duration: string;
  price: number;
};

export type TCourier = {
  success: boolean;
  origin: {
    latitude: string | number;
    longitude: string | number;
  };
  destination: {
    latitude: string | number;
    longitude: string | number;
  };
  pricing: TCourierPrice[];
};
