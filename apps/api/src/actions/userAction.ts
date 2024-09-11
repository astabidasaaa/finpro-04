import { HttpException } from '@/errors/httpException';
import userQuery from '@/queries/userQuery';
import { HttpStatus } from '@/types/error';
import {
  TCreateAddress,
  TUpdateAddress,
  TUserUpdate,
} from '@/types/userUpdateType';

class UserAction {
  public async getSelfProfile(id: number) {
    const user = await userQuery.findSelfProfile(id);

    if (!user)
      throw new HttpException(HttpStatus.NOT_FOUND, 'Pengguna tidak ditemukan');

    const payload = {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      isPassword: !!user.password,
      role: user.role.name,
      referralCode: user.referralCode,
      avatar: user.profile?.avatar,
      name: user.profile?.name,
      phone: user.profile?.phone,
      dob: user.profile?.dob,
    };

    return payload;
  }

  public async updateSelfProfile(props: TUserUpdate) {
    const user = await userQuery.updateSelfProfile(props);

    if (!user)
      throw new HttpException(HttpStatus.NOT_FOUND, 'Pengguna tidak ditemukan');

    return user;
  }

  public async getAllAddresses(id: number) {
    const user = await userQuery.getAddressQuery(id);

    if (!user)
      throw new HttpException(HttpStatus.NOT_FOUND, 'Pengguna tidak ditemukan');

    return user.addresses;
  }

  public async createAddress({
    id,
    name,
    address,
    zipCode,
    latitude,
    longitude,
  }: TCreateAddress) {
    const user = await userQuery.findSelfProfile(id);

    if (!user)
      throw new HttpException(HttpStatus.NOT_FOUND, 'Pengguna tidak ditemukan');

    const createAddress = await userQuery.createAddressQuery({
      id,
      name,
      address,
      zipCode,
      latitude,
      longitude,
    });

    if (!createAddress)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Gagal membuat alamat baru',
      );
  }

  public async updateAddress({
    id,
    addressId,
    name,
    address,
    zipCode,
    latitude,
    longitude,
  }: TUpdateAddress) {
    const user = await userQuery.findSelfProfile(id);

    if (!user)
      throw new HttpException(HttpStatus.NOT_FOUND, 'Pengguna tidak ditemukan');

    const updateAddress = await userQuery.updateAddressQuery({
      id,
      addressId,
      name,
      address,
      zipCode,
      latitude,
      longitude,
    });

    if (!updateAddress)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Gagal mengupdate alamat',
      );
  }

  public async deleteAddress({ id, addressId }: TUpdateAddress) {
    const user = await userQuery.findSelfProfile(id);

    if (!user)
      throw new HttpException(HttpStatus.NOT_FOUND, 'Pengguna tidak ditemukan');

    const deleteAddress = await userQuery.deleteAddressQuery({
      id,
      addressId,
    });

    if (!deleteAddress)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Gagal menghapus alamat',
      );
  }

  public async changeMainAddress({ id, addressId }: TUpdateAddress) {
    const user = await userQuery.findSelfProfile(id);

    if (!user)
      throw new HttpException(HttpStatus.NOT_FOUND, 'Pengguna tidak ditemukan');

    const changedMainAddress = await userQuery.changeMainAddressQuery({
      id,
      addressId,
    });

    if (!changedMainAddress)
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Gagal mengubah alamat utama',
      );
  }
}

export default new UserAction();
