import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';

class FeaturedPromotionAction {
  public async getFeaturedPromotion() {
    const promotions = await prisma.promotion.findMany({
      where: {
        promotionState: 'PUBLISHED',
        scope: 'GENERAL',
        startedAt: {
          lte: new Date(),
        },
        finishedAt: {
          gt: new Date(),
        },
        banner: {
          not: null,
        },
        isFeatured: true,
      },

      select: {
        name: true,
        isFeatured: true,
        banner: true,
      },
    });

    if (!promotions) {
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Gagal mengambil promosi unggulan',
      );
    }

    return promotions;
  }
}

export default new FeaturedPromotionAction();
