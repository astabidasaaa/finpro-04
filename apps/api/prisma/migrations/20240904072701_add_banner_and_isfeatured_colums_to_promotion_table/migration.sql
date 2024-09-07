-- AlterTable
ALTER TABLE `promotions` ADD COLUMN `banner` VARCHAR(191) NULL,
    ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false;
