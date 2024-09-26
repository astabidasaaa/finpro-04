/*
  Warnings:

  - You are about to drop the `descriptions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `descriptions` DROP FOREIGN KEY `descriptions_productId_fkey`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `description` TEXT NOT NULL;

-- DropTable
DROP TABLE `descriptions`;
