export type TLatLng = {
  latitude?: number;
  longitude?: number;
};

export type TPricing = {
  courier_name: string;
  courier_service_name: string;
  duration: string;
  price: number;
};

export type TShipping = {
  success: boolean;
  code: number;
  error?: string;
  object?: string;
  message?: string;
  origin?: TLatLng;
  destination?: TLatLng;
  pricing?: TPricing[];
};

export type TShippingPayload = {
  success: boolean;
  origin: TLatLng;
  destination: TLatLng;
  pricing: TPricing[];
};

export type TItemFromUser = {
  name: string;
  quantity: number;
  value: number;
};

export type TItemToPost = {
  name: string;
  weight: number;
  quantity: number;
  value: number;
};
