/*
  Warnings:

  - You are about to drop the column `productId` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_categories` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `storeId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `stores` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `brands` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `storeAddressId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product_categories` DROP FOREIGN KEY `product_categories_productId_fkey`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_storeId_fkey`;

-- AlterTable
ALTER TABLE `addresses` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `brands` DROP COLUMN `productId`,
    ADD COLUMN `creatorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `free_products_per_store` ADD COLUMN `freeProductState` ENUM('ARCHIVED', 'DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `order_items` DROP COLUMN `inventoryId`,
    MODIFY `productId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `storeAddressId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product_categories` DROP COLUMN `productId`;

-- AlterTable
ALTER TABLE `product_discounts_per_store` ADD COLUMN `productDiscountState` ENUM('ARCHIVED', 'DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `products` DROP COLUMN `price`,
    DROP COLUMN `storeId`;

-- AlterTable
ALTER TABLE `stores` DROP COLUMN `address`,
    DROP COLUMN `latitude`,
    DROP COLUMN `longitude`;

-- CreateTable
CREATE TABLE `store_address_histories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `storeId` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `latitude` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_price_histories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `store_address_histories` ADD CONSTRAINT `store_address_histories_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_price_histories` ADD CONSTRAINT `product_price_histories_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brands` ADD CONSTRAINT `brands_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_storeAddressId_fkey` FOREIGN KEY (`storeAddressId`) REFERENCES `store_address_histories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
