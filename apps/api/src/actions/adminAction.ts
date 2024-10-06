import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import prisma from '@/prisma';
import { User } from '@prisma/client';
import { capitalizeString } from '@/utils/stringManipulation';
import {
  AdminRole,
  type CreateAdminInput,
  type SearchedUser,
  type SearchUsersInput,
  type UpdateAdminInput,
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
    const { id, name, storeId, email } = props;
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

    if (admin.role.name === AdminRole.SUPERADMIN) {
      const activeSuperAdminCount = await prisma.user.count({
        where: {
          deletedAt: null,
          role: { name: AdminRole.SUPERADMIN },
        },
      });

      if (activeSuperAdminCount === 1) {
        throw new HttpException(
          HttpStatus.NOT_FOUND,
          'Tidak dapat menghapus super admin karena SIGMART harus memiliki minimal 1 super admin',
        );
      }
    }

    const deletedEmail = `${admin.email}-${admin.id}-deleted`;

    await adminQuery.deleteAdmin(adminId, deletedEmail);
  }

  public async getAllAdminsAction({
    search,
    limit,
    offset,
  }: {
    search: string | undefined;
    limit: string | undefined;
    offset: string | undefined;
  }) {
    const DEFAULT_LIMIT = 20;
    const DEFAULT_OFFSET = 0;

    const limitConverted = isNaN(Number(limit)) ? DEFAULT_LIMIT : Number(limit);
    const offsetConverted = isNaN(Number(offset))
      ? DEFAULT_OFFSET
      : Number(offset);

    const admins = await adminQuery.getAllAdmins({
      search,
      limit: limitConverted,
      offset: offsetConverted,
    });

    if (!admins) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Daftar admin tidak ditemukan',
      );
    }

    return admins;
  }
}

export default new AdminAction();
