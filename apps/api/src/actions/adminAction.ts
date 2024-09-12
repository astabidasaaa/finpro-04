import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { Brand, User } from '@prisma/client';
import { capitalizeString } from '@/utils/stringManipulation';
import {
  CreateAdminInput,
  SearchedUser,
  SearchUsersInput,
  UpdateAdminInput,
} from '@/types/adminTypes';
import authQuery from '@/queries/authQuery';
import { hashingPassword } from '@/utils/password';
import adminQuery from '@/queries/adminQuery';
import userQuery from '@/queries/userQuery';

class AdminAction {
  public async getUsersAction(props: SearchUsersInput): Promise<{
    users: SearchedUser[];
    totalCount: number;
  }> {
    const allProduct = await adminQuery.getUsers(props);

    return allProduct;
  }

  public async createAdminAction(props: CreateAdminInput): Promise<User> {
    const isEmailTaken = await authQuery.findUserByEmail(props.email);

    if (isEmailTaken) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Email sudah digunakan');
    }

    const hashedPassword = await hashingPassword(props.password);
    const name = capitalizeString(props.name);

    const referralCode = await authQuery.generateUniqueReferralCode();

    const admin = await adminQuery.createAdmin({
      ...props,
      name,
      password: hashedPassword,
      referralCode,
    });

    return admin;
  }

  public async updateAdminAction(props: UpdateAdminInput): Promise<User> {
    const { id, name, role, storeId, email } = props;
    let updateData: any = {};

    const currentAdmin = await userQuery.findSelfProfile(id);
    if (currentAdmin === null) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        'ID admin tidak ditemukan',
      );
    }

    if (name !== undefined) {
      if (name === '') {
        throw new HttpException(
          HttpStatus.FORBIDDEN,
          'Nama tidak boleh kosong',
        );
      }
      const formattedName = capitalizeString(name);
      if (currentAdmin.profile?.name !== formattedName) {
        updateData.name = formattedName;
      }
    }

    if (role !== undefined) {
      const updatedRole = await adminQuery.findRoleByName(role);
      if (currentAdmin.role.name !== updatedRole.name) {
        updateData.roleId = updatedRole.id;
      }
    }

    if (email !== undefined && email !== currentAdmin.email) {
      const isEmailTaken = await authQuery.findUserByEmail(email);
      if (isEmailTaken) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Email sudah digunakan',
        );
      }
      updateData.email = email;
    }

    if (storeId !== undefined && storeId !== currentAdmin.store?.id) {
      updateData.storeId = storeId;
    }

    if (Object.keys(updateData).length > 0) {
      const updatedBrand = await adminQuery.updateAdminByUserId({
        ...updateData,
        id,
      });

      return updatedBrand;
    } else {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Perubahan tidak dapat disimpan karena tidak ada perubahan yang dilakukan pada akun ini',
      );
    }
  }

  public async deleteAdminAction(adminId: number): Promise<void> {
    const admin = await userQuery.findSelfProfile(adminId);

    if (admin == null) {
      throw new HttpException(
        HttpStatus.NOT_FOUND,
        'Tidak dapat menghapus admin ini karena admin tidak ditemukan',
      );
    }

    const deletedEmail = `${admin.email}-${admin.id}-deleted`;

    await adminQuery.deleteAdmin(adminId, deletedEmail);
  }
}

export default new AdminAction();
