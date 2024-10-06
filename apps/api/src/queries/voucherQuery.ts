import prisma from '@/prisma';
import { HttpException } from '@/errors/httpException';
import { HttpStatus } from '@/types/error';
import { $Enums, type Promotion, type Voucher } from '@prisma/client';

class VoucherQuery {
  public async getVouchersByUserId(
    id: number,
  ): Promise<(Voucher & { promotion: Promotion })[]> {
    const vouchers = await prisma.voucher.findMany({
      where: {
        customerId: id,
        status: $Enums.VoucherStatus.UNUSED,
        expiredAt: {
          gte: new Date(),
        },
      },
      include: {
        promotion: {
          include: {
            store: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return vouchers;
  }

  public async createVoucherForCustomer(
    promotionId: number,
    customerId: number,
  ): Promise<Voucher> {
    try {
      const generatedVoucher = await prisma.$transaction(async (prisma) => {
        const currentPromotion = await prisma.promotion.findUnique({
          where: {
            id: promotionId,
          },
        });

        if (currentPromotion === null) {
          throw new HttpException(
            HttpStatus.NOT_FOUND,
            'Promosi tidak ditemukan',
          );
        }

        if (currentPromotion.quota <= 0) {
          throw new HttpException(
            HttpStatus.FORBIDDEN,
            'Kuota promosi telah habis, kupon tidak dapat dibuat',
          );
        }

        const now = new Date();
        now.setSeconds(
          now.getSeconds() + currentPromotion.discountDurationSecs,
        );

        const voucher = await prisma.voucher.create({
          data: {
            promotionId,
            customerId,
            expiredAt: now,
          },
        });

        await prisma.promotion.update({
          where: {
            id: promotionId,
          },
          data: {
            quota: currentPromotion.quota - 1,
            updatedAt: new Date(),
          },
        });

        return voucher;
      });
      return generatedVoucher;
    } catch (err) {
      throw err;
    }
  }

  public async isVoucherAlreadyClaimed(
    promotionId: number,
    customerId: number,
  ): Promise<boolean> {
    const voucher = await prisma.voucher.findFirst({
      where: {
        promotionId,
        customerId,
      },
    });

    if (voucher !== null) {
      return true;
    }
    return false;
  }
}

export default new VoucherQuery();
