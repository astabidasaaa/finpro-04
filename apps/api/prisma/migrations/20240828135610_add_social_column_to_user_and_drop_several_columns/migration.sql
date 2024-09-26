/*
  Warnings:

  - You are about to drop the column `categoryState` on the `product_categories` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryState` on the `product_subcategories` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product_categories` DROP COLUMN `categoryState`;

-- AlterTable
ALTER TABLE `product_subcategories` DROP COLUMN `subCategoryState`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `profileId`,
    ADD COLUMN `facebookId` VARCHAR(191) NULL,
    ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL,
    ADD COLUMN `resetPasswordTokenExpiry` DATETIME(3) NULL,
    ADD COLUMN `twitterId` VARCHAR(191) NULL,
    ADD COLUMN `verificationToken` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;
