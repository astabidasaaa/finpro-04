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
        id: true,
        name: true,
        isFeatured: true,
        source: true,
        banner: true,
        discountType: true,
        discountValue: true,
        discountDurationSecs: true,
        promotionType: true,
        startedAt: true,
        finishedAt: true,
        description: true,
        maxDeduction: true,
        minPurchase: true,
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
