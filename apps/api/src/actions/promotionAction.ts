import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { HttpStatus } from '@/types/error';

class PromotionAction {
  public async createGeneralPromotionAction() {}
}

export default new PromotionAction();
