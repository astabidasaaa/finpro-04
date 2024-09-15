import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';
import { CreatePromotionInput } from '@/types/promotionTypes';
import { Promotion } from '@prisma/client';

class PromotionQuery {
  async createPromotion(props: CreatePromotionInput): Promise<Promotion> {
    try {
      const promotion = await prisma.promotion.create({
        data: props,
      });

      return promotion;
    } catch (err) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Tidak dapat membuat promosi',
      );
    }
  }
}

export default new PromotionQuery();
