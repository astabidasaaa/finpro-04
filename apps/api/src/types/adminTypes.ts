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
  role?: AdminRole;
  storeId?: number;
  roleId?: number;
};
