/*
  Warnings:

  - You are about to drop the `_producttoproductsubcategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subcategoryId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_producttoproductsubcategory` DROP FOREIGN KEY `_ProductToProductSubcategory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttoproductsubcategory` DROP FOREIGN KEY `_ProductToProductSubcategory_B_fkey`;

-- AlterTable
ALTER TABLE `orders` MODIFY `orderStatus` ENUM('MENUNGGU_PEMBAYARAN', 'MENUNGGU_KONFIRMASI_PEMBAYARAN', 'DIPROSES', 'DIKIRIM', 'DIKONFIRMASI', 'DIBATALKAN') NOT NULL DEFAULT 'MENUNGGU_PEMBAYARAN';

-- AlterTable
ALTER TABLE `products` ADD COLUMN `subcategoryId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_producttoproductsubcategory`;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `product_subcategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
