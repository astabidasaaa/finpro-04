export type CreateAdminInput = {
  name: string;
  email: string;
  role: AdminRole;
  password: string;
  storeId?: number;
};

export enum AdminRole {
  SUPERADMIN = 'super admin',
  STOREADMIN = 'store admin',
}

export type UpdateAdminInput = {
  id: number;
  name?: string;
  email?: string;
  storeId?: number;
  roleId?: number;
};

export type SearchUsersInput = {
  keyword: string;
  page: number;
  pageSize: number;
  role: string;
  storeId?: number;
};

export type SearchedUser = {
  role: {
    id: number;
    name: string;
  };
  id: number;
  email: string;
  profile: {
    name: string | null;
    dob: Date | null;
  } | null;
  store: {
    id: number;
    name: string;
  } | null;
};
