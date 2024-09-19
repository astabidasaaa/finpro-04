/*
  Warnings:

  - You are about to drop the column `minTransaction` on the `promotions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `promotions` DROP COLUMN `minTransaction`,
    ADD COLUMN `afterMinPurchase` DOUBLE NULL,
    ADD COLUMN `afterMinTransaction` INTEGER NULL,
    MODIFY `source` ENUM('REFEREE_BONUS', 'REFERRAL_BONUS', 'PER_BRANCH', 'ALL_BRANCH', 'AFTER_MIN_PURCHASE', 'AFTER_MIN_TRANSACTION') NOT NULL;

-- CreateIndex
CREATE INDEX `promotions_promotionState_finishedAt_idx` ON `promotions`(`promotionState`, `finishedAt`);
