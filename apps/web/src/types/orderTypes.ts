export type NearestStore = {
  storeId: number;
  storeAddressId: number;
  name: string;
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  discountedPrice: number;
  price: number;
  image: string;
  buy?: number;               // For "Beli x"
  get?: number; 
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
