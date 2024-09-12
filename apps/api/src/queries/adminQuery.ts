import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import { CreateBrandInput, UpdateBrandInput } from '@/types/brandTypes';
import { Brand, Role, User } from '@prisma/client';
import {
  CreateAdminInput,
  SearchedUser,
  SearchUsersInput,
  UpdateAdminInput,
} from '@/types/adminTypes';

class AdminQuery {
  public async getUsers(props: SearchUsersInput): Promise<{
    users: SearchedUser[];
    totalCount: number;
  }> {
    try {
      console.log(props);
      const filters: any = { AND: [{ deletedAt: null }] };

      if (props.keyword !== undefined || props.keyword !== '') {
        filters.AND.push({
          OR: [
            {
              profile: { name: { contains: props.keyword as string } },
            },
            {
              email: {
                contains: props.keyword as string,
              },
            },
          ],
        });
      }

      if (props.role !== '') {
        const role = await this.findRoleByName(props.role);
        filters.AND.push({ role: { id: role.id } });
      }

      if (props.storeId !== undefined && !isNaN(props.storeId)) {
        filters.AND.push({ storeId: props.storeId });
      }

      const totalAdmins = await prisma.user.count({ where: filters });

      const users = await prisma.user.findMany({
        where: filters,
        take: props.pageSize,
        skip: (props.page - 1) * props.pageSize,
        select: {
          id: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          profile: {
            select: {
              name: true,
              dob: true,
            },
          },
          store: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });

      return {
        users,
        totalCount: totalAdmins,
      };
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menampilkan data user',
      );
    }
  }

  public async findRoleByName(name: string): Promise<Role> {
    const role = await prisma.role.findFirst({
      where: {
        name,
      },
    });

    if (role === null) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Role tidak ditemukan');
    }

    return role;
  }

  public async createAdmin(
    props: CreateAdminInput & { referralCode: string },
  ): Promise<User> {
    try {
      const role = await this.findRoleByName(props.role);

      const admin = await prisma.user.create({
        data: {
          email: props.email,
          password: props.password,
          roleId: role.id,
          referralCode: props.referralCode,
          storeId: props.storeId,
          isVerified: true,
          profile: {
            create: {
              name: props.name,
            },
          },
        },
        include: {
          profile: {
            select: {
              name: true,
            },
          },
        },
      });

      return admin;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat admin',
      );
    }
  }

  public async updateAdminByUserId(props: UpdateAdminInput): Promise<User> {
    try {
      const updatedBrand = await prisma.user.update({
        where: {
          id: props.id,
        },
        data: {
          email: props.email,
          roleId: props.roleId,
          storeId: props.storeId,
          profile: {
            update: {
              name: props.name,
            },
          },
          updatedAt: new Date(),
        },
      });

      return updatedBrand;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menyimpan perubahan akun',
      );
    }
  }

  public async deleteAdmin(
    adminId: number,
    deletedEmail: string,
  ): Promise<void> {
    try {
      await prisma.user.update({
        where: {
          id: adminId,
        },
        data: {
          email: deletedEmail,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat menghapus admin',
      );
    }
  }
}

export default new AdminQuery();
