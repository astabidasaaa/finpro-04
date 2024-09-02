import { HttpException } from '@/errors/httpException';
import userQuery from '@/queries/userQuery';
import { HttpStatus } from '@/types/error';
import { TUserUpdate } from '@/types/userUpdateType';

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
}

export default new UserAction();
