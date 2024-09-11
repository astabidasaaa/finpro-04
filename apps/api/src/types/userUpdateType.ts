export type TUserUpdate = {
  id: number;
  email?: string;
  avatar?: string;
  name?: string;
  phone?: string;
  dob?: Date;
};

export type TCreateAddress = {
  id: number;
  name: string;
  address: string;
  zipCode: number;
  latitude: string;
  longitude: string;
};

export type TUpdateAddress = {
  id: number;
  addressId: number;
  name?: string;
  address?: string;
  zipCode?: number;
  latitude?: string;
  longitude?: string;
};
