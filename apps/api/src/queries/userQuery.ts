import prisma from '@/prisma';
import authQuery from './authQuery';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import verifyEmailAction from '@/actions/verifyEmailAction';
import { TUserUpdate } from '@/types/userUpdateType';

class UserQuery {
  public async findSelfProfile(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        isVerified: true,
        referralCode: true,
        password: true,
        profile: {
          select: {
            avatar: true,
            name: true,
            phone: true,
            dob: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  public async updateSelfProfile(props: TUserUpdate) {
    const { id, email, avatar, name, phone, dob } = props;

    let fields = {};
    if (email) {
      // check whether email has been used then return boolean (true if used, false if available)
      const isEmailTaken = await authQuery.findUserByEmail(email);

      if (isEmailTaken) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          'Email sudah digunakan',
        );
      }

      fields = { ...fields, email };
    }

    // profile object for avatar, name, phone, and dob
    let profile = {};

    // check if each fields is defined then add to profile object
    if (avatar) profile = { ...profile, avatar };
    if (name) profile = { ...profile, name };
    if (phone) profile = { ...profile, phone };
    if (dob) profile = { ...profile, dob };

    // update user and profile table
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          ...fields,
          profile: {
            update: {
              where: {
                userId: id,
              },
              data: {
                ...profile,
                updatedAt: new Date(),
              },
            },
          },
        },
        select: {
          email: true,
        },
      });

      // if email updated, update isVerified to false and resend email verification
      if (email && user) {
        await tx.user.update({
          where: {
            id,
          },
          data: {
            isVerified: false,
          },
        });
      }

      return user;
    });

    if (email && result) {
      await verifyEmailAction.verifyEmailRequest(result.email);
    }

    return result;
  }

  public async findUserById({ id }: { id: number }) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return user;
  }
}

export default new UserQuery();
